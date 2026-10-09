import jsonDom from 'json-dom'
import { connectLobbySocket, createRoom, joinRoom, peekRoom, onRoomUpdate, onRoomClosed, disconnectLobbySocket, getSocketId, startGame } from '../network/lobbySocket'
import { enterRemoteGame } from '../network/remoteGame'
import { show, update } from './showLobby'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { HintSetting } from './gameOptions'
import type { RoomState } from '../../server/lobbyServer'

/** The room's own last known state (its code, name, host, and players) - kept up to date by renderRoomState
 * below regardless of whether the waiting room is currently shown, so Play Again (see remotePlayAgainListener.ts)
 * can show it again for everyone once a game ends, without a fresh server round trip to ask for it again. */
let lastRoomState: RoomState | null = null

/** The current room's own last known state, if this connection has ever been in one. */
export const getLastRoomState = (): RoomState | null => lastRoomState

/** The room code a successful peek (see peekAndConfirm) found - remembered so the Join confirm panel's own
 * submit can join it without needing its own room-code field. */
let pendingJoinCode: string | null = null

type RemoteSubPanel = 'remote-choice' | 'remote-host-form' | 'remote-code-entry' | 'remote-join-confirm'

/** Show exactly one of remote-entry's own four sub-panels (see mainMenu.ts), hiding the other three. */
const showSubPanel = (entry: DomItem, which: RemoteSubPanel): void => {
  const panels: RemoteSubPanel[] = ['remote-choice', 'remote-host-form', 'remote-code-entry', 'remote-join-confirm']
  panels.forEach(panel => show(jsonDom.getChildrenByClass(panel, entry)[0], panel === which))
}

/** Look up a room by code (without joining it - see lobbySocket.ts's peekRoom) and move to the Join confirm
 * panel showing whose game it is, or fall back to the code-entry panel with the error shown inline if it could
 * not be found. The code-entry panel (with the code already filled in) shows immediately, before the lookup
 * even resolves, so a direct link lands on something straight away rather than a blank wait. */
const peekAndConfirm = async (entry: DomItem, roomCode: string): Promise<void> => {
  (jsonDom.getChildrenByName('remote-code', entry)[0].element as HTMLInputElement).value = roomCode
  update(jsonDom.getChildrenByClass('remote-code-status', entry)[0], { innerHTML: 'Looking up room...' })
  showSubPanel(entry, 'remote-code-entry')
  const result = await peekRoom(roomCode)
  if ('error' in result) {
    update(jsonDom.getChildrenByClass('remote-code-status', entry)[0], { innerHTML: result.error })
    return
  }
  update(jsonDom.getChildrenByClass('remote-code-status', entry)[0], { innerHTML: '' })
  pendingJoinCode = roomCode
  update(jsonDom.getChildrenByClass('remote-join-message', entry)[0], { innerHTML: `You are joining ${result.hostName}'s ${result.roomName}.` })
  showSubPanel(entry, 'remote-join-confirm')
  ;(jsonDom.getChildrenByName('remote-join-name', entry)[0].element as HTMLInputElement).focus()
}

/** Show the remote entry area in place of the game-type tiles - either the Host/Join choice (no code yet, the
 * Online Multiplayer tile itself), or (a shared join link - see main.ts) straight to the Join confirm panel
 * once that code's own room has been found. */
export const showRemoteEntry = (menu: DomItem, roomCode: string = ''): void => {
  const entry = jsonDom.getChildrenByClass('remote-entry', menu)[0]
  show(jsonDom.getChildrenByClass('presets', menu)[0], false)
  show(entry, true)
  if (roomCode) {
    void peekAndConfirm(entry, roomCode)
    return
  }
  pendingJoinCode = null
  showSubPanel(entry, 'remote-choice')
}

/** Replace the waiting room's player list, lobby name, room code and host controls with a freshly-received
 * room state. */
const renderRoomState = (menu: DomItem, state: RoomState): void => {
  lastRoomState = state
  const list = jsonDom.getChildrenByClass('waiting-room-players', menu)[0]
  list.children.slice().forEach((child: DomItem) => jsonDom.removeChild(list, child))
  state.players.forEach(player => {
    jsonDom.renderHtml(jsonDom.createDomItem({
      nodeName: 'li',
      attributes: { innerHTML: player.id === state.hostId ? `${player.name} (Host)` : player.name }
    }), list)
  })
  update(jsonDom.getChildrenByClass('waiting-room-name', menu)[0], { innerHTML: `Lobby: ${state.roomName}` })
  update(jsonDom.getChildrenByClass('waiting-room-code', menu)[0], { innerHTML: `Room Code: ${state.roomCode}` })
  show(jsonDom.getChildrenByClass('waiting-room-host-controls', menu)[0], state.hostId === getSocketId())
}

/** Leave whatever room is open and show the game types again, clearing any status message - or, with a
 * message (the room closed on its own), show it on the Host/Join choice panel instead of the tiles. */
const leaveToPresets = (menu: DomItem, message: string = ''): void => {
  disconnectLobbySocket()
  history.replaceState(null, '', location.pathname)
  pendingJoinCode = null
  show(jsonDom.getChildrenByClass('waiting-room', menu)[0], false)
  const entry = jsonDom.getChildrenByClass('remote-entry', menu)[0]
  update(jsonDom.getChildrenByClass('remote-choice-status', entry)[0], { innerHTML: message })
  show(entry, Boolean(message))
  if (message) {
    showSubPanel(entry, 'remote-choice')
  }
  show(jsonDom.getChildrenByClass('presets', menu)[0], !message)
}

/** Once a room is created or joined (or a finished game's Play Again brings everyone back to it - see
 * remotePlayAgainListener.ts), watch it for changes and show the waiting room. Puts the room's own code in
 * the address bar too, so the host (or anyone else) can just copy the current URL to share a join link - see
 * showRemoteEntry, which reads it back out on the receiving end. */
export const enterWaitingRoom = (menu: DomItem, state: RoomState): void => {
  history.replaceState(null, '', `${location.pathname}?room=${state.roomCode}`)
  onRoomUpdate(newState => renderRoomState(menu, newState))
  onRoomClosed(() => leaveToPresets(menu, 'The host left - room closed.'))
  // Every player registers this the moment they enter the waiting room, host included - whichever one of them
  // starts the game, everyone (including whoever started it) gets this same first gameUpdate push, so everyone
  // enters the rendered game the same way instead of only the one who clicked Start.
  connectLobbySocket().once('gameUpdate', firstUpdate => enterRemoteGame(jsonDom.getTopParentItem(menu), firstUpdate))
  renderRoomState(menu, state)
  // Hides both the game-type tiles and the whole remote-entry area - normally only remote-entry is still
  // showing by this point, but Play Again (see remotePlayAgainListener.ts) re-enters the waiting room straight
  // from a freshly rendered menu, where the tiles are visible by default - showing the waiting room has to hide
  // both regardless of how it got here, not rely on a different step somewhere else having already hidden one.
  show(jsonDom.getChildrenByClass('presets', menu)[0], false)
  show(jsonDom.getChildrenByClass('remote-entry', menu)[0], false)
  show(jsonDom.getChildrenByClass('waiting-room', menu)[0], true)
}

/**
 * The Online Multiplayer tile, its Host/Join choice and forms, and the waiting room it leads to. Room/presence
 * only - actual gameplay over the socket is a separate, later piece.
 * @param e
 * @param target
 */
const remoteListener = async (e: Event, target: DomItem): Promise<void> => {
  const className = (e.target as HTMLElement).className
  const menu = jsonDom.getChildrenByClass('main-menu', jsonDom.getTopParentItem(target).body)[0]
  const entry = jsonDom.getChildrenByClass('remote-entry', menu)[0]

  if (className.includes('preset-remote')) {
    showRemoteEntry(menu)
    return
  }
  if (className.includes('remote-back')) {
    show(entry, false)
    show(jsonDom.getChildrenByClass('presets', menu)[0], true)
    return
  }
  if (className.includes('remote-sub-back')) {
    showSubPanel(entry, 'remote-choice')
    return
  }
  if (className.includes('remote-choice-host')) {
    showSubPanel(entry, 'remote-host-form')
    return
  }
  if (className.includes('remote-choice-join')) {
    showSubPanel(entry, 'remote-code-entry')
    return
  }
  if (className.includes('remote-code-submit')) {
    const roomCode = (jsonDom.getChildrenByName('remote-code', entry)[0].element as HTMLInputElement).value.trim().toUpperCase()
    if (!roomCode) {
      update(jsonDom.getChildrenByClass('remote-code-status', entry)[0], { innerHTML: 'Enter a room code' })
      return
    }
    await peekAndConfirm(entry, roomCode)
    return
  }
  if (className.includes('remote-host-submit')) {
    const roomName = (jsonDom.getChildrenByName('remote-room-name', entry)[0].element as HTMLInputElement).value.trim()
    const name = (jsonDom.getChildrenByName('remote-host-name', entry)[0].element as HTMLInputElement).value.trim()
    if (!roomName) {
      update(jsonDom.getChildrenByClass('remote-host-status', entry)[0], { innerHTML: 'A lobby name is required' })
      return
    }
    if (!name) {
      update(jsonDom.getChildrenByClass('remote-host-status', entry)[0], { innerHTML: 'Enter your name first' })
      return
    }
    const result = await createRoom(name, roomName)
    if ('error' in result) {
      update(jsonDom.getChildrenByClass('remote-host-status', entry)[0], { innerHTML: result.error })
      return
    }
    enterWaitingRoom(menu, result)
    return
  }
  if (className.includes('remote-join-submit')) {
    const name = (jsonDom.getChildrenByName('remote-join-name', entry)[0].element as HTMLInputElement).value.trim()
    if (!name) {
      update(jsonDom.getChildrenByClass('remote-join-status', entry)[0], { innerHTML: 'Enter your name first' })
      return
    }
    if (!pendingJoinCode) {
      return
    }
    const result = await joinRoom(pendingJoinCode, name)
    if ('error' in result) {
      update(jsonDom.getChildrenByClass('remote-join-status', entry)[0], { innerHTML: result.error })
      return
    }
    pendingJoinCode = null
    enterWaitingRoom(menu, result)
    return
  }
  if (className.includes('waiting-room-leave')) {
    leaveToPresets(menu)
    return
  }
  if (className.includes('waiting-room-start')) {
    const waitingRoom = jsonDom.getChildrenByClass('waiting-room', menu)[0]
    const hints = (jsonDom.getChildrenByName('waiting-room-hints', waitingRoom)[0].element as HTMLSelectElement).value as HintSetting
    const ack = await startGame(hints)
    if ('error' in ack) {
      update(jsonDom.getChildrenByClass('waiting-room-status', waitingRoom)[0], { innerHTML: ack.error })
    }
  }
}

export default remoteListener
