import './installPseudoDom'
import { createServer } from 'http'
import jsonDom from 'json-dom'
import { Server, Socket } from 'socket.io'
import { startRoomGame, watchRoomGame } from './gameplay'
import { isHostOnlyStage, isRemoteSessionActive } from '../src/setup/remotePlacement'
import type { Server as HttpServer } from 'http'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { ForwardedEvent } from 'json-dom/dist/events/types'
import type { HintSetting } from '../src/setup/gameOptions'
import type { RoomGame } from './gameplay'

/** The fewest players a game can start with - nobody to attack otherwise. */
const MIN_PLAYERS_TO_START = 2

/** Whether a room's game has actually ended - the same condition updateScore.ts already uses to decide that
 * itself, re-checked here so a finished room's own startGame event can double as "play again" (see the
 * startGame handler below) without needing a separate, dedicated rematch event. */
export const isRoomGameOver = (game: RoomGame): boolean => game.players.filter(player => player.status > 0).length < 2

/**
 * A redacted body, as sent over the wire: still circularly linked in memory (parentItem, matrix-dom's own
 * internal references) like any live DomItem, which socket.io's own payload encoding cannot walk directly - this
 * strips exactly what domItemToJson already strips for any other json-dom consumer (element/parentItem/...), then
 * parses it straight back to a plain object, since socket.io does its own JSON encoding over the wire.
 * @param body
 */
const forTransport = (body: DomItem): object => JSON.parse(jsonDom.domItemToJson(body))

/** Up to four players in a room, the same limit as a local multiplayer game. */
const MAX_PLAYERS = 4

/** Room codes avoid 0/O and 1/I, which are easy to misread when read aloud or typed from a screen. */
const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** One player in a room, as sent to clients. */
export interface RoomPlayer {
  id: string
  name: string
}

/** A room's state, as sent to clients: its code, who is hosting, and who has joined. */
export interface RoomState {
  roomCode: string
  hostId: string
  players: RoomPlayer[]
}

interface Room {
  hostId: string
  players: Map<string, string>
  game?: RoomGame
  broadcastGame?: () => void
}

/**
 * A room code not already in use. Collisions are vanishingly unlikely (36^4 codes, a handful of rooms at a time),
 * but checked for anyway rather than assumed away.
 * @param rooms
 */
const generateRoomCode = (rooms: Map<string, Room>): string => {
  let code: string
  do {
    code = Array.from({ length: 4 }, () => ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)]).join('')
  } while (rooms.has(code))
  return code
}

/**
 * The state of a room, in the shape sent to clients.
 * @param rooms
 * @param roomCode
 */
const roomState = (rooms: Map<string, Room>, roomCode: string): RoomState => {
  const room = rooms.get(roomCode) as Room
  return { roomCode, hostId: room.hostId, players: [...room.players].map(([id, name]) => ({ id, name })) }
}

/**
 * The remote lobby: players create or join a room by a short code, and see who else is in it as they join or
 * leave. This is hosting, joining and presence only - nothing about actual gameplay is wired up here.
 *
 * If the host disconnects, the room closes for everyone rather than picking a new host - simplest for a first
 * version; worth revisiting if a host leaving mid-session turns out to be disruptive in practice.
 */
export const createLobbyServer = (): HttpServer => {
  const httpServer = createServer()
  const io = new Server(httpServer, { cors: { origin: '*' } })
  const rooms = new Map<string, Room>()

  io.on('connection', (socket: Socket) => {
    let currentRoom: string | null = null

    socket.on('createRoom', ({ name }: { name: string }, ack: (state: RoomState | { error: string }) => void) => {
      if (!name?.trim()) {
        ack({ error: 'A name is required' })
        return
      }
      const roomCode = generateRoomCode(rooms)
      rooms.set(roomCode, { hostId: socket.id, players: new Map([[socket.id, name.trim()]]) })
      currentRoom = roomCode
      socket.join(roomCode)
      ack(roomState(rooms, roomCode))
    })

    socket.on('joinRoom', ({ roomCode, name }: { roomCode: string, name: string }, ack: (state: RoomState | { error: string }) => void) => {
      if (!name?.trim()) {
        ack({ error: 'A name is required' })
        return
      }
      const room = rooms.get(roomCode)
      if (!room) {
        ack({ error: 'No room with that code' })
        return
      }
      if (room.players.size >= MAX_PLAYERS) {
        ack({ error: 'That room is full' })
        return
      }
      room.players.set(socket.id, name.trim())
      currentRoom = roomCode
      socket.join(roomCode)
      const state = roomState(rooms, roomCode)
      ack(state)
      socket.to(roomCode).emit('roomUpdate', state)
    })

    socket.on('startGame', ({ hints, firstGoesFirst }: { hints: HintSetting, firstGoesFirst: boolean }, ack: (result: { started: true } | { error: string }) => void) => {
      const room = currentRoom ? rooms.get(currentRoom) : undefined
      if (!room) {
        ack({ error: 'No room to start a game in' })
        return
      }
      if (socket.id !== room.hostId) {
        ack({ error: 'Only the host can start the game' })
        return
      }
      if (room.game && !isRoomGameOver(room.game)) {
        ack({ error: 'The game has already started' })
        return
      }
      if (room.players.size < MIN_PLAYERS_TO_START) {
        ack({ error: `Need at least ${MIN_PLAYERS_TO_START} players to start` })
        return
      }
      // room.broadcastGame does not exist yet at this exact line - startRoomGame's own placement timer will not
      // fire for a good two minutes, long after the very next line assigns it, so the closure below still reads
      // the real function by the time it's ever actually called.
      room.game = startRoomGame([...room.players.entries()], hints, firstGoesFirst, () => room.broadcastGame?.())
      room.broadcastGame = watchRoomGame(room.game, (socketId, redactedBody) => io.to(socketId).emit('gameUpdate', forTransport(redactedBody)))
      ack({ started: true })
    })

    socket.on('gameAction', (envelope: ForwardedEvent) => {
      const room = currentRoom ? rooms.get(currentRoom) : undefined
      if (!room?.game) {
        return
      }
      // Choosing the turn order (Random, or Set order's own board clicks) is host-only - enforced here, not just
      // by those controls being disabled on a non-host's own redacted copy, since receiveForwardedEvent dispatches
      // a bare DOM event with no socket identity attached once it reaches whatever listener actually runs. Ship
      // placement itself needs no such check: a client can only ever act on its own board either way.
      if (isHostOnlyStage(room.game.root) && socket.id !== room.hostId) {
        return
      }
      // Once real gameplay begins (placement/ordering both over), only the current attacker's own socket may
      // act at all - every independent remote client renders every board, live and clickable, with nothing
      // else stopping a click from resolving against any board regardless of whose turn it actually is or
      // which socket sent it. attackFleet.ts's own player.attacker check already refuses the attacker hitting
      // their *own* board, but has no notion of sockets at all - it only ever sees whichever board a click
      // happened to target, never who sent the click. This is the socket-identity half that check cannot do on
      // its own.
      if (!isRemoteSessionActive(room.game.root)) {
        const attacker = room.game.players.find(player => player.attacker)
        if (room.game.playerBySocket.get(socket.id) !== attacker) {
          return
        }
      }
      // Plenty of real actions run entirely synchronously (continueTurn, placeCell, finishTurn...), queuing
      // nothing at all - watchRoomGame's own queue hook alone would never see them, so broadcast again
      // unconditionally here too; a queued action's own later pushes (robot turns, animations) still happen
      // on top of this via that hook, unaffected.
      jsonDom.receiveForwardedEvent(room.game.root, envelope)
      room.broadcastGame?.()
    })

    socket.on('disconnect', () => {
      if (!currentRoom || !rooms.has(currentRoom)) {
        return
      }
      const room = rooms.get(currentRoom) as Room
      if (socket.id === room.hostId) {
        io.to(currentRoom).emit('roomClosed')
        rooms.delete(currentRoom)
        return
      }
      room.players.delete(socket.id)
      io.to(currentRoom).emit('roomUpdate', roomState(rooms, currentRoom))
    })
  })

  return httpServer
}

if (process.argv[1] && process.argv[1].endsWith('lobbyServer.js')) {
  const port = process.env.PORT || 3002
  createLobbyServer().listen(port, () => console.log(`battleship lobby server listening on port ${port}`))
}
