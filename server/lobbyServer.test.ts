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

  test('creating a room with a blank name is refused', async () => {
    const response = await emit<{ error: string }>(connect(), 'createRoom', { name: '   ' })
    expect(response.error).toMatch(/name/i)
  })

  test('joining a room with a blank name is refused', async () => {
    const host = connect()
    const { roomCode } = await emit<RoomState>(host, 'createRoom', { name: 'Alice' })
    const response = await emit<{ error: string }>(connect(), 'joinRoom', { roomCode, name: '' })
    expect(response.error).toMatch(/name/i)
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

    const boardsOf = (redactedBody: any): any[] =>
      redactedBody.children.find((child: any) => child.attributes?.className === 'boards').children

    test('the host starting a game sends every connected player their own redacted view', async () => {
      const { host, joiner } = await setUpRoom()
      const hostUpdate = new Promise<any>(resolve => host.once('gameUpdate', resolve))
      const joinerUpdate = new Promise<any>(resolve => joiner.once('gameUpdate', resolve))
      const ack = await emit<{ started: true } | { error: string }>(host, 'startGame', { hints: 'optional', firstGoesFirst: true })
      expect(ack).toEqual({ started: true })
      const [hostView, joinerView] = await Promise.all([hostUpdate, joinerUpdate])
      expect(boardsOf(hostView)).toHaveLength(2)
      expect(boardsOf(joinerView)).toHaveLength(2)
      expect(boardsOf(hostView).map((p: any) => p.name).sort()).toEqual(['Alice', 'Bob'])
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

    test('starting a game with only one player in the room is refused', async () => {
      const host = connect()
      await emit<RoomState>(host, 'createRoom', { name: 'Alice' })
      const response = await emit<{ error: string }>(host, 'startGame', { hints: 'optional', firstGoesFirst: true })
      expect(response.error).toMatch(/at least 2 players/i)
    })
  })

  describe('playing a started game', () => {
    const setUpStartedGame = async () => {
      const host = connect()
      const { roomCode } = await emit<RoomState>(host, 'createRoom', { name: 'Alice' })
      const joiner = connect()
      await emit<RoomState>(joiner, 'joinRoom', { roomCode, name: 'Bob' })
      const hostUpdate = new Promise<any>(resolve => host.once('gameUpdate', resolve))
      await emit(host, 'startGame', { hints: 'optional', firstGoesFirst: true })
      const initialView = await hostUpdate
      return { host, joiner, initialView }
    }

    test('a forwarded action actually runs on the server and both players see the result', async () => {
      const { host, initialView } = await setUpStartedGame()
      // Both humans place simultaneously, each on their own board - there is no shared handoff panel any more.
      // Alice is players[0] (the host), with her own placement panel as one of her own subtree's children.
      const boardsIndex = initialView.children.findIndex((child: any) => child.attributes?.className === 'boards')
      const alice = initialView.children[boardsIndex].children[0]
      const panelIndex = alice.children.findIndex((child: any) => child.attributes?.className === 'remote-placement-panel')
      const panel = alice.children[panelIndex]
      const buttonIndex = (className: string): number => panel.children.findIndex((child: any) => child.attributes?.className === className)
      const randomiseIndex = buttonIndex('remote-placement-randomise')
      expect(panel.children[buttonIndex('remote-placement-ready')].attributes.disabled).toBe(true)

      const nextUpdate = new Promise<any>(resolve => host.once('gameUpdate', resolve))
      // The path is relative to the server's real root (#document), not the pushed body directly: root.children[1]
      // is the body itself, so the body's own children (boards, remote-ordering) sit one level deeper than they
      // do when just looking at the pushed payload (which IS the body already).
      host.emit('gameAction', { itemPath: [1, boardsIndex, 0, panelIndex, randomiseIndex], eventType: 'click', listenerFunc: 'remotePlacementListener', data: [] })
      const updatedView = await nextUpdate

      // Randomise fully placed Alice's fleet - nothing left pending, so Ready is no longer disabled.
      const updatedAlice = updatedView.children[boardsIndex].children[0]
      const updatedPanel = updatedAlice.children[panelIndex]
      expect(updatedPanel.children[buttonIndex('remote-placement-ready')].attributes.disabled).toBeFalsy()
    })

    // A longer budget than the suite's default: several real round trips in sequence (two ready-ups, a 150ms
    // negative-result race, then a final confirming click), which can run past 5000ms under load.
    test('only the host can choose the turn order, once everyone has placed', async () => {
      const { host, joiner, initialView } = await setUpStartedGame()
      const boardsIndex = initialView.children.findIndex((child: any) => child.attributes?.className === 'boards')
      const panelIndex = initialView.children[boardsIndex].children[0].children.findIndex((child: any) => child.attributes?.className === 'remote-placement-panel')
      const panel = initialView.children[boardsIndex].children[0].children[panelIndex]
      const randomiseIndex = panel.children.findIndex((child: any) => child.attributes?.className === 'remote-placement-randomise')
      const readyIndex = panel.children.findIndex((child: any) => child.attributes?.className === 'remote-placement-ready')
      // Every change broadcasts to every player, so host always sees a fresh gameUpdate after either player's
      // action - awaiting that each step keeps the two players' actions from racing each other over the wire.
      const readyUp = async (socket: ClientSocket, playerIndex: number): Promise<any> => {
        const path = (buttonIndex: number): number[] => [1, boardsIndex, playerIndex, panelIndex, buttonIndex]
        const afterRandomise = new Promise<any>(resolve => host.once('gameUpdate', resolve))
        socket.emit('gameAction', { itemPath: path(randomiseIndex), eventType: 'click', listenerFunc: 'remotePlacementListener', data: [] })
        await afterRandomise
        const afterReady = new Promise<any>(resolve => host.once('gameUpdate', resolve))
        socket.emit('gameAction', { itemPath: path(readyIndex), eventType: 'click', listenerFunc: 'remotePlacementListener', data: [] })
        return afterReady
      }

      await readyUp(host, 0)
      const choosingView = await readyUp(joiner, 1)

      const orderingIndex = choosingView.children.findIndex((child: any) => child.attributes?.className === 'remote-ordering')
      const orderingPanel = choosingView.children[orderingIndex]
      // Set order (not Random) on purpose - it transitions synchronously with no queued animation steps of its
      // own, so nothing is left running past this test's end to interfere with whichever test runs next.
      const setOrderIndex = orderingPanel.children.findIndex((child: any) => child.attributes?.className === 'remote-order-set')
      expect(orderingPanel.children.find((child: any) => child.attributes?.className === 'remote-ordering-message').attributes.innerHTML).toMatch(/choose how/i)

      // A non-host's attempt is silently ignored - nothing gets pushed as a result of it at all.
      const sawUpdateFromJoiner = new Promise<string>(resolve => host.once('gameUpdate', () => resolve('update')))
      joiner.emit('gameAction', { itemPath: [1, orderingIndex, setOrderIndex], eventType: 'click', listenerFunc: 'remotePlacementListener', data: [] })
      const raceResult = await Promise.race([sawUpdateFromJoiner, new Promise<string>(resolve => setTimeout(() => resolve('timeout'), 150))])
      expect(raceResult).toBe('timeout')

      // The host's own click, right after, really does work - proving the harness itself is sound, not just quiet.
      const hostChose = new Promise<any>(resolve => host.once('gameUpdate', resolve))
      host.emit('gameAction', { itemPath: [1, orderingIndex, setOrderIndex], eventType: 'click', listenerFunc: 'remotePlacementListener', data: [] })
      const orderingView = await hostChose
      const orderingMessage = orderingView.children[orderingIndex].children.find((child: any) => child.attributes?.className === 'remote-ordering-message')
      expect(orderingMessage.attributes.innerHTML).toMatch(/click each player/i)
    }, 15000)

    test('an action for a room with no started game is silently ignored', async () => {
      const lonelyHost = connect()
      await emit<RoomState>(lonelyHost, 'createRoom', { name: 'Carol' })
      expect(() => lonelyHost.emit('gameAction', { itemPath: [0], eventType: 'click', listenerFunc: 'whatever', data: [] })).not.toThrow()
    })
  })
})
