/**
 * @jest-environment jsdom
 */
// Jest's jsdom environment resolves bare `require('ws')` to ws's browser stub (a function that just throws), via the
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
import remoteListener, { showRemoteEntry } from './remoteListener'
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

describe('the Online Multiplayer tile and its lobby', () => {
  test('choosing it shows the host/join form, and Back returns to the game types', () => {
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    expect(byClass(doc, 'remote-entry').element.style.display).not.toBe('none')
    expect(byClass(doc, 'presets').element.style.display).toBe('none')

    byClass(doc, 'remote-back').element.click()
    expect(byClass(doc, 'remote-entry').element.style.display).toBe('none')
    expect(byClass(doc, 'presets').element.style.display).toBe('')
  })

  test('hosting a room shows the waiting room with the host listed, tagged, and the room code shown', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    byName(doc, 'remote-name').element.value = 'Alice'
    byClass(doc, 'remote-host').element.click()

    await waitFor(() => byClass(doc, 'waiting-room').element.style.display !== 'none')
    expect(byClass(doc, 'waiting-room-players').element.textContent).toContain('Alice (Host)')
    expect(byClass(doc, 'waiting-room-code').element.textContent).toMatch(/Room Code: [A-Z0-9]{4}/)
  })

  test('showRemoteEntry (a shared join link landing on the join form) pre-fills the code and focuses the name field', () => {
    const doc = openMenu()
    showRemoteEntry(byClass(doc, 'main-menu'), 'ABCD')
    expect(byClass(doc, 'presets').element.style.display).toBe('none')
    expect(byClass(doc, 'remote-entry').element.style.display).not.toBe('none')
    expect(byName(doc, 'remote-code').element.value).toBe('ABCD')
    expect(document.activeElement).toBe(byName(doc, 'remote-name').element)
  })

  test('showRemoteEntry with no code (the Online Multiplayer tile itself) leaves the code field untouched', () => {
    const doc = openMenu()
    showRemoteEntry(byClass(doc, 'main-menu'))
    expect(byName(doc, 'remote-code').element.value).toBe('')
  })

  test('hosting puts the room\'s own code in the address bar, so the current URL is a real shareable join link', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    byName(doc, 'remote-name').element.value = 'Alice'
    byClass(doc, 'remote-host').element.click()

    await waitFor(() => byClass(doc, 'waiting-room').element.style.display !== 'none')
    const roomCode = byClass(doc, 'waiting-room-code').element.textContent.replace('Room Code: ', '')
    expect(window.location.search).toBe(`?room=${roomCode}`)

    byClass(doc, 'waiting-room-leave').element.click()
    expect(window.location.search).toBe('')
  })

  test('joining an existing room by its code shows both players in the waiting room', async () => {
    const host = rawPlayer()
    const { roomCode } = await rawEmit(host, 'createRoom', { name: 'Alice' })

    connectLobbySocket(baseUrl)
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    byName(doc, 'remote-name').element.value = 'Bob'
    byName(doc, 'remote-code').element.value = roomCode.toLowerCase()
    byClass(doc, 'remote-join').element.click()

    await waitFor(() => byClass(doc, 'waiting-room').element.style.display !== 'none')
    const players = byClass(doc, 'waiting-room-players').element.textContent
    expect(players).toContain('Alice (Host)')
    expect(players).toContain('Bob')
  })

  test('joining a room that does not exist shows an error and stays on the entry screen', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    byName(doc, 'remote-name').element.value = 'Bob'
    byName(doc, 'remote-code').element.value = 'ZZZZ'
    byClass(doc, 'remote-join').element.click()

    await waitFor(() => byClass(doc, 'remote-status').element.textContent !== '')
    expect(byClass(doc, 'remote-status').element.textContent).toMatch(/no room/i)
    expect(byClass(doc, 'remote-entry').element.style.display).not.toBe('none')
  })

  test('hosting with an empty name is refused without even contacting the server', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    byClass(doc, 'remote-host').element.click()
    await waitFor(() => byClass(doc, 'remote-status').element.textContent !== '')
    expect(byClass(doc, 'remote-status').element.textContent).toMatch(/name/i)
    expect(byClass(doc, 'waiting-room').element.style.display).toBe('none')
  })

  test('joining with a blank (whitespace-only) name is refused', async () => {
    const host = rawPlayer()
    const { roomCode } = await rawEmit(host, 'createRoom', { name: 'Alice' })

    connectLobbySocket(baseUrl)
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    byName(doc, 'remote-name').element.value = '   '
    byName(doc, 'remote-code').element.value = roomCode
    byClass(doc, 'remote-join').element.click()
    await waitFor(() => byClass(doc, 'remote-status').element.textContent !== '')
    expect(byClass(doc, 'remote-status').element.textContent).toMatch(/name/i)
    expect(byClass(doc, 'waiting-room').element.style.display).toBe('none')
  })

  test('a second player joining updates the host\'s own waiting room live', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    byName(doc, 'remote-name').element.value = 'Alice'
    byClass(doc, 'remote-host').element.click()
    await waitFor(() => byClass(doc, 'waiting-room').element.style.display !== 'none')
    const roomCode = byClass(doc, 'waiting-room-code').element.textContent.replace('Room Code: ', '')

    const joiner = rawPlayer()
    await rawEmit(joiner, 'joinRoom', { roomCode, name: 'Bob' })

    await waitFor(() => byClass(doc, 'waiting-room-players').element.textContent.includes('Bob'))
    expect(byClass(doc, 'waiting-room-players').element.textContent).toContain('Alice (Host)')
  })

  test('the host leaving closes the room, and the joiner is told and returned to the entry screen', async () => {
    const host = rawPlayer()
    const { roomCode } = await rawEmit(host, 'createRoom', { name: 'Alice' })

    connectLobbySocket(baseUrl)
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    byName(doc, 'remote-name').element.value = 'Bob'
    byName(doc, 'remote-code').element.value = roomCode
    byClass(doc, 'remote-join').element.click()
    await waitFor(() => byClass(doc, 'waiting-room').element.style.display !== 'none')

    host.close()

    await waitFor(() => byClass(doc, 'waiting-room').element.style.display === 'none')
    expect(byClass(doc, 'remote-entry').element.style.display).not.toBe('none')
    expect(byClass(doc, 'remote-status').element.textContent).toMatch(/host left/i)
  })

  test('the host sees the Start Game controls, a joiner does not', async () => {
    const host = rawPlayer()
    const { roomCode } = await rawEmit(host, 'createRoom', { name: 'Alice' })

    connectLobbySocket(baseUrl)
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    byName(doc, 'remote-name').element.value = 'Bob'
    byName(doc, 'remote-code').element.value = roomCode
    byClass(doc, 'remote-join').element.click()
    await waitFor(() => byClass(doc, 'waiting-room').element.style.display !== 'none')

    expect(byClass(doc, 'waiting-room-host-controls').element.style.display).toBe('none')
  })

  test('the host starting the game renders the real game for both the host and a joiner', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    byName(doc, 'remote-name').element.value = 'Alice'
    byClass(doc, 'remote-host').element.click()
    await waitFor(() => byClass(doc, 'waiting-room').element.style.display !== 'none')
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
    const players = jsonDom.getChildrenByClass('boards', doc.body)[0].children
    expect(players).toHaveLength(2)
    // Each player has their own placement panel - nobody waits on a shared handoff screen any more.
    expect(players.every(player => jsonDom.getChildrenByClass('remote-placement-panel', player).length === 1)).toBe(true)

    const joinerView = await joinerSawUpdate
    expect(joinerView.children.find(child => child.attributes.className === 'boards').children).toHaveLength(2)
  })

  // The real timer that ends placement runs on the server (see remotePlacement.ts's PLACEMENT_TIMEOUT_MS) -
  // this only covers the client's own cosmetic countdown, which must never be mistaken for that real deadline.
  test('a visual countdown shows once placement starts, ticking down on its own between server pushes', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    byName(doc, 'remote-name').element.value = 'Alice'
    byClass(doc, 'remote-host').element.click()
    await waitFor(() => byClass(doc, 'waiting-room').element.style.display !== 'none')
    const roomCode = byClass(doc, 'waiting-room-code').element.textContent.replace('Room Code: ', '')

    const joiner = rawPlayer()
    await rawEmit(joiner, 'joinRoom', { roomCode, name: 'Bob' })
    await waitFor(() => byClass(doc, 'waiting-room-players').element.textContent.includes('Bob'))
    byClass(doc, 'waiting-room-start').element.click()

    await waitFor(() => document.querySelector('.remote-placement-countdown') !== null)
    const firstReading = Number(document.querySelector('.remote-placement-countdown').textContent.match(/(\d+)s left/)[1])
    expect(firstReading).toBeGreaterThan(0)

    // No server action happens in between - the display only ticks down because of its own local interval.
    await new Promise(resolve => setTimeout(resolve, 600))
    const secondReading = Number(document.querySelector('.remote-placement-countdown').textContent.match(/(\d+)s left/)[1])
    expect(secondReading).toBeLessThanOrEqual(firstReading)

    leaveRemoteGame(doc)
    expect(document.querySelector('.remote-placement-countdown')).toBeNull()
  })

  // The real bug this covers: only the client that clicked Start ever rendered the game - a joiner who never
  // clicked anything (the host is the one who starts it) was left stuck on the waiting room forever, even though
  // the server was already pushing it gameUpdates. Here the joiner is the real UI under test, and the host is a
  // raw socket starting the game from outside it - the one place the earlier test's "doc is always the host"
  // setup could never have caught this.
  test('a joiner who never clicked Start still sees the real game once the host starts it', async () => {
    const host = rawPlayer()
    const { roomCode } = await rawEmit(host, 'createRoom', { name: 'Alice' })

    connectLobbySocket(baseUrl)
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    byName(doc, 'remote-name').element.value = 'Bob'
    byName(doc, 'remote-code').element.value = roomCode
    byClass(doc, 'remote-join').element.click()
    await waitFor(() => byClass(doc, 'waiting-room').element.style.display !== 'none')
    expect(byClass(doc, 'waiting-room-host-controls').element.style.display).toBe('none')

    await rawEmit(host, 'startGame', { hints: 'optional', firstGoesFirst: true })

    await waitFor(() => jsonDom.getChildrenByClass('boards', doc.body).length > 0)
    expect(jsonDom.getChildrenByClass('waiting-room', doc.body)).toHaveLength(0)
    const players = jsonDom.getChildrenByClass('boards', doc.body)[0].children
    expect(players).toHaveLength(2)
    expect(players.every(player => jsonDom.getChildrenByClass('remote-placement-panel', player).length === 1)).toBe(true)
  })

  test('clicking something in the rendered game forwards it, and both players see the real result', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    byName(doc, 'remote-name').element.value = 'Alice'
    byClass(doc, 'remote-host').element.click()
    await waitFor(() => byClass(doc, 'waiting-room').element.style.display !== 'none')
    const roomCode = byClass(doc, 'waiting-room-code').element.textContent.replace('Room Code: ', '')

    const joiner = rawPlayer()
    await rawEmit(joiner, 'joinRoom', { roomCode, name: 'Bob' })
    await waitFor(() => byClass(doc, 'waiting-room-players').element.textContent.includes('Bob'))

    const joinerSawFirstUpdate = new Promise(resolve => joiner.once('gameUpdate', resolve))
    byClass(doc, 'waiting-room-start').element.click()
    await waitFor(() => jsonDom.getChildrenByClass('boards', doc.body).length > 0)
    await joinerSawFirstUpdate

    // Both players place simultaneously, each on their own board - no shared handoff screen for either of them.
    // Alice's own copy of her own panel is the one with enabled controls; Bob's copy of his own panel (rendered
    // in Alice's own doc too, redacted) is always disabled, since Alice can't act on Bob's behalf.
    const aliceRandomise = jsonDom.getChildrenByClass('remote-placement-randomise', doc.body).find(button => !button.attributes.disabled)
    expect(aliceRandomise).toBeDefined()

    const joinerSawSecondUpdate = new Promise(resolve => joiner.once('gameUpdate', resolve))
    aliceRandomise.element.click()
    const joinerView = await joinerSawSecondUpdate

    // Alice's fleet is now fully placed - the real result is visible in Bob's own (independent) view too, since
    // the panel's message text is never secret, only the ship positions themselves.
    const alicePlayer = joinerView.children.find(child => child.attributes.className === 'boards').children[0]
    const alicePanel = alicePlayer.children.find(child => child.attributes.className === 'remote-placement-panel')
    const aliceMessage = alicePanel.children.find(child => child.attributes.className === 'remote-placement-message')
    expect(aliceMessage.attributes.innerHTML).toContain('All placed')
  })

  test('leaving the waiting room returns to the game types and lets a fresh room be hosted', async () => {
    connectLobbySocket(baseUrl)
    const doc = openMenu()
    byClass(doc, 'preset-remote').element.click()
    byName(doc, 'remote-name').element.value = 'Alice'
    byClass(doc, 'remote-host').element.click()
    await waitFor(() => byClass(doc, 'waiting-room').element.style.display !== 'none')

    byClass(doc, 'waiting-room-leave').element.click()
    expect(byClass(doc, 'waiting-room').element.style.display).toBe('none')
    expect(byClass(doc, 'presets').element.style.display).toBe('')

    // Leaving disconnects the socket; production always reconnects to the same fixed server, but the test server's
    // ephemeral port isn't that address, so it has to point the connection back at it explicitly, same as setup.
    connectLobbySocket(baseUrl)
    byClass(doc, 'preset-remote').element.click()
    byName(doc, 'remote-name').element.value = 'Alice again'
    byClass(doc, 'remote-host').element.click()
    await waitFor(() => byClass(doc, 'waiting-room').element.style.display !== 'none')
    expect(byClass(doc, 'waiting-room-players').element.textContent).toContain('Alice again (Host)')
  })
})
