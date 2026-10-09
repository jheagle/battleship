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

beforeEach(async () => {
  httpServer = createServer()
  io = new Server(httpServer, { cors: { origin: '*' } })
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
})
