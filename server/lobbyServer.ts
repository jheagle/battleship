import './installPseudoDom'
import { createServer } from 'http'
import jsonDom from 'json-dom'
import { Server, Socket } from 'socket.io'
import { startRoomGame, watchRoomGame } from './gameplay'
import type { Server as HttpServer } from 'http'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { ForwardedEvent } from 'json-dom/dist/events/types'
import type { HintSetting } from '../src/setup/gameOptions'
import type { RoomGame } from './gameplay'

/** The fewest players a game can start with - nobody to attack otherwise. */
const MIN_PLAYERS_TO_START = 2

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
      if (room.game) {
        ack({ error: 'The game has already started' })
        return
      }
      if (room.players.size < MIN_PLAYERS_TO_START) {
        ack({ error: `Need at least ${MIN_PLAYERS_TO_START} players to start` })
        return
      }
      room.game = startRoomGame([...room.players.entries()], hints, firstGoesFirst)
      room.broadcastGame = watchRoomGame(room.game, (socketId, redactedBody) => io.to(socketId).emit('gameUpdate', forTransport(redactedBody)))
      ack({ started: true })
    })

    socket.on('gameAction', (envelope: ForwardedEvent) => {
      const room = currentRoom ? rooms.get(currentRoom) : undefined
      if (!room?.game) {
        return
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
