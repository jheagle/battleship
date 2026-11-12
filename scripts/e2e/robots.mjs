// A full "Robots only" game in a real browser: it must reach the final score with no page errors.
//   npm run build && node scripts/e2e/robots.mjs
import { clickLabel, openGame, report, runCheck, shotCount, start, waitForEnd } from './lib.mjs'

const LIMIT_MS = Number(process.env.E2E_LIMIT_MS ?? 240000)

const { browser, url, close } = await start()
await runCheck('robots only', async () => {
  const { page, problems } = await openGame(browser, url)
  const started = Date.now()
  // The menu opens the robots game's settings; Start begins it (the intro's own demo game runs behind the menu until then)
  await clickLabel(page, 'Robots only')
  await clickLabel(page, 'Start')
  const finished = await waitForEnd(page, LIMIT_MS)
  report('robots only', {
    finished,
    seconds: Math.round((Date.now() - started) / 1000),
    shots: await shotCount(page),
    problems
  })
}, close)
