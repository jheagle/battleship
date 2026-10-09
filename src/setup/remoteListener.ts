import jsonDom from 'json-dom'
import { connectLobbySocket, createRoom, joinRoom, onRoomUpdate, onRoomClosed, disconnectLobbySocket, getSocketId, startGame } from '../network/lobbySocket'
import { enterRemoteGame } from '../network/remoteGame'
import { show, update } from './showLobby'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { HintSetting } from './gameOptions'
import type { RoomState } from '../../server/lobbyServer'

/** The room's own last known state (its code, host, and players) - kept up to date by renderRoomState below
 * regardless of whether the waiting room is currently shown, so Play Again (see remotePlayAgainListener.ts)
 * can show it again for everyone once a game ends, without a fresh server round trip to ask for it again. */
let lastRoomState: RoomState | null = null

/** The current room's own last known state, if this connection has ever been in one. */
export const getLastRoomState = (): RoomState | null => lastRoomState

/** Show the remote entry form in place of the game-type tiles, optionally with a room code already filled in -
 * used both by clicking the Online Multiplayer tile and by a shared join link (see main.ts). */
export const showRemoteEntry = (menu: DomItem, roomCode: string = ''): void => {
  const entry = jsonDom.getChildrenByClass('remote-entry', menu)[0]
  update(jsonDom.getChildrenByClass('remote-status', entry)[0], { innerHTML: '' })
  show(jsonDom.getChildrenByClass('presets', menu)[0], false)
  show(entry, true)
  if (roomCode) {
    ;(jsonDom.getChildrenByName('remote-code', entry)[0].element as HTMLInputElement).value = roomCode
    ;(jsonDom.getChildrenByName('remote-name', entry)[0].element as HTMLInputElement).focus()
  }
}

/** Replace the waiting room's player list, room code and host controls with a freshly-received room state. */
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
  update(jsonDom.getChildrenByClass('waiting-room-code', menu)[0], { innerHTML: `Room Code: ${state.roomCode}` })
  show(jsonDom.getChildrenByClass('waiting-room-host-controls', menu)[0], state.hostId === getSocketId())
}

/** Leave whatever room is open and show the game types again, clearing any status message. */
const leaveToPresets = (menu: DomItem, message: string = ''): void => {
  disconnectLobbySocket()
  history.replaceState(null, '', location.pathname)
  show(jsonDom.getChildrenByClass('waiting-room', menu)[0], false)
  const entry = jsonDom.getChildrenByClass('remote-entry', menu)[0]
  update(jsonDom.getChildrenByClass('remote-status', entry)[0], { innerHTML: message })
  show(entry, Boolean(message))
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
  // Hides both the game-type tiles and the host/join form - normally only the form is still showing by this
  // point (showRemoteEntry already hid the tiles when this player first chose Online Multiplayer), but Play
  // Again (see remotePlayAgainListener.ts) re-enters the waiting room straight from a freshly rendered menu,
  // where the tiles are visible by default - showing the waiting room has to hide both regardless of how it
  // got here, not rely on a different step somewhere else having already hidden one of them.
  show(jsonDom.getChildrenByClass('presets', menu)[0], false)
  show(jsonDom.getChildrenByClass('remote-entry', menu)[0], false)
  show(jsonDom.getChildrenByClass('waiting-room', menu)[0], true)
}

/**
 * The Online Multiplayer tile, its host/join form, and the waiting room it leads to. Room/presence only - actual
 * gameplay over the socket is a separate, later piece.
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
  if (className.includes('waiting-room-leave')) {
    leaveToPresets(menu)
    return
  }
  if (className.includes('waiting-room-start')) {
    const waitingRoom = jsonDom.getChildrenByClass('waiting-room', menu)[0]
    const hints = (jsonDom.getChildrenByName('waiting-room-hints', waitingRoom)[0].element as HTMLSelectElement).value as HintSetting
    const firstGoesFirst = (jsonDom.getChildrenByName('waiting-room-first', waitingRoom)[0].element as HTMLInputElement).checked
    // No need to wait for or enter the game here - enterWaitingRoom already registered the same first-gameUpdate
    // listener every player (host included) gets, which this call's own resulting push will satisfy too.
    const ack = await startGame(hints, firstGoesFirst)
    if ('error' in ack) {
      update(jsonDom.getChildrenByClass('waiting-room-status', waitingRoom)[0], { innerHTML: ack.error })
    }
    return
  }

  const name = (jsonDom.getChildrenByName('remote-name', entry)[0].element as HTMLInputElement).value.trim()
  if ((className.includes('remote-host') || className.includes('remote-join')) && !name) {
    update(jsonDom.getChildrenByClass('remote-status', entry)[0], { innerHTML: 'Enter your name first' })
    return
  }
  if (className.includes('remote-host')) {
    const result = await createRoom(name)
    if ('error' in result) {
      update(jsonDom.getChildrenByClass('remote-status', entry)[0], { innerHTML: result.error })
      return
    }
    enterWaitingRoom(menu, result)
    return
  }
  if (className.includes('remote-join')) {
    const roomCode = (jsonDom.getChildrenByName('remote-code', entry)[0].element as HTMLInputElement).value.toUpperCase()
    const result = await joinRoom(roomCode, name)
    if ('error' in result) {
      update(jsonDom.getChildrenByClass('remote-status', entry)[0], { innerHTML: result.error })
      return
    }
    enterWaitingRoom(menu, result)
  }
}

export default remoteListener
