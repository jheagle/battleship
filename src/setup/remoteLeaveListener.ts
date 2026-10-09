import jsonDom from 'json-dom'
import { leaveRemoteGame } from '../network/remoteGame'
import { disconnectLobbySocket } from '../network/lobbySocket'
import startMenu from './startMenu'
import type { DomItem, DomItemRoot } from 'json-dom/dist/domItem/types'

/**
 * The final-score screen's Leave button, for a remote game - any player can click it, same as Play Again
 * (there is nothing destructive about leaving). Unlike Play Again, this takes just its own clicker all the way
 * back to the main menu: leaves the finished game (stopping forwarding, clearing the rendered tree - see
 * remoteGame.ts's leaveRemoteGame), disconnects this connection's own lobby socket and clears the shared `?room=`
 * link from the address bar (the same cleanup remoteListener.ts's own leaveToPresets does for the waiting
 * room's Leave button), and shows a freshly rendered menu - whose default screen is the game-type tiles, not
 * the waiting room.
 *
 * This only ever runs client-side, with forwarding already turned off for this exact reason (see
 * remoteGame.ts's enterRemoteGame) - the server's own copy of this listener name is a trivial stand-in, never
 * meant to actually run (see server/gameplay.ts's buildIsolatedRoot).
 * @param e
 * @param target
 */
const remoteLeaveListener = (e: Event, target: DomItem): void => {
  const root = jsonDom.getTopParentItem(target) as DomItemRoot
  leaveRemoteGame(root)
  disconnectLobbySocket()
  history.replaceState(null, '', location.pathname)
  startMenu(root)
}

export default remoteLeaveListener
