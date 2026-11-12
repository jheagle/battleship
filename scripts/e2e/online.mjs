// A full online game in a real browser: the lobby server (started here), a host and a guest in two pages, both
// playing random shots. It must reach the final score on both pages with no page errors. Also reports how much of the
// guest's page each shot changes (elements added/removed, attribute writes), to compare rendering changes.
//   npm run build && node scripts/e2e/online.mjs
import { spawn } from 'node:child_process'
import net from 'node:net'
import {
  attackRandomTarget, clickLabel, clickUntilGone, clickWhenShown, isOver, openGame, report, shotCount, start, trackMutations,
  waitForShot
} from './lib.mjs'

const LIMIT_MS = Number(process.env.E2E_LIMIT_MS ?? 420000)
// The page connects to the lobby on this port (src/network/lobbySocket.ts)
const LOBBY_PORT = 3002

const portTaken = port => new Promise(resolve => {
  const socket = net.connect(port, '127.0.0.1')
  socket.once('connect', () => {
    socket.destroy()
    resolve(true)
  })
  socket.once('error', () => resolve(false))
})

/** Start the lobby server (npm run serve:lobby) and wait for it to listen; resolves to a function that stops it. */
const startLobby = () => new Promise((resolve, reject) => {
  // Its own process group, so stopping it also stops the node process npm started
  const lobby = spawn('npm', ['run', 'serve:lobby'], { stdio: ['ignore', 'pipe', 'pipe'], detached: true })
  const timer = setTimeout(() => reject(new Error('the lobby server did not start within 60 s')), 60000)
  lobby.stdout.on('data', chunk => {
    if (/listening on port/.test(String(chunk))) {
      clearTimeout(timer)
      resolve(() => process.kill(-lobby.pid))
    }
  })
  lobby.once('exit', code => reject(new Error(`the lobby server exited (${code})`)))
})

/** Host a room in one page, join it from the other, and get both through placement to the first turn. */
const setUpGame = async (host, guest) => {
  await clickLabel(host.page, 'Online Multiplayer')
  await clickLabel(host.page, 'Host a Game')
  await host.page.fill('#remote-room-name', 'Check')
  await host.page.fill('#remote-host-name', 'Host')
  await clickLabel(host.page, 'Create')
  // The room code appears once the server has made the room
  const code = await (await host.page.waitForFunction(
    () => document.querySelector('.waiting-room-code')?.textContent.match(/\b[A-Z0-9]{4}\b/)?.[0]
  )).jsonValue()

  await clickLabel(guest.page, 'Online Multiplayer')
  await clickLabel(guest.page, 'Join a Game')
  await guest.page.fill('#remote-code', code)
  await clickLabel(guest.page, 'Find Room')
  await guest.page.fill('#remote-join-name', 'Guest')
  await clickLabel(guest.page, 'Join')
  await host.page.locator('.waiting-room', { hasText: 'Guest' }).waitFor()

  await clickLabel(host.page, 'Start Game')
  // Each screen comes from the server, so wait for it before clicking
  for (const player of [host, guest]) {
    await clickWhenShown(player.page, 'Randomise')
    // Ready only counts once the server has placed the fleet, so it is clicked until the server moves on
    await clickUntilGone(player.page, 'Ready')
  }
  await clickWhenShown(host.page, 'Random')
}

/** The name of the player whose turn it is, from the badge "<name>: ATTACKER", or null between turns. */
const whoseTurn = page => page.evaluate(() => document.body.innerText.match(/(\w+): ATTACKER/)?.[1] ?? null)

/**
 * Play random shots until both pages show the final score: each round, the attacker is the page of the player whose
 * turn it is. The push can come in two parts (the shot, then the turn change), so every round looks for
 * the attacker afresh instead of assuming whose turn it is.
 */
const playOut = async (host, guest, started) => {
  const mutations = await trackMutations(guest.page)
  const perShot = []
  const over = async () => (await isOver(host.page)) && (await isOver(guest.page))
  // stuck grows by 0.1 per round where nothing changed, so 20 is about 200 such rounds in a row
  let stuck = 0
  while (!(await over()) && Date.now() - started < LIMIT_MS && stuck < 20) {
    // Whose turn it is: the player badge saying "<name>: ATTACKER" (both pages mark targets, so that can't tell)
    const name = await whoseTurn(host.page)
    const attacker = name === 'Host' ? host.page : (name === 'Guest' ? guest.page : null)
    if (!attacker) {
      await host.page.waitForTimeout(100)
      stuck += 0.1
      continue
    }
    const before = await shotCount(attacker)
    const roundStarted = Date.now()
    await attackRandomTarget(attacker)
    const shot = await waitForShot(attacker, before, 2000)
    if (process.env.E2E_DEBUG) {
      console.log(`${Math.round((Date.now() - started) / 1000)}s ${attacker === host.page ? 'host' : 'guest'} ` +
        `${shot ? 'shot' : 'no shot'} in ${Date.now() - roundStarted} ms`)
    }
    if (shot) {
      stuck = 0
      perShot.push(await mutations.read())
    } else {
      stuck += 0.1
    }
  }
  return { finished: await over(), perShot, gaveUp: stuck >= 20 }
}

const median = values => values.slice().sort((a, b) => a - b)[Math.floor(values.length / 2)] ?? 0

if (await portTaken(LOBBY_PORT)) {
  console.log(`FAIL online: port ${LOBBY_PORT} is already in use (a lobby server already running?); stop it first`)
  process.exit(1)
}
const stopLobby = await startLobby()
const { browser, url, close } = await start()
try {
  const host = await openGame(browser, url)
  const guest = await openGame(browser, url)
  const started = Date.now()
  await setUpGame(host, guest)
  const { finished, perShot, gaveUp } = await playOut(host, guest, started)
  report('online (host + guest)', {
    finished,
    seconds: Math.round((Date.now() - started) / 1000),
    // Counted as they land: the final score screen replaces the boards
    shots: perShot.length,
    problems: [...host.problems.map(problem => `host ${problem}`), ...guest.problems.map(problem => `guest ${problem}`)],
    extra: `guest page per shot (median): ${median(perShot.map(shot => shot.added))} elements added, ` +
      `${median(perShot.map(shot => shot.attributes))} attribute writes` + (gaveUp ? '; gave up: nothing changed' : '')
  })
} finally {
  // Always stop the browser and the lobby server, also when something above failed
  await close()
  stopLobby()
}
