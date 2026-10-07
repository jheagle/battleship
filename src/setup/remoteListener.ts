import jsonDom from 'json-dom'
import { createRoom, joinRoom, onRoomUpdate, onRoomClosed, disconnectLobbySocket } from '../network/lobbySocket'
import { show, update } from './showLobby'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { RoomState } from '../../server/lobbyServer'

/** Replace the waiting room's player list and room code with a freshly-received room state. */
const renderRoomState = (menu: DomItem, state: RoomState): void => {
  const list = jsonDom.getChildrenByClass('waiting-room-players', menu)[0]
  list.children.slice().forEach((child: DomItem) => jsonDom.removeChild(list, child))
  state.players.forEach(player => {
    jsonDom.renderHtml(jsonDom.createDomItem({
      nodeName: 'li',
      attributes: { innerHTML: player.id === state.hostId ? `${player.name} (Host)` : player.name }
    }), list)
  })
  update(jsonDom.getChildrenByClass('waiting-room-code', menu)[0], { innerHTML: `Room Code: ${state.roomCode}` })
}

/** Leave whatever room is open and show the game types again, clearing any status message. */
const leaveToPresets = (menu: DomItem, message: string = ''): void => {
  disconnectLobbySocket()
  show(jsonDom.getChildrenByClass('waiting-room', menu)[0], false)
  const entry = jsonDom.getChildrenByClass('remote-entry', menu)[0]
  update(jsonDom.getChildrenByClass('remote-status', entry)[0], { innerHTML: message })
  show(entry, Boolean(message))
  show(jsonDom.getChildrenByClass('presets', menu)[0], !message)
}

/** Once a room is created or joined, watch it for changes and show the waiting room. */
const enterWaitingRoom = (menu: DomItem, state: RoomState): void => {
  onRoomUpdate(newState => renderRoomState(menu, newState))
  onRoomClosed(() => leaveToPresets(menu, 'The host left - room closed.'))
  renderRoomState(menu, state)
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
    update(jsonDom.getChildrenByClass('remote-status', entry)[0], { innerHTML: '' })
    show(jsonDom.getChildrenByClass('presets', menu)[0], false)
    show(entry, true)
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

  const name = (jsonDom.getChildrenByName('remote-name', entry)[0].element as HTMLInputElement).value
  if (className.includes('remote-host')) {
    enterWaitingRoom(menu, await createRoom(name))
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
