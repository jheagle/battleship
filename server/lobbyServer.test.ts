/**
 * @jest-environment node
 */
import { io as ioClient, Socket as ClientSocket } from 'socket.io-client'
import { createLobbyServer } from './lobbyServer'
import type { Server as HttpServer } from 'http'
import type { RoomState } from './lobbyServer'

let server: HttpServer
let baseUrl: string
const sockets: ClientSocket[] = []

beforeEach(async () => {
  server = createLobbyServer()
  await new Promise<void>(resolve => server.listen(0, resolve))
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : 0
  baseUrl = `http://localhost:${port}`
})

afterEach(async () => {
  sockets.forEach(socket => socket.close())
  sockets.length = 0
  await new Promise(resolve => server.close(resolve))
})

/** A connected client socket, closed automatically after the test. */
const connect = (): ClientSocket => {
  const socket = ioClient(baseUrl, { transports: ['websocket'], forceNew: true })
  sockets.push(socket)
  return socket
}

/** Emit with an acknowledgement, as a promise. */
const emit = <T>(socket: ClientSocket, event: string, payload: object): Promise<T> =>
  new Promise(resolve => socket.emit(event, payload, (response: T) => resolve(response)))

describe('the lobby server', () => {
  test('creating a room makes the creator its host and only player', async () => {
    const host = connect()
    const state = await emit<RoomState>(host, 'createRoom', { name: 'Alice' })
    expect(state.roomCode).toHaveLength(4)
    expect(state.hostId).toBe(host.id)
    expect(state.players).toEqual([{ id: host.id, name: 'Alice' }])
  })

  test('joining a room by its code adds the joiner, and both players see it', async () => {
    const host = connect()
    const { roomCode } = await emit<RoomState>(host, 'createRoom', { name: 'Alice' })
    const joiner = connect()
    const joinedAck = emit<RoomState>(joiner, 'joinRoom', { roomCode, name: 'Bob' })
    const hostNotified = new Promise<RoomState>(resolve => host.on('roomUpdate', resolve))
    const [joinedState, hostSawUpdate] = await Promise.all([joinedAck, hostNotified])
    expect(joinedState.players.map(p => p.name).sort()).toEqual(['Alice', 'Bob'])
    expect(hostSawUpdate.players.map(p => p.name).sort()).toEqual(['Alice', 'Bob'])
  })

  test('joining a room that does not exist is refused', async () => {
    const joiner = connect()
    const response = await emit<{ error: string }>(joiner, 'joinRoom', { roomCode: 'ZZZZ', name: 'Bob' })
    expect(response.error).toMatch(/no room/i)
  })

  test('a fifth player cannot join a room that already has four', async () => {
    const host = connect()
    const { roomCode } = await emit<RoomState>(host, 'createRoom', { name: 'Player 1' })
    for (let i = 2; i <= 4; i++) {
      await emit<RoomState>(connect(), 'joinRoom', { roomCode, name: `Player ${i}` })
    }
    const response = await emit<{ error: string }>(connect(), 'joinRoom', { roomCode, name: 'Player 5' })
    expect(response.error).toMatch(/full/i)
  })

  test('a player leaving updates the room for whoever is left', async () => {
    const host = connect()
    const { roomCode } = await emit<RoomState>(host, 'createRoom', { name: 'Alice' })
    const joiner = connect()
    const hostSawJoin = new Promise<RoomState>(resolve => host.once('roomUpdate', resolve))
    await emit<RoomState>(joiner, 'joinRoom', { roomCode, name: 'Bob' })
    await hostSawJoin
    const hostSawLeave = new Promise<RoomState>(resolve => host.once('roomUpdate', resolve))
    joiner.close()
    const state = await hostSawLeave
    expect(state.players.map(p => p.name)).toEqual(['Alice'])
  })

  test('the host leaving closes the room for everyone', async () => {
    const host = connect()
    const { roomCode } = await emit<RoomState>(host, 'createRoom', { name: 'Alice' })
    const joiner = connect()
    await emit<RoomState>(joiner, 'joinRoom', { roomCode, name: 'Bob' })
    const joinerSawClose = new Promise(resolve => joiner.on('roomClosed', resolve))
    host.close()
    await joinerSawClose
    const response = await emit<{ error: string }>(connect(), 'joinRoom', { roomCode, name: 'Carol' })
    expect(response.error).toMatch(/no room/i)
  })

  describe('starting a game', () => {
    const setUpRoom = async () => {
      const host = connect()
      const { roomCode } = await emit<RoomState>(host, 'createRoom', { name: 'Alice' })
      const joiner = connect()
      await emit<RoomState>(joiner, 'joinRoom', { roomCode, name: 'Bob' })
      return { host, joiner, roomCode }
    }

    test('the host starting a game sends every connected player their own redacted view', async () => {
      const { host, joiner } = await setUpRoom()
      const hostUpdate = new Promise(resolve => host.once('gameUpdate', resolve))
      const joinerUpdate = new Promise(resolve => joiner.once('gameUpdate', resolve))
      const ack = await emit<{ started: true } | { error: string }>(host, 'startGame', { hints: 'optional', firstGoesFirst: true })
      expect(ack).toEqual({ started: true })
      const [hostView, joinerView] = await Promise.all([hostUpdate, joinerUpdate])
      expect(Array.isArray(hostView)).toBe(true)
      expect(Array.isArray(joinerView)).toBe(true)
    })

    test('only the host can start the game', async () => {
      const { joiner } = await setUpRoom()
      const response = await emit<{ error: string }>(joiner, 'startGame', { hints: 'optional', firstGoesFirst: true })
      expect(response.error).toMatch(/only the host/i)
    })

    test('the game cannot be started twice', async () => {
      const { host } = await setUpRoom()
      await emit(host, 'startGame', { hints: 'optional', firstGoesFirst: true })
      const response = await emit<{ error: string }>(host, 'startGame', { hints: 'optional', firstGoesFirst: true })
      expect(response.error).toMatch(/already started/i)
    })

    test('starting a game with no room to start it in is refused', async () => {
      const response = await emit<{ error: string }>(connect(), 'startGame', { hints: 'optional', firstGoesFirst: true })
      expect(response.error).toMatch(/no room/i)
    })
  })
})
