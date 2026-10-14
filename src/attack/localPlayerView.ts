import jsonDom from 'json-dom'
import siFunciona from 'si-funciona'
import { roleFor } from './playerView'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Player } from '../types'

/**
 * Marks every player with which role they play in `viewer`'s own current view (see playerView.ts's roleFor) -
 * the local-play counterpart to redactGameState.ts's applyPlayerView, which does the same thing for a remote
 * viewer's own redacted clone. Local play never redacts data, so this mutates the real tree directly, the same
 * way updatePlayer.ts already mutates a player's own outline/box-shadow style. Only ever changes a className,
 * never touches board/fleet data.
 *
 * `viewer === null` means nobody is "own" (robots-only/watch - there is no human playing) - every player gets
 * role-summary unconditionally.
 * @param players
 * @param viewer
 */
export const applyLocalPlayerView = (players: Player[], viewer: Player | null): void => {
  players.forEach(player => {
    const role = viewer === null ? 'summary' : roleFor(player, viewer)
    jsonDom.updateElement(siFunciona.mergeObjectsMutable(player, { attributes: { className: `player role-${role}` } }) as DomItem)
  })
}

export default applyLocalPlayerView
