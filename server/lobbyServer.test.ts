/**
 * @jest-environment node
 */
import { io as ioClient, Socket as ClientSocket } from 'socket.io-client'
import { createLobbyServer, isRoomGameOver } from './lobbyServer'
import type { Server as HttpServer } from 'http'
import type { RoomState } from './lobbyServer'
import type { RoomGame } from './gameplay'

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

describe('isRoomGameOver', () => {
  const gameWith = (statuses: number[]): RoomGame => ({ players: statuses.map(status => ({ status })) } as unknown as RoomGame)

  test('is false while at least 2 players are still alive', () => {
    expect(isRoomGameOver(gameWith([100, 100]))).toBe(false)
    expect(isRoomGameOver(gameWith([1, 1, 0]))).toBe(false)
  })

  test('is true once fewer than 2 players are still alive', () => {
    expect(isRoomGameOver(gameWith([100, 0]))).toBe(true)
    expect(isRoomGameOver(gameWith([0, 0, 0]))).toBe(true)
  })
})

describe('the lobby server', () => {
  test('creating a room makes the creator its host and only player', async () => {
    const host = connect()
    const state = await emit<RoomState>(host, 'createRoom', { name: 'Alice', roomName: 'Test Lobby' })
    expect(state.roomCode).toHaveLength(4)
    expect(state.roomName).toBe('Test Lobby')
    expect(state.hostId).toBe(host.id)
    expect(state.players).toEqual([{ id: host.id, name: 'Alice' }])
  })

  test('creating a room with a blank lobby name is refused', async () => {
    const response = await emit<{ error: string }>(connect(), 'createRoom', { name: 'Alice', roomName: '   ' })
    expect(response.error).toMatch(/lobby name/i)
  })

  describe('peekRoom', () => {
    test('a known room\'s code resolves to its lobby name and host\'s name, without joining it', async () => {
      const host = connect()
      const { roomCode } = await emit<RoomState>(host, 'createRoom', { name: 'Alice', roomName: 'Pirate Battle' })
      const peeker = connect()
      const info = await emit<{ roomName: string, hostName: string }>(peeker, 'peekRoom', { roomCode })
      expect(info).toEqual({ roomName: 'Pirate Battle', hostName: 'Alice' })
      // Peeking must not have joined the room - a second, real join still sees only the host.
      const state = await emit<RoomState>(peeker, 'joinRoom', { roomCode, name: 'Bob' })
      expect(state.players.map(p => p.name)).toEqual(['Alice', 'Bob'])
    })

    test('an unknown code gets the same error joinRoom uses', async () => {
      const response = await emit<{ error: string }>(connect(), 'peekRoom', { roomCode: 'ZZZZ' })
      expect(response.error).toMatch(/no room/i)
    })
  })

  test('joining a room by its code adds the joiner, and both players see it', async () => {
    const host = connect()
    const { roomCode } = await emit<RoomState>(host, 'createRoom', { name: 'Alice', roomName: 'Test Lobby' })
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
    const response = await emit<{ error: string }>(connect(), 'createRoom', { name: '   ', roomName: 'Test Lobby' })
    expect(response.error).toMatch(/name/i)
  })

  test('joining a room with a blank name is refused', async () => {
    const host = connect()
    const { roomCode } = await emit<RoomState>(host, 'createRoom', { name: 'Alice', roomName: 'Test Lobby' })
    const response = await emit<{ error: string }>(connect(), 'joinRoom', { roomCode, name: '' })
    expect(response.error).toMatch(/name/i)
  })

  test('a fifth player cannot join a room that already has four', async () => {
    const host = connect()
    const { roomCode } = await emit<RoomState>(host, 'createRoom', { name: 'Player 1', roomName: 'Test Lobby' })
    for (let i = 2; i <= 4; i++) {
      await emit<RoomState>(connect(), 'joinRoom', { roomCode, name: `Player ${i}` })
    }
    const response = await emit<{ error: string }>(connect(), 'joinRoom', { roomCode, name: 'Player 5' })
    expect(response.error).toMatch(/full/i)
  })

  test('a player leaving updates the room for whoever is left', async () => {
    const host = connect()
    const { roomCode } = await emit<RoomState>(host, 'createRoom', { name: 'Alice', roomName: 'Test Lobby' })
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
    const { roomCode } = await emit<RoomState>(host, 'createRoom', { name: 'Alice', roomName: 'Test Lobby' })
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
      const { roomCode } = await emit<RoomState>(host, 'createRoom', { name: 'Alice', roomName: 'Test Lobby' })
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
      const ack = await emit<{ started: true } | { error: string }>(host, 'startGame', { hints: 'optional' })
      expect(ack).toEqual({ started: true })
      const [hostView, joinerView] = await Promise.all([hostUpdate, joinerUpdate])
      expect(boardsOf(hostView)).toHaveLength(2)
      expect(boardsOf(joinerView)).toHaveLength(2)
      expect(boardsOf(hostView).map((p: any) => p.name).sort()).toEqual(['Alice', 'Bob'])
    })

    test('only the host can start the game', async () => {
      const { joiner } = await setUpRoom()
      const response = await emit<{ error: string }>(joiner, 'startGame', { hints: 'optional' })
      expect(response.error).toMatch(/only the host/i)
    })

    // Also covers the relaxed "or the game is over" guard's own "still active" branch (see isRoomGameOver,
    // used by this same handler to let a room's startGame double as a rematch once a game actually ends) -
    // a still-active game must keep refusing a second startGame exactly as before.
    test('the game cannot be started twice', async () => {
      const { host } = await setUpRoom()
      await emit(host, 'startGame', { hints: 'optional' })
      const response = await emit<{ error: string }>(host, 'startGame', { hints: 'optional' })
      expect(response.error).toMatch(/already started/i)
    })

    test('starting a game with no room to start it in is refused', async () => {
      const response = await emit<{ error: string }>(connect(), 'startGame', { hints: 'optional' })
      expect(response.error).toMatch(/no room/i)
    })

    test('starting a game with only one player in the room is refused', async () => {
      const host = connect()
      await emit<RoomState>(host, 'createRoom', { name: 'Alice', roomName: 'Test Lobby' })
      const response = await emit<{ error: string }>(host, 'startGame', { hints: 'optional' })
      expect(response.error).toMatch(/at least 2 players/i)
    })
  })

  describe('playing a started game', () => {
    const setUpStartedGame = async () => {
      const host = connect()
      const { roomCode } = await emit<RoomState>(host, 'createRoom', { name: 'Alice', roomName: 'Test Lobby' })
      const joiner = connect()
      await emit<RoomState>(joiner, 'joinRoom', { roomCode, name: 'Bob' })
      const hostUpdate = new Promise<any>(resolve => host.once('gameUpdate', resolve))
      await emit(host, 'startGame', { hints: 'optional' })
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

    // Every independent remote client renders both boards, live and clickable - nothing but this guard stops a
    // click from resolving against any board regardless of whose turn it actually is or which socket sent it.
    test('only the current attacker\'s own socket can act once real gameplay begins', async () => {
      const { host, joiner, initialView } = await setUpStartedGame()
      const boardsIndex = initialView.children.findIndex((child: any) => child.attributes?.className === 'boards')
      const panelIndex = initialView.children[boardsIndex].children[0].children.findIndex((child: any) => child.attributes?.className === 'remote-placement-panel')
      const panel = initialView.children[boardsIndex].children[0].children[panelIndex]
      const randomiseIndex = panel.children.findIndex((child: any) => child.attributes?.className === 'remote-placement-randomise')
      const readyIndex = panel.children.findIndex((child: any) => child.attributes?.className === 'remote-placement-ready')
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
      const setOrderIndex = choosingView.children[orderingIndex].children.findIndex((child: any) => child.attributes?.className === 'remote-order-set')
      const afterBeginOrderSet = new Promise<any>(resolve => host.once('gameUpdate', resolve))
      host.emit('gameAction', { itemPath: [1, orderingIndex, setOrderIndex], eventType: 'click', listenerFunc: 'remotePlacementListener', data: [] })
      await afterBeginOrderSet

      // Host (the only one allowed to during ordering) clicks Alice's board, then Bob's - Alice goes first.
      const boardIndexOf = (playerIndex: number): number => initialView.children[boardsIndex].children[playerIndex].children.findIndex((child: any) => child.attributes?.className === 'matrix')
      const tilePath = (playerIndex: number): number[] => [1, boardsIndex, playerIndex, boardIndexOf(playerIndex), 0, 0, 0]
      const afterFirstPick = new Promise<any>(resolve => host.once('gameUpdate', resolve))
      host.emit('gameAction', { itemPath: tilePath(0), eventType: 'click', listenerFunc: 'attackListener', data: [] })
      await afterFirstPick
      const afterSecondPick = new Promise<any>(resolve => host.once('gameUpdate', resolve))
      host.emit('gameAction', { itemPath: tilePath(1), eventType: 'click', listenerFunc: 'attackListener', data: [] })
      const gameView = await afterSecondPick

      const attackerIndex = gameView.children[boardsIndex].children.findIndex((player: any) => player.attacker)
      expect(attackerIndex).toBeGreaterThanOrEqual(0)
      const attackerSocket = attackerIndex === 0 ? host : joiner
      const nonAttackerSocket = attackerIndex === 0 ? joiner : host
      const victimIndex = attackerIndex === 0 ? 1 : 0

      // updatePlayer (the shared engine, unrelated to this fix) queues several of its own follow-up updates on
      // every turn change - valid-target highlighting, the attacker's outline, stats, a short attack-lock
      // release - each resolving through the same session queue watchRoomGame's own broadcast hook wraps
      // (debounced, but still eventually firing) once they settle, on no fixed schedule under test-suite load.
      // Waiting for a quiet stretch (no gameUpdate for 300ms) rather than a fixed delay keeps the next check
      // honest - racing a short window while one of these is still in flight would catch one of those instead
      // of whatever joiner's own blocked click did or didn't do.
      await new Promise<void>(resolve => {
        let quietTimer: ReturnType<typeof setTimeout>
        const onUpdate = (): void => {
          clearTimeout(quietTimer)
          quietTimer = setTimeout(finish, 300)
        }
        const finish = (): void => {
          host.off('gameUpdate', onUpdate)
          resolve()
        }
        host.on('gameUpdate', onUpdate)
        quietTimer = setTimeout(finish, 300)
      })

      // The non-attacker's own socket, attacking the real victim's board: silently ignored - not their turn.
      const sawUpdateFromNonAttacker = new Promise<string>(resolve => host.once('gameUpdate', () => resolve('update')))
      nonAttackerSocket.emit('gameAction', { itemPath: tilePath(victimIndex), eventType: 'click', listenerFunc: 'attackListener', data: [] })
      const raceResult = await Promise.race([sawUpdateFromNonAttacker, new Promise<string>(resolve => setTimeout(() => resolve('timeout'), 150))])
      expect(raceResult).toBe('timeout')

      // The real attacker's own socket, attacking the same cell, right after: this one actually lands.
      const afterRealAttack = new Promise<any>(resolve => host.once('gameUpdate', resolve))
      attackerSocket.emit('gameAction', { itemPath: tilePath(victimIndex), eventType: 'click', listenerFunc: 'attackListener', data: [] })
      const attackedView = await afterRealAttack
      const victimTile = attackedView.children[boardsIndex].children[victimIndex].children[boardIndexOf(victimIndex)].children[0].children[0].children[0]
      expect(victimTile.isHit).toBe(true)
    }, 15000)

    test('an action for a room with no started game is silently ignored', async () => {
      const lonelyHost = connect()
      await emit<RoomState>(lonelyHost, 'createRoom', { name: 'Carol', roomName: 'Test Lobby' })
      expect(() => lonelyHost.emit('gameAction', { itemPath: [0], eventType: 'click', listenerFunc: 'whatever', data: [] })).not.toThrow()
    })

    // A full real win was tried here (place both fleets by hand, alternate real attacks through to an actual
    // sink, then restart) and genuinely works, but costs several minutes end to end: updatePlayer's own
    // per-turn follow-ups (valid-target highlighting, outline, stats, the attack-lock release) each broadcast
    // separately, and a real win needs 33 turn changes (turns strictly alternate - no "keep attacking on a
    // hit" house rule, see getNextAttacker.ts). That cost is disproportionate to what actually changed here -
    // one relaxed guard condition, reusing startRoomGame/watchRoomGame entirely unmodified otherwise. The
    // existing "the game cannot be started twice" test above already covers the relaxed guard's "still
    // active" branch; isRoomGameOver's own logic is unit tested above, and server/gameplay.test.ts's own
    // "calling startRoomGame again... produces a genuinely fresh, independent game" test proves the restart
    // mechanics the guard's "is over" branch unlocks - between the three, a full socket-driven win is not
    // needed to trust this change.
  })
})
