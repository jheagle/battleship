import jsonDom from 'json-dom'
import { startGame } from '../network/lobbySocket'
import { getLastGameSettings } from './remoteListener'
import { update } from './showLobby'
import type { DomItem } from 'json-dom/dist/domItem/types'

/**
 * The final-score screen's Play Again button, for a remote game - host-only (enforced server-side, see
 * lobbyServer.ts's startGame handler; disabled on a non-host's own redacted copy too, see redactGameState.ts).
 * Reuses the settings the last real game actually started with (see remoteListener.ts's getLastGameSettings) -
 * there is no settings form on this screen, same as local hot-seat's own playAgain.ts. This only ever runs
 * client-side with forwarding already turned off for this exact reason (see remoteGame.ts's enterRemoteGame) -
 * the server's own copy of this listener name is a trivial stand-in, never meant to actually run.
 * @param e
 * @param target
 */
const remotePlayAgainListener = async (e: Event, target: DomItem): Promise<void> => {
  const settings = getLastGameSettings()
  if (!settings) {
    return
  }
  const ack = await startGame(settings.hints, settings.firstGoesFirst)
  if ('error' in ack) {
    const message = jsonDom.getChildrenByClass('remote-final-score-message', jsonDom.getTopParentItem(target).body)[0]
    update(message, { innerHTML: ack.error })
  }
}

export default remotePlayAgainListener
