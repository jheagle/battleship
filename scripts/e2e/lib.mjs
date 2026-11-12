// Shared pieces for the browser game checks (robots.mjs, hotseat.mjs, online.mjs): a real headless Chromium against the
// built game (run `npm run build` first), using js-build-tools' page tools.
import jsBuildTools from 'js-build-tools'
import playwright from 'playwright'

const { clickLabel, serveStatic, trackMutations, watchPage } = jsBuildTools.partials

export { clickLabel, trackMutations }

// Chromium throttles timers and animation frames in a page that isn't in front, which stalls the other players' pages
export const browserArgs = ['--disable-renderer-backgrounding', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows']

/**
 * Serve the repo (index.html + browser/) and start a browser.
 * @returns {Promise<{browser: Object, url: string, close: function(): Promise<void>}>}
 */
export const start = async () => {
  const { server, url } = await serveStatic(process.cwd())
  const browser = await playwright.chromium.launch({ args: browserArgs })
  return {
    browser,
    url,
    close: async () => {
      await browser.close()
      server.close()
    }
  }
}

/**
 * A new page on the game's start screen, with its problems collected.
 * @param {Object} browser
 * @param {string} url
 * @returns {Promise<{page: Object, problems: Array<string>}>}
 */
export const openGame = async (browser, url) => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const problems = watchPage(page)
  await page.goto(`${url}/`)
  await page.waitForSelector('button')
  return { page, problems }
}

/**
 * Wait until a visible control with exactly this label is on the page (for a screen the server is still preparing), then
 * click it in one step inside the page.
 * @param {Object} page
 * @param {string} label
 * @param {number} [timeout=15000]
 */
export const clickWhenShown = async (page, label, timeout = 15000) => {
  // The exact label: "Random" must not be satisfied by a "Randomise" that is still on screen
  await page.waitForFunction(wanted => Array.from(document.querySelectorAll('button, input[type=button]'))
    .some(control => control.offsetParent !== null &&
      (control.tagName === 'INPUT' ? control.value : control.textContent).replace(/\s+/g, ' ').trim() === wanted), label, { timeout })
    .catch(async () => {
      const visible = await page.evaluate(() => Array.from(document.querySelectorAll('button, input[type=button]'))
        .filter(control => control.offsetParent !== null)
        .map(control => `"${(control.tagName === 'INPUT' ? control.value : control.textContent).replace(/\s+/g, ' ').trim()}"`))
      throw new Error(`No control labelled "${label}" appeared within ${timeout} ms. Visible: ${visible.join(', ') || 'none'}`)
    })
  await clickLabel(page, label, { inPage: true })
}

/**
 * Click a control until it goes away (the server took the action and moved on), for an online step whose click can
 * arrive before the server is ready for it. Waits for the control to appear first.
 * @param {Object} page
 * @param {string} label
 * @param {number} [tries=10]
 */
export const clickUntilGone = async (page, label, tries = 10) => {
  const shown = () => page.evaluate(wanted => Array.from(document.querySelectorAll('button, input[type=button]'))
    .some(control => control.offsetParent !== null &&
      (control.tagName === 'INPUT' ? control.value : control.textContent).replace(/\s+/g, ' ').trim() === wanted), label)
  await clickWhenShown(page, label)
  for (let attempt = 1; attempt < tries && await shown(); attempt++) {
    await page.waitForTimeout(500)
    if (await shown()) {
      await clickLabel(page, label, { inPage: true })
    }
  }
}

/** How many cells have been shot, on every board the page shows. */
export const shotCount = page => page.locator('[data-shot]').count()

// The final score screen: local games and online games both end on it, with a Play Again button
const OVER = '.final-scores, input[value="Play Again"], button:has-text("Play Again")'

/** Whether the game is over on this page (its final score screen). */
export const isOver = page => page.locator(OVER).count().then(count => count > 0)

/**
 * Wait for the game to end on this page.
 * @param {Object} page
 * @param {number} timeout
 * @returns {Promise<boolean>} Whether it ended in time.
 */
export const waitForEnd = (page, timeout) => page.locator(OVER).first().waitFor({ timeout }).then(() => true, () => false)

/**
 * Click a cell this page might attack now, in one step inside the page (the online game re-renders while you click).
 * When the page marks the cells it can attack (`.valid-target`, the online game), one of those, at random. Otherwise
 * (local games don't mark them) an unshot cell on a random board: if it is the attacker's own board, nothing happens,
 * and the caller tries again.
 * @param {Object} page
 * @returns {Promise<'target'|'guess'|false>} Which kind of cell was clicked, or false when there was none to click.
 */
export const attackRandomTarget = page => page.evaluate(() => {
  const visible = cell => cell.offsetParent !== null
  const pick = cells => cells[Math.floor(Math.random() * cells.length)]
  const targets = Array.from(document.querySelectorAll('.column.valid-target:not([data-shot])')).filter(visible)
  if (targets.length) {
    pick(targets).click()
    return 'target'
  }
  const boards = Array.from(document.querySelectorAll('.matrix')).filter(visible)
    .map(board => Array.from(board.querySelectorAll('.column:not([data-shot])')).filter(visible))
    .filter(cells => cells.length)
  if (!boards.length) {
    return false
  }
  pick(pick(boards)).click()
  return 'guess'
})

/** How many cells this page marks as ones it can attack now (the online game marks them; local games from their second turn). */
export const targetCount = page => page.evaluate(() => Array.from(document.querySelectorAll('.column.valid-target:not([data-shot])'))
  .filter(cell => cell.offsetParent !== null).length)

/**
 * Wait until the page shows more shots than before, or the game ends.
 * @param {Object} page
 * @param {number} before - The shot count before the attack.
 * @param {number} [timeout=10000]
 * @returns {Promise<boolean>} Whether it happened in time.
 */
export const waitForShot = (page, before, timeout = 10000) => page.waitForFunction(
  count => document.querySelectorAll('[data-shot]').length > count ||
    document.querySelector('.final-scores, input[value="Play Again"]') !== null,
  before,
  { timeout }
).then(() => true, () => false)

/**
 * Report a check's outcome and set the exit code: it passes when the game finished and no page had a problem.
 * @param {string} name
 * @param {{finished: boolean, seconds: number, shots: number, problems: Array<string>, extra?: string}} result
 */
export const report = (name, { finished, seconds, shots, problems, extra = '' }) => {
  const passed = finished && problems.length === 0
  console.log(`${passed ? 'PASS' : 'FAIL'} ${name}: ${finished ? 'finished' : 'did not finish'} in ${seconds} s, ${shots} shots${extra ? ', ' + extra : ''}`)
  problems.forEach(problem => console.log(`  problem: ${problem}`))
  process.exitCode = passed ? 0 : 1
}
