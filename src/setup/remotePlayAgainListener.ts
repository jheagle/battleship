import jsonDom from 'json-dom'
import { leaveRemoteGame } from '../network/remoteGame'
import startMenu from './startMenu'
import { enterWaitingRoom, getLastRoomState } from './remoteListener'
import type { DomItem, DomItemRoot } from 'json-dom/dist/domItem/types'

/**
 * The final-score screen's Play Again button, for a remote game - any player can click it (there is nothing
 * destructive about asking to see the waiting room again), not just the host. Leaves the finished game
 * (stopping forwarding, clearing the rendered tree - see remoteGame.ts's leaveRemoteGame) and shows the same
 * room's own waiting room again, with the same players and the same host, using the room's own last known
 * state (see remoteListener.ts's getLastRoomState - kept current throughout, not just while the waiting room
 * is visible, so no fresh server round trip is needed here). From there, the host starts a new round exactly
 * the way they started the first one - server/lobbyServer.ts's startGame handler already allows a room's own
 * game to restart once it has actually ended.
 *
 * This only ever runs client-side, with forwarding already turned off for this exact reason (see
 * remoteGame.ts's enterRemoteGame) - the server's own copy of this listener name is a trivial stand-in, never
 * meant to actually run.
 * @param e
 * @param target
 */
const remotePlayAgainListener = (e: Event, target: DomItem): void => {
  const state = getLastRoomState()
  if (!state) {
    return
  }
  const root = jsonDom.getTopParentItem(target) as DomItemRoot
  leaveRemoteGame(root)
  const menu = jsonDom.getChildrenByClass('main-menu', startMenu(root).body)[0]
  enterWaitingRoom(menu, state)
}

export default remotePlayAgainListener
