import { io, Socket } from 'socket.io-client'
import type { ForwardedEvent } from 'json-dom/dist/events/types'
import type { HintSetting } from '../setup/gameOptions'
import type { RoomState } from '../../server/lobbyServer'

/** No server is deployed yet - this only works against a locally-run lobby server (npm run dev:lobby). */
const DEFAULT_URL = 'http://localhost:3002'

let socket: Socket | null = null

/**
 * The lobby socket, connecting on first use. A test can connect it to its own ephemeral server before triggering any
 * UI action, by calling this directly with that server's URL - the UI's own calls below then reuse that connection.
 * @param url
 */
export const connectLobbySocket = (url: string = DEFAULT_URL): Socket => {
  if (!socket) {
    socket = io(url)
  }
  return socket
}

/** Close the lobby socket and forget it, so the next connectLobbySocket call starts fresh. */
export const disconnectLobbySocket = (): void => {
  socket?.close()
  socket = null
}

/** Create a room as its host, resolving with the room's state once the server acknowledges it, or an error. */
export const createRoom = (name: string, roomName: string): Promise<RoomState | { error: string }> =>
  new Promise(resolve => connectLobbySocket().emit('createRoom', { name, roomName }, resolve))

/** Look up a room's own lobby name and host's name by its code, without joining it - lets a joiner see whose
 * game it is before they commit their own name (see mainMenu.ts's remote-join-confirm). */
export const peekRoom = (roomCode: string): Promise<{ roomName: string, hostName: string } | { error: string }> =>
  new Promise(resolve => connectLobbySocket().emit('peekRoom', { roomCode }, resolve))

/** Join an existing room by its code, resolving with the room's state, or an error if it could not be joined. */
export const joinRoom = (roomCode: string, name: string): Promise<RoomState | { error: string }> =>
  new Promise(resolve => connectLobbySocket().emit('joinRoom', { roomCode, name }, resolve))

/** Be told whenever the room's state changes (a player joins or leaves). Replaces any previous listener rather
 * than adding another - Play Again (see remotePlayAgainListener.ts) re-enters the same waiting room, which
 * would otherwise register a fresh listener each time, piling up duplicate renders on every room update. */
export const onRoomUpdate = (callback: (state: RoomState) => void): void => {
  connectLobbySocket().off('roomUpdate').on('roomUpdate', callback)
}

/** Be told if the host leaves, closing the room for everyone still in it. Replaces any previous listener, for
 * the same reason as onRoomUpdate above. */
export const onRoomClosed = (callback: () => void): void => {
  connectLobbySocket().off('roomClosed').on('roomClosed', callback)
}

/** This connection's own socket id, once connected - used to tell whether this player is the room's host. */
export const getSocketId = (): string | undefined => connectLobbySocket().id

/** The host starts the game: every connected player becomes a human player, in the room's own join order. */
export const startGame = (hints: HintSetting): Promise<{ started: true } | { error: string }> =>
  new Promise(resolve => connectLobbySocket().emit('startGame', { hints }, resolve))

/** Be told whenever the game's state changes - the redacted view of the whole screen, for this connection alone.
 * Replaces any previous listener rather than adding another - a rematch (see remotePlayAgainListener.ts,
 * server/lobbyServer.ts's relaxed startGame guard) re-enters a second real game on the same connection, which
 * would otherwise leave the first game's own render loop listening alongside the new one, forever. */
export const onGameUpdate = (callback: (redactedBody: object) => void): void => {
  connectLobbySocket().off('gameUpdate').on('gameUpdate', callback)
}

/** Forward a user interaction to the server instead of running its listener locally - see setForwardEvents. */
export const sendGameAction = (envelope: ForwardedEvent): void => {
  connectLobbySocket().emit('gameAction', envelope)
}
