/**
 * @jest-environment jsdom
 */
// Same real-vs-browser-stub ws issue as remoteListener.test.js's own comment explains - this file runs a real
// socket.io server in-process inside a jsdom test file, which needs ws's actual Node implementation.
jest.mock('ws', () => {
  const path = require('path')
  const wsIndexPath = path.join(path.dirname(require.resolve('ws/package.json')), 'index.js')
  return require(wsIndexPath)
})

import { Server } from 'socket.io'
import { createServer } from 'http'
import jsonDom from 'json-dom'
import { enterRemoteGame, leaveRemoteGame } from './remoteGame'
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
 * json-dom decides forward-vs-real once, at render/bind time (activateListener calls retrieveListener there),
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
    const root = jsonDom.documentDomItem({})

    enterRemoteGame(root, bodyWithClass('boards'))
    expect(root.forwardEvents).toBeDefined()

    io.emit('gameUpdate', bodyWithClass('final-scores'))
    await waitFor(() => !root.forwardEvents)

    // Play Again succeeded and a fresh game started - forwarding has to resume for it.
    io.emit('gameUpdate', bodyWithClass('boards'))
    await waitFor(() => Boolean(root.forwardEvents))
  })

  test('leaveRemoteGame always turns forwarding off and clears the rendered tree, regardless of game-over state', () => {
    const root = jsonDom.documentDomItem({})
    enterRemoteGame(root, bodyWithClass('boards'))
    expect(root.body.children).toHaveLength(1)

    leaveRemoteGame(root)
    expect(root.forwardEvents).toBeUndefined()
    expect(root.body.children).toHaveLength(0)
  })

  // The real bug this covers: root.forwardEvents only decides whether a button forwards or runs a real local
  // listener once, at the moment renderInto actually binds it (json-dom's activateListener calls
  // retrieveListener right then) - toggling the flag afterwards does nothing to anything already bound. A
  // final-scores push's own Play Again button was being rendered (and bound as a forwarder) before forwarding
  // was turned off, so clicking it silently forwarded to a no-op on the server instead of running locally.
  test('a final-scores push\'s own button really does run as a local listener, not a forwarded one', async () => {
    const socket = connectLobbySocket(baseUrl)
    await waitFor(() => socket.connected)
    const localListener = jest.fn()
    const root = jsonDom.documentDomItem({ localListener })

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
    const root = jsonDom.documentDomItem({ localListener })

    enterRemoteGame(root, bodyWithButton('boards', 'localListener'))
    document.querySelector('.the-button').click()

    await waitFor(() => gameActionReceived)
    expect(localListener).not.toHaveBeenCalled()
  })

  test('after a final-scores push, a later normal push\'s own button forwards again - not stuck on local', async () => {
    const socket = connectLobbySocket(baseUrl)
    await waitFor(() => socket.connected)
    const localListener = jest.fn()
    const root = jsonDom.documentDomItem({ localListener })

    enterRemoteGame(root, bodyWithClass('final-scores'))
    io.emit('gameUpdate', bodyWithButton('boards', 'localListener'))
    await waitFor(() => document.querySelector('.the-button') !== null)
    document.querySelector('.the-button').click()

    await waitFor(() => gameActionReceived)
    expect(localListener).not.toHaveBeenCalled()
  })
})
