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
import remoteListener from './remoteListener'
import beginRound from './beginRound'
import { createLobbyServer } from '../../server/lobbyServer'
import { connectLobbySocket, disconnectLobbySocket } from '../network/lobbySocket'

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
