import { io, Socket } from 'socket.io-client'
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

/** Create a room as its host, resolving with the room's state once the server acknowledges it. */
export const createRoom = (name: string): Promise<RoomState> =>
  new Promise(resolve => connectLobbySocket().emit('createRoom', { name }, resolve))

/** Join an existing room by its code, resolving with the room's state, or an error if it could not be joined. */
export const joinRoom = (roomCode: string, name: string): Promise<RoomState | { error: string }> =>
  new Promise(resolve => connectLobbySocket().emit('joinRoom', { roomCode, name }, resolve))

/** Be told whenever the room's state changes (a player joins or leaves). */
export const onRoomUpdate = (callback: (state: RoomState) => void): void => {
  connectLobbySocket().on('roomUpdate', callback)
}

/** Be told if the host leaves, closing the room for everyone still in it. */
export const onRoomClosed = (callback: () => void): void => {
  connectLobbySocket().on('roomClosed', callback)
}
