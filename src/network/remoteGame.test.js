/**
 * @jest-environment jsdom
 */
// 'ws' is forced to its real Node implementation (not the browser stub jsdom would otherwise resolve to) for every
// test file via jest.config.js's moduleNameMapper - this file also runs a real socket.io server in-process, which
// needs it.
import { Server } from 'socket.io'
import { createServer } from 'http'
import treeloom from 'treeloom'
import treeloomMatrix from 'treeloom-matrix'
import { enterRemoteGame, leaveRemoteGame } from './remoteGame'
import gameRoot from '../setup/gameRoot'
import { connectLobbySocket, disconnectLobbySocket } from './lobbySocket'

let httpServer
let io
let baseUrl
let gameActionReceived

beforeEach(async () => {
  httpServer = createServer()
  io = new Server(httpServer, { cors: { origin: '*' } })
  gameActionReceived = false
  // Registered before any client ever connects - io.on('connection', ...) only ever catches connections that
  // happen *after* it is registered, so doing this per-test after connectLobbySocket (which connects
  // immediately) would silently miss the one and only connection a test makes.
  io.on('connection', clientSocket => clientSocket.on('gameAction', () => { gameActionReceived = true }))
  await new Promise(resolve => httpServer.listen(0, resolve))
  baseUrl = `http://localhost:${httpServer.address().port}`
})

afterEach(async () => {
  disconnectLobbySocket()
  await new Promise(resolve => httpServer.close(resolve))
})

/** A minimal fake redacted body, just real enough for renderInto/isGameOver to accept - a bare socket.io
 * server stands in for the real lobby server here, so no real room/game/placement is needed at all to prove
 * the forwarding toggle itself works. */
const bodyWithClass = className => ({ children: [{ nodeName: 'div', attributes: { className }, children: [] }] })

/** A fake push with one clickable button inside it, wired to the given listener name - used to prove which
 * listener a real click actually resolves to (not just that root.forwardEvents itself ends up correct):
 * treeloom decides forward-vs-real once, at render/bind time (activateListener calls retrieveListener there),
 * so toggling root.forwardEvents after rendering has no effect on anything already bound - the real bug this
 * covers, found by real testing after PR #124 merged. */
const bodyWithButton = (className, listenerFunc) => ({
  children: [{
    nodeName: 'div',
    attributes: { className },
    children: [{
      nodeName: 'button',
      attributes: { className: 'the-button', type: 'button' },
      eventListeners: { click: [{ listenerFunc, listenerArgs: {}, listenerOptions: false }] }
    }]
  }]
})

const waitFor = async (check, timeoutMs = 2000) => {
  const start = Date.now()
  while (!check()) {
    if (Date.now() - start > timeoutMs) {
      throw new Error('Timed out waiting for condition')
    }
    await new Promise(resolve => setTimeout(resolve, 20))
  }
}

describe('enterRemoteGame: forwarding toggles off once the game ends, and back on for a fresh one', () => {
  test('forwarding starts on, turns off on a final-scores push, and back on for whatever comes after', async () => {
    const socket = connectLobbySocket(baseUrl)
    await waitFor(() => socket.connected)
    const root = treeloom.documentDomItem({})

    enterRemoteGame(root, bodyWithClass('boards'))
    expect(root.forwardEvents).toBeDefined()

    io.emit('gameUpdate', bodyWithClass('final-scores'))
    await waitFor(() => !root.forwardEvents)

    // Play Again succeeded and a fresh game started - forwarding has to resume for it.
    io.emit('gameUpdate', bodyWithClass('boards'))
    await waitFor(() => Boolean(root.forwardEvents))
  })

  test('leaveRemoteGame always turns forwarding off and clears the rendered tree, regardless of game-over state', () => {
    const root = treeloom.documentDomItem({})
    enterRemoteGame(root, bodyWithClass('boards'))
    expect(root.body.children).toHaveLength(1)

    leaveRemoteGame(root)
    expect(root.forwardEvents).toBeUndefined()
    expect(root.body.children).toHaveLength(0)
  })

  // The real bug this covers: a game-over push is never *just* final-scores on its own - boards (still
  // holding every placement panel) and remote-ordering (only ever hidden via style, never removed) used to
  // stay in the body as stale siblings too, both still referencing remotePlacementListener - a name the real
  // client never registers directly (see main.ts; forwarding being on is what normally makes that safe, since
  // retrieveListener forwards *before* ever checking whether a name is really registered). Once forwarding
  // turns off for the finished game, rendering that stale sibling threw "Undefined listener function" partway
  // through renderInto's own loop - *before* final-scores itself ever rendered, clearing the whole page with
  // nothing on it at all. Fixed server-side (server/gameplay.ts's onGameOver now clears the body first), but
  // this is what a real client actually has to survive regardless of where else it gets fixed.
  test('a game-over push with a stale boards sibling (the real shape, if anything upstream ever regresses) does not crash rendering', async () => {
    const socket = connectLobbySocket(baseUrl)
    await waitFor(() => socket.connected)
    // Only the listeners main.ts actually registers - remotePlacementListener is deliberately missing, exactly
    // like the real app, since it only ever needs to run as a forwarder during an active game.
    const root = treeloom.documentDomItem({ attackListener: jest.fn() })
    const staleBoardsAndFinalScores = {
      children: [
        {
          nodeName: 'div',
          attributes: { className: 'boards' },
          children: [{
            nodeName: 'div',
            attributes: { className: 'remote-placement-panel' },
            children: [{
              nodeName: 'button',
              attributes: { className: 'remote-placement-ready' },
              eventListeners: { click: [{ listenerFunc: 'remotePlacementListener', listenerArgs: {}, listenerOptions: false }] }
            }]
          }]
        },
        bodyWithClass('final-scores').children[0]
      ]
    }

    expect(() => enterRemoteGame(root, staleBoardsAndFinalScores)).not.toThrow()
    expect(document.querySelector('.final-scores')).not.toBeNull()
  })

  // The real bug this covers: root.forwardEvents only decides whether a button forwards or runs a real local
  // listener once, at the moment renderInto actually binds it (treeloom's activateListener calls
  // retrieveListener right then) - toggling the flag afterwards does nothing to anything already bound. A
  // final-scores push's own Play Again button was being rendered (and bound as a forwarder) before forwarding
  // was turned off, so clicking it silently forwarded to a no-op on the server instead of running locally.
  test('a final-scores push\'s own button really does run as a local listener, not a forwarded one', async () => {
    const socket = connectLobbySocket(baseUrl)
    await waitFor(() => socket.connected)
    const localListener = jest.fn()
    const root = treeloom.documentDomItem({ localListener })

    enterRemoteGame(root, bodyWithButton('final-scores', 'localListener'))
    document.querySelector('.the-button').click()

    expect(localListener).toHaveBeenCalledTimes(1)
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(gameActionReceived).toBe(false)
  })

  test('a normal (not final-scores) push\'s own button still forwards to the server, as always', async () => {
    const socket = connectLobbySocket(baseUrl)
    await waitFor(() => socket.connected)
    const localListener = jest.fn()
    const root = treeloom.documentDomItem({ localListener })

    enterRemoteGame(root, bodyWithButton('boards', 'localListener'))
    document.querySelector('.the-button').click()

    await waitFor(() => gameActionReceived)
    expect(localListener).not.toHaveBeenCalled()
  })

  test('after a final-scores push, a later normal push\'s own button forwards again - not stuck on local', async () => {
    const socket = connectLobbySocket(baseUrl)
    await waitFor(() => socket.connected)
    const localListener = jest.fn()
    const root = treeloom.documentDomItem({ localListener })

    enterRemoteGame(root, bodyWithClass('final-scores'))
    io.emit('gameUpdate', bodyWithButton('boards', 'localListener'))
    await waitFor(() => document.querySelector('.the-button') !== null)
    document.querySelector('.the-button').click()

    await waitFor(() => gameActionReceived)
    expect(localListener).not.toHaveBeenCalled()
  })
})

describe('enterRemoteGame: the boards stay keyboard navigable across re-renders', () => {
  // A board as the server sends it: built like buildPlayers builds one, then through json (forTransport), which drops
  // navigableGrid's function listeners but keeps the named attackListener
  const boardsBody = () => {
    const board = treeloomMatrix.navigableGrid(treeloomMatrix.square({
      matrix: { eventListeners: { click: [{ listenerFunc: 'attackListener', listenerArgs: {}, listenerOptions: false }] } }
    }, 3))
    return { children: [{ nodeName: 'div', attributes: { className: 'boards' }, children: [JSON.parse(treeloom.domItemToJson(board))] }] }
  }
  const cellAt = (x, y) => document.querySelector('.boards [role="grid"]').children[0].children[y].children[x]
  const press = (element, key) => element.dispatchEvent(new window.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))

  test('arrow keys work on a board rendered from a push, and Enter is forwarded as a click', async () => {
    const socket = connectLobbySocket(baseUrl)
    await waitFor(() => socket.connected)
    const root = treeloom.documentDomItem({})
    enterRemoteGame(root, boardsBody())
    cellAt(0, 0).focus()
    press(cellAt(0, 0), 'ArrowRight')
    expect(document.activeElement).toBe(cellAt(1, 0))
    expect(gameActionReceived).toBe(false)
    press(cellAt(1, 0), 'Enter')
    await waitFor(() => gameActionReceived)
    leaveRemoteGame(root)
  })

  test('the next push is reconciled: the same elements stay, with focus and the Tab stop where they were', async () => {
    const socket = connectLobbySocket(baseUrl)
    await waitFor(() => socket.connected)
    const root = treeloom.documentDomItem({})
    enterRemoteGame(root, boardsBody())
    cellAt(0, 0).focus()
    press(cellAt(0, 0), 'ArrowDown')
    press(document.activeElement, 'ArrowRight')
    const focused = document.activeElement
    const grid = document.querySelector('.boards [role="grid"]')
    let pushed = false
    socket.once('gameUpdate', () => { pushed = true })
    io.emit('gameUpdate', boardsBody())
    await waitFor(() => pushed)
    expect(document.querySelector('.boards [role="grid"]')).toBe(grid)
    expect(cellAt(1, 1)).toBe(focused)
    expect(document.activeElement).toBe(focused)
    expect([...document.querySelectorAll('.boards [tabindex="0"]')]).toEqual([cellAt(1, 1)])
    // Keyboard navigation still works on the kept board, and Enter still forwards
    press(document.activeElement, 'ArrowRight')
    expect(document.activeElement).toBe(cellAt(2, 1))
    press(document.activeElement, 'Enter')
    await waitFor(() => gameActionReceived)
    leaveRemoteGame(root)
  })

  test('a push only changes what differs: a changed attribute is written, the other elements are untouched', async () => {
    const socket = connectLobbySocket(baseUrl)
    await waitFor(() => socket.connected)
    const root = treeloom.documentDomItem({})
    enterRemoteGame(root, boardsBody())
    const cells = [...document.querySelectorAll('.boards [role="gridcell"]')]
    const next = boardsBody()
    // Mark one cell, as a shot does
    const target = next.children[0].children[0].children[0].children[1].children[2]
    target.attributes = { ...target.attributes, className: `${target.attributes.className ?? ''} hit`.trim() }
    const writes = []
    const observer = new window.MutationObserver(records => writes.push(...records))
    observer.observe(document.body, { subtree: true, childList: true, attributes: true })
    let pushed = false
    socket.once('gameUpdate', () => { pushed = true })
    io.emit('gameUpdate', next)
    await waitFor(() => pushed)
    await new Promise(resolve => setTimeout(resolve, 0))
    observer.disconnect()
    expect([...document.querySelectorAll('.boards [role="gridcell"]')]).toEqual(cells)
    expect(cellAt(2, 1).classList).toContain('hit')
    expect(writes.filter(record => record.type === 'childList')).toEqual([])
    expect(new Set(writes.map(record => record.target))).toEqual(new Set([cellAt(2, 1)]))
    leaveRemoteGame(root)
  })

  test('a push can add and remove children, and the rest stays', async () => {
    const socket = connectLobbySocket(baseUrl)
    await waitFor(() => socket.connected)
    const root = treeloom.documentDomItem({})
    enterRemoteGame(root, boardsBody())
    const grid = document.querySelector('.boards [role="grid"]')
    const withPanel = boardsBody()
    withPanel.children.push({ nodeName: 'div', attributes: { className: 'placement-panel' }, children: [{ nodeName: 'p', children: [{ nodeName: '#text', nodeValue: 'Place your fleet' }] }] })
    let pushes = 0
    socket.on('gameUpdate', () => { pushes++ })
    io.emit('gameUpdate', withPanel)
    await waitFor(() => pushes === 1)
    expect(document.querySelector('.placement-panel').textContent).toBe('Place your fleet')
    expect(document.querySelector('.boards [role="grid"]')).toBe(grid)
    io.emit('gameUpdate', boardsBody())
    await waitFor(() => pushes === 2)
    expect(document.querySelector('.placement-panel')).toBeNull()
    expect(document.querySelector('.boards [role="grid"]')).toBe(grid)
    leaveRemoteGame(root)
  })

  test("in the game's own root, the <main> keeps its element, class and data across pushes", async () => {
    const socket = connectLobbySocket(baseUrl)
    await waitFor(() => socket.connected)
    document.body.innerHTML = ''
    const root = gameRoot({})
    const main = root.body.element
    const before = { nodeName: root.body.nodeName, attributes: { ...root.body.attributes }, id: root.body.id }
    enterRemoteGame(root, boardsBody())
    let pushes = 0
    socket.on('gameUpdate', () => { pushes++ })
    io.emit('gameUpdate', boardsBody())
    await waitFor(() => pushes === 1)
    expect(root.body.element).toBe(main)
    expect(document.querySelector('main')).toBe(main)
    expect(main.classList).toContain('game')
    expect({ nodeName: root.body.nodeName, attributes: { ...root.body.attributes }, id: root.body.id }).toEqual(before)
    expect(main.querySelector('.boards [role="grid"]')).not.toBeNull()
    leaveRemoteGame(root)
  })

  test('if reconciling a push throws, it is rendered in full instead (the page never stays stale)', async () => {
    const socket = connectLobbySocket(baseUrl)
    await waitFor(() => socket.connected)
    const root = treeloom.documentDomItem({})
    enterRemoteGame(root, boardsBody())
    const grid = document.querySelector('.boards [role="grid"]')
    const reconcile = jest.spyOn(treeloom, 'reconcile').mockImplementationOnce(() => { throw new Error('boom') })
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      let pushed = false
      socket.once('gameUpdate', () => { pushed = true })
      io.emit('gameUpdate', bodyWithClass('placement-panel'))
      await waitFor(() => pushed)
      expect(reconcile).toHaveBeenCalledTimes(1)
      expect(document.body.contains(grid)).toBe(false)
      expect(document.querySelector('.placement-panel')).not.toBeNull()
      expect(warn).toHaveBeenCalled()
    } finally {
      reconcile.mockRestore()
      warn.mockRestore()
      leaveRemoteGame(root)
    }
  })

  test('the switch to final scores and back renders in full, so listeners bind in the right mode', async () => {
    const socket = connectLobbySocket(baseUrl)
    await waitFor(() => socket.connected)
    const root = treeloom.documentDomItem({})
    enterRemoteGame(root, boardsBody())
    const grid = document.querySelector('.boards [role="grid"]')
    let pushes = 0
    socket.on('gameUpdate', () => { pushes++ })
    io.emit('gameUpdate', bodyWithClass('final-scores'))
    await waitFor(() => pushes === 1)
    expect(document.body.contains(grid)).toBe(false)
    io.emit('gameUpdate', boardsBody())
    await waitFor(() => pushes === 2)
    expect(document.querySelector('.boards [role="grid"]')).not.toBe(grid)
    expect(root.forwardEvents).toBeTruthy()
    leaveRemoteGame(root)
  })
})

describe('enterRemoteGame: the countdown', () => {
  test('is a timer in the page header, not loose in the body', () => {
    // The browser's real root: the game renders into <main>, under the header (see gameRoot)
    document.body.innerHTML = ''
    const root = gameRoot({})
    enterRemoteGame(root, { attributes: { 'data-turn-deadline': String(Date.now() + 30000) }, ...bodyWithClass('boards') })
    const countdown = document.querySelector('.remote-countdown')
    expect(countdown.getAttribute('role')).toBe('timer')
    expect(countdown.parentElement).toBe(document.querySelector('header.game-header'))
    expect(document.querySelector('main .boards')).not.toBeNull()
    leaveRemoteGame(root)
    expect(document.querySelector('.remote-countdown')).toBeNull()
  })
})
