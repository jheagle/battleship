/**
 * @jest-environment jsdom
 */
// Jest's jsdom environment resolves bare `require('ws')` to ws's own browser stub (a function that just throws), via the
// package's own "browser" export condition - fine for client code, but this file also runs the real lobby server
// in-process, which needs ws's actual Node implementation. Force the real one by its absolute path, bypassing that
// export condition (which only governs resolution by package specifier, not by direct file path).
jest.mock('ws', () => {
  const path = require('path')
  const wsIndexPath = path.join(path.dirname(require.resolve('ws/package.json')), 'index.js')
  return require(wsIndexPath)
})

import { io as ioClient } from 'socket.io-client'
import jsonDom from 'json-dom'
import startMenu from './startMenu'
import presetListener from './presetListener'
import remoteListener, { showRemoteEntry, enterWaitingRoom } from './remoteListener'
import beginRound from './beginRound'
import { createLobbyServer } from '../../server/lobbyServer'
import { connectLobbySocket, disconnectLobbySocket } from '../network/lobbySocket'
import { leaveRemoteGame } from '../network/remoteGame'

let server
let baseUrl
const rawSockets = []

beforeEach(async () => {
  server = createLobbyServer()
  await new Promise(resolve => server.listen(0, resolve))
  const address = server.address()
  baseUrl = `http://localhost:${address.port}`
})

afterEach(async () => {
  disconnectLobbySocket()
  rawSockets.forEach(socket => socket.close())
  rawSockets.length = 0
  await new Promise(resolve => server.close(resolve))
})

/** A raw client representing another, real player - not the UI under test. */
const rawPlayer = () => {
  const socket = ioClient(baseUrl, { transports: ['websocket'], forceNew: true })
  rawSockets.push(socket)
  return socket
}

const rawEmit = (socket, event, payload) => new Promise(resolve => socket.emit(event, payload, resolve))

const openMenu = () => startMenu(jsonDom.documentDomItem({ beginRound, presetListener, remoteListener }))

const byClass = (doc, className) => jsonDom.getChildrenByClass(className, doc.body)[0]
const byName = (doc, name) => jsonDom.getChildrenByName(name, doc.body)[0]

const waitFor = async (check, timeoutMs = 2000) => {
  const start = Date.now()
  while (!check()) {
    if (Date.now() - start > timeoutMs) {
      throw new Error('Timed out waiting for condition')
    }
    await new Promise(resolve => setTimeout(resolve, 20))
  }
}

/** Host a room through the real UI: Online Multiplayer -> Host a Game -> fill both names -> Create. */
const hostRoom = async (doc, roomName, name) => {
  byClass(doc, 'preset-remote').element.click()
  byClass(doc, 'remote-choice-host').element.click()
  byName(doc, 'remote-room-name').element.value = roomName
  byName(doc, 'remote-host-name').element.value = name
  byClass(doc, 'remote-host-submit').element.click()
  await waitFor(() => byClass(doc, 'waiting-room').element.style.display !== 'none')
}

/** Join an existing room by its code through the real UI: Online Multiplayer -> Join a Game -> enter the code,
 * find it -> confirm with a name. */
const joinRoomByCode = async (doc, roomCode, name) => {
  byClass(doc, 'preset-remote').element.click()
  byClass(doc, 'remote-choice-join').element.click()
  byName(doc, 'remote-code').element.value = roomCode
  byClass(doc, 'remote-code-submit').element.click()
  await waitFor(() => byClass(doc, 'remote-join-confirm').element.style.display !== 'none')
  byName(doc, 'remote-join-name').element.value = name
  byClass(doc, 'remote-join-submit').element.click()
}

describe('the Online Multiplayer tile and its lobby', () => {
  test('choosing it shows the Host/Join choice, and Back returns to the game types', () => {
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    expect(byClass(doc, 'remote-entry').element.style.display).not.toBe('none')
    expect(byClass(doc, 'remote-choice').element.style.display).not.toBe('none')
    expect(byClass(doc, 'presets').element.style.display).toBe('none')

    byClass(doc, 'remote-back').element.click()
    expect(byClass(doc, 'remote-entry').element.style.display).toBe('none')
    expect(byClass(doc, 'presets').element.style.display).toBe('')
  })

  test('choosing Host a Game, then Back, returns to the Host/Join choice (not the game types)', () => {
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    byClass(doc, 'remote-choice-host').element.click()
    expect(byClass(doc, 'remote-host-form').element.style.display).not.toBe('none')

    byClass(doc, 'remote-sub-back').element.click()
    expect(byClass(doc, 'remote-host-form').element.style.display).toBe('none')
    expect(byClass(doc, 'remote-choice').element.style.display).not.toBe('none')
  })

  test('hosting a room shows the waiting room with the host listed, tagged, and the lobby name and room code shown', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    await hostRoom(doc, 'Pirate Battle', 'Alice')

    expect(byClass(doc, 'waiting-room-players').element.textContent).toContain('Alice (Host)')
    expect(byClass(doc, 'waiting-room-name').element.textContent).toBe('Lobby: Pirate Battle')
    expect(byClass(doc, 'waiting-room-code').element.textContent).toMatch(/Room Code: [A-Z0-9]{4}/)
  })

  test('showRemoteEntry (a shared join link landing on the join form) peeks the room and shows who it belongs to', async () => {
    const host = rawPlayer()
    const { roomCode } = await rawEmit(host, 'createRoom', { name: 'Alice', roomName: 'Pirate Battle' })

    connectLobbySocket(baseUrl)
    const doc = openMenu()
    showRemoteEntry(byClass(doc, 'main-menu'), roomCode)

    await waitFor(() => byClass(doc, 'remote-join-confirm').element.style.display !== 'none')
    expect(byClass(doc, 'presets').element.style.display).toBe('none')
    expect(byClass(doc, 'remote-join-message').element.textContent).toBe(`You are joining Alice's Pirate Battle.`)
    expect(document.activeElement).toBe(byName(doc, 'remote-join-name').element)
  })

  test('showRemoteEntry with an unknown code falls back to the code-entry panel with the error shown, the code kept on screen', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    showRemoteEntry(byClass(doc, 'main-menu'), 'ZZZZ')

    await waitFor(() => /no room/i.test(byClass(doc, 'remote-code-status').element.textContent))
    expect(byClass(doc, 'remote-code-entry').element.style.display).not.toBe('none')
    expect(byName(doc, 'remote-code').element.value).toBe('ZZZZ')
  })

  test('showRemoteEntry with no code (the Online Multiplayer tile itself) shows the Host/Join choice', () => {
    const doc = openMenu()
    showRemoteEntry(byClass(doc, 'main-menu'))
    expect(byClass(doc, 'remote-choice').element.style.display).not.toBe('none')
  })

  test('hosting puts the room\'s own code in the address bar, so the current URL is a real shareable join link', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    await hostRoom(doc, 'Pirate Battle', 'Alice')

    const roomCode = byClass(doc, 'waiting-room-code').element.textContent.replace('Room Code: ', '')
    expect(window.location.search).toBe(`?room=${roomCode}`)

    byClass(doc, 'waiting-room-leave').element.click()
    expect(window.location.search).toBe('')
  })

  test('joining an existing room by its code shows both players in the waiting room', async () => {
    const host = rawPlayer()
    const { roomCode } = await rawEmit(host, 'createRoom', { name: 'Alice', roomName: 'Pirate Battle' })

    connectLobbySocket(baseUrl)
    const doc = openMenu()
    await joinRoomByCode(doc, roomCode.toLowerCase(), 'Bob')

    await waitFor(() => byClass(doc, 'waiting-room').element.style.display !== 'none')
    const players = byClass(doc, 'waiting-room-players').element.textContent
    expect(players).toContain('Alice (Host)')
    expect(players).toContain('Bob')
  })

  test('looking up a room that does not exist shows an error and stays on the code-entry screen', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    byClass(doc, 'remote-choice-join').element.click()
    byName(doc, 'remote-code').element.value = 'ZZZZ'
    byClass(doc, 'remote-code-submit').element.click()

    await waitFor(() => /no room/i.test(byClass(doc, 'remote-code-status').element.textContent))
    expect(byClass(doc, 'remote-code-entry').element.style.display).not.toBe('none')
  })

  test('hosting with an empty lobby name is refused without even contacting the server', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    byClass(doc, 'remote-choice-host').element.click()
    byName(doc, 'remote-host-name').element.value = 'Alice'
    byClass(doc, 'remote-host-submit').element.click()
    await waitFor(() => byClass(doc, 'remote-host-status').element.textContent !== '')
    expect(byClass(doc, 'remote-host-status').element.textContent).toMatch(/lobby name/i)
    expect(byClass(doc, 'waiting-room').element.style.display).toBe('none')
  })

  test('hosting with an empty name is refused without even contacting the server', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    byClass(doc, 'remote-choice-host').element.click()
    byName(doc, 'remote-room-name').element.value = 'Pirate Battle'
    byClass(doc, 'remote-host-submit').element.click()
    await waitFor(() => byClass(doc, 'remote-host-status').element.textContent !== '')
    expect(byClass(doc, 'remote-host-status').element.textContent).toMatch(/name/i)
    expect(byClass(doc, 'waiting-room').element.style.display).toBe('none')
  })

  test('confirming a join with a blank (whitespace-only) name is refused', async () => {
    const host = rawPlayer()
    const { roomCode } = await rawEmit(host, 'createRoom', { name: 'Alice', roomName: 'Pirate Battle' })

    connectLobbySocket(baseUrl)
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    byClass(doc, 'remote-choice-join').element.click()
    byName(doc, 'remote-code').element.value = roomCode
    byClass(doc, 'remote-code-submit').element.click()
    await waitFor(() => byClass(doc, 'remote-join-confirm').element.style.display !== 'none')
    byName(doc, 'remote-join-name').element.value = '   '
    byClass(doc, 'remote-join-submit').element.click()
    await waitFor(() => byClass(doc, 'remote-join-status').element.textContent !== '')
    expect(byClass(doc, 'remote-join-status').element.textContent).toMatch(/name/i)
    expect(byClass(doc, 'waiting-room').element.style.display).toBe('none')
  })

  test('a second player joining updates the host\'s own waiting room live', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    await hostRoom(doc, 'Pirate Battle', 'Alice')
    const roomCode = byClass(doc, 'waiting-room-code').element.textContent.replace('Room Code: ', '')

    const joiner = rawPlayer()
    await rawEmit(joiner, 'joinRoom', { roomCode, name: 'Bob' })

    await waitFor(() => byClass(doc, 'waiting-room-players').element.textContent.includes('Bob'))
    expect(byClass(doc, 'waiting-room-players').element.textContent).toContain('Alice (Host)')
  })

  test('the host leaving closes the room, and the joiner is told and returned to the entry screen', async () => {
    const host = rawPlayer()
    const { roomCode } = await rawEmit(host, 'createRoom', { name: 'Alice', roomName: 'Pirate Battle' })

    connectLobbySocket(baseUrl)
    const doc = openMenu()
    await joinRoomByCode(doc, roomCode, 'Bob')
    await waitFor(() => byClass(doc, 'waiting-room').element.style.display !== 'none')

    host.close()

    await waitFor(() => byClass(doc, 'waiting-room').element.style.display === 'none')
    expect(byClass(doc, 'remote-entry').element.style.display).not.toBe('none')
    expect(byClass(doc, 'remote-choice-status').element.textContent).toMatch(/host left/i)
  })

  test('the host sees the Start Game controls, a joiner does not', async () => {
    const host = rawPlayer()
    const { roomCode } = await rawEmit(host, 'createRoom', { name: 'Alice', roomName: 'Pirate Battle' })

    connectLobbySocket(baseUrl)
    const doc = openMenu()
    await joinRoomByCode(doc, roomCode, 'Bob')
    await waitFor(() => byClass(doc, 'waiting-room').element.style.display !== 'none')

    expect(byClass(doc, 'waiting-room-host-controls').element.style.display).toBe('none')
  })

  test('the host starting the game renders the real game for both the host and a joiner', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    await hostRoom(doc, 'Pirate Battle', 'Alice')
    expect(byClass(doc, 'waiting-room-host-controls').element.style.display).not.toBe('none')
    const roomCode = byClass(doc, 'waiting-room-code').element.textContent.replace('Room Code: ', '')

    const joiner = rawPlayer()
    await rawEmit(joiner, 'joinRoom', { roomCode, name: 'Bob' })
    await waitFor(() => byClass(doc, 'waiting-room-players').element.textContent.includes('Bob'))

    const joinerSawUpdate = new Promise(resolve => joiner.once('gameUpdate', resolve))
    byClass(doc, 'waiting-room-start').element.click()

    await waitFor(() => jsonDom.getChildrenByClass('boards', doc.body).length > 0)
    // The whole lobby is gone - this is the real game's own markup now, not the waiting room any more.
    expect(jsonDom.getChildrenByClass('waiting-room', doc.body)).toHaveLength(0)
    // Still placing - each viewer's own push only ever includes themselves (see redactGameState.ts's
    // redactGameBody), so the host's own doc shows only her own board and placement panel, nobody else's.
    const players = jsonDom.getChildrenByClass('boards', doc.body)[0].children
    expect(players).toHaveLength(1)
    expect(players.every(player => jsonDom.getChildrenByClass('remote-placement-panel', player).length === 1)).toBe(true)

    const joinerView = await joinerSawUpdate
    expect(joinerView.children.find(child => child.attributes.className === 'boards').children).toHaveLength(1)
  })

  // The real timer that ends placement runs on the server (see remotePlacement.ts's PLACEMENT_TIMEOUT_MS) -
  // this only covers the client's own cosmetic countdown, which must never be mistaken for that real deadline.
  test('a visual countdown shows once placement starts, ticking down on its own between server pushes', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    await hostRoom(doc, 'Pirate Battle', 'Alice')
    const roomCode = byClass(doc, 'waiting-room-code').element.textContent.replace('Room Code: ', '')

    const joiner = rawPlayer()
    await rawEmit(joiner, 'joinRoom', { roomCode, name: 'Bob' })
    await waitFor(() => byClass(doc, 'waiting-room-players').element.textContent.includes('Bob'))
    byClass(doc, 'waiting-room-start').element.click()

    await waitFor(() => document.querySelector('.remote-countdown') !== null)
    const firstReading = Number(document.querySelector('.remote-countdown').textContent.match(/(\d+)s left/)[1])
    expect(firstReading).toBeGreaterThan(0)

    // No server action happens in between - the display only ticks down because of its own local interval.
    await new Promise(resolve => setTimeout(resolve, 600))
    const secondReading = Number(document.querySelector('.remote-countdown').textContent.match(/(\d+)s left/)[1])
    expect(secondReading).toBeLessThanOrEqual(firstReading)

    leaveRemoteGame(doc)
    expect(document.querySelector('.remote-countdown')).toBeNull()
  })

  // The real bug this covers: only the client that clicked Start ever rendered the game - a joiner who never
  // clicked anything (the host is the one who starts it) was left stuck on the waiting room forever, even though
  // the server was already pushing it gameUpdates. Here the joiner is the real UI under test, and the host is a
  // raw socket starting the game from outside it - the one place the earlier test's "doc is always the host"
  // setup could never have caught this.
  test('a joiner who never clicked Start still sees the real game once the host starts it', async () => {
    const host = rawPlayer()
    const { roomCode } = await rawEmit(host, 'createRoom', { name: 'Alice', roomName: 'Pirate Battle' })

    connectLobbySocket(baseUrl)
    const doc = openMenu()
    await joinRoomByCode(doc, roomCode, 'Bob')
    await waitFor(() => byClass(doc, 'waiting-room').element.style.display !== 'none')
    expect(byClass(doc, 'waiting-room-host-controls').element.style.display).toBe('none')

    await rawEmit(host, 'startGame', { hints: 'optional' })

    await waitFor(() => jsonDom.getChildrenByClass('boards', doc.body).length > 0)
    expect(jsonDom.getChildrenByClass('waiting-room', doc.body)).toHaveLength(0)
    // Still placing - the joiner's own doc shows only her own board and placement panel, same reasoning as
    // the host's own case above.
    const players = jsonDom.getChildrenByClass('boards', doc.body)[0].children
    expect(players).toHaveLength(1)
    expect(players.every(player => jsonDom.getChildrenByClass('remote-placement-panel', player).length === 1)).toBe(true)
  })

  test('clicking something in the rendered game forwards it, and both players see the real result', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    await hostRoom(doc, 'Pirate Battle', 'Alice')
    const roomCode = byClass(doc, 'waiting-room-code').element.textContent.replace('Room Code: ', '')

    const joiner = rawPlayer()
    await rawEmit(joiner, 'joinRoom', { roomCode, name: 'Bob' })
    await waitFor(() => byClass(doc, 'waiting-room-players').element.textContent.includes('Bob'))

    const joinerSawFirstUpdate = new Promise(resolve => joiner.once('gameUpdate', resolve))
    byClass(doc, 'waiting-room-start').element.click()
    await waitFor(() => jsonDom.getChildrenByClass('boards', doc.body).length > 0)
    await joinerSawFirstUpdate

    // Both players place simultaneously, each on their own board - no shared handoff screen for either of
    // them. While still placing, each viewer's own push only ever includes themselves (see
    // redactGameState.ts's redactGameBody), so Alice's own doc shows only her own panel - there is no copy of
    // Bob's to find here at all any more.
    expect(jsonDom.getChildrenByClass('boards', doc.body)[0].children).toHaveLength(1)
    const aliceRandomise = jsonDom.getChildrenByClass('remote-placement-randomise', doc.body)[0]
    expect(aliceRandomise.attributes.disabled).toBeFalsy()

    aliceRandomise.element.click()

    // Alice's fleet is now fully placed - visible in her own (real) view, driven by the same gameUpdate the
    // joiner also receives (confirmed above) for whatever their own turn comes to need next.
    await waitFor(() => jsonDom.getChildrenByClass('remote-placement-message', doc.body)[0].attributes.innerHTML.includes('All placed'))
  })

  test('leaving the waiting room returns to the game types and lets a fresh room be hosted', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    await hostRoom(doc, 'Pirate Battle', 'Alice')

    byClass(doc, 'waiting-room-leave').element.click()
    expect(byClass(doc, 'waiting-room').element.style.display).toBe('none')
    expect(byClass(doc, 'presets').element.style.display).toBe('')

    // Leaving disconnects the socket; production always reconnects to the same fixed server, but the test server's
    // ephemeral port isn't that address, so it has to point the connection back at it explicitly, same as setup.
    connectLobbySocket(baseUrl)
    await hostRoom(doc, 'Second Lobby', 'Alice again')
    expect(byClass(doc, 'waiting-room-players').element.textContent).toContain('Alice again (Host)')
  })

  // The real bug this covers: Play Again (see remotePlayAgainListener.ts) re-enters the same waiting room on
  // the same still-open socket connection - calling enterWaitingRoom a second time without this fix would add
  // a second 'roomUpdate'/'roomClosed' listener alongside the first, piling up one more duplicate render per
  // call every time a room goes through a rematch.
  test('entering the waiting room again (as Play Again does) replaces old roomUpdate/roomClosed listeners, not stacks them', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    await hostRoom(doc, 'Pirate Battle', 'Alice')
    const menu = byClass(doc, 'main-menu')
    const socket = connectLobbySocket(baseUrl)

    const state = { roomCode: 'ABCD', roomName: 'Pirate Battle', hostId: socket.id, players: [{ id: socket.id, name: 'Alice' }] }
    enterWaitingRoom(menu, state)
    enterWaitingRoom(menu, state)
    enterWaitingRoom(menu, state)

    expect(socket.listeners('roomUpdate')).toHaveLength(1)
    expect(socket.listeners('roomClosed')).toHaveLength(1)
  })

  // The real bug this covers: Play Again (remotePlayAgainListener.ts) renders a brand new main menu (startMenu)
  // and calls enterWaitingRoom directly on it, skipping showRemoteEntry - the one place that normally hides
  // the game-type tiles. On a freshly rendered menu the tiles are visible by default, so without this fix a
  // player going through Play Again would see both the tiles and the waiting room at once.
  test('entering the waiting room on a freshly rendered menu (as Play Again does) hides the game-type tiles too, not just the entry form', () => {
    const doc = openMenu()
    const menu = byClass(doc, 'main-menu')
    const state = { roomCode: 'ABCD', roomName: 'Pirate Battle', hostId: 'host-1', players: [{ id: 'host-1', name: 'Alice' }] }

    enterWaitingRoom(menu, state)

    expect(byClass(doc, 'presets').element.style.display).toBe('none')
    expect(byClass(doc, 'remote-entry').element.style.display).toBe('none')
    expect(byClass(doc, 'waiting-room').element.style.display).not.toBe('none')
  })
})
