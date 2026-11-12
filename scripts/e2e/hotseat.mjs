// A full local multiplayer (hot-seat, one screen) game in a real browser, two humans playing random shots: it must
// reach the final score with no page errors.
//   npm run build && node scripts/e2e/hotseat.mjs
import { attackRandomTarget, clickLabel, isOver, openGame, report, shotCount, start, waitForShot } from './lib.mjs'

const LIMIT_MS = Number(process.env.E2E_LIMIT_MS ?? 300000)
// The screens between turns, which hand the device to the next player
const PASS = /^(Continue|Ready|Start turn|OK)$/

const { browser, url, close } = await start()
const { page, problems } = await openGame(browser, url)
const started = Date.now()
await clickLabel(page, 'Multiplayer')
await clickLabel(page, 'Start')
for (let player = 0; player < 2; player++) {
  await clickLabel(page, 'Continue')
  await clickLabel(page, 'Randomise')
  await clickLabel(page, 'Done')
}
await clickLabel(page, 'Random')

// stuck grows by 0.1 per click that changed nothing, so 20 is about 200 such clicks in a row
let stuck = 0
while (!(await isOver(page)) && Date.now() - started < LIMIT_MS && stuck < 20) {
  const pass = page.locator('button:visible, input[type=button]:visible').filter({ hasText: PASS })
  if (await pass.count()) {
    await pass.first().click()
    continue
  }
  const before = await shotCount(page)
  const clicked = await attackRandomTarget(page)
  if (!clicked) {
    // Between turns (the order being chosen, an animation): wait for something to change
    await page.waitForTimeout(250)
    stuck++
    continue
  }
  // A shot lands in ~30 ms. A click right after a shot is ignored (the attack lock, ATTACKER_LOCK_MS) and a guess on the
  // attacker's own board does nothing, so a click that changed nothing is simply tried again soon
  const shot = await waitForShot(page, before, clicked === 'guess' ? 400 : 800)
  stuck = shot ? 0 : stuck + 0.1
}
report('local multiplayer (hot-seat)', {
  finished: await isOver(page),
  seconds: Math.round((Date.now() - started) / 1000),
  shots: await shotCount(page),
  problems,
  extra: stuck >= 20 ? 'gave up: ~200 clicks in a row changed nothing' : ''
})
await close()
