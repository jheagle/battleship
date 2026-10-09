import type { Player } from '../types'

/** Which role a player plays in a given viewer's own current view of the game. */
export type PlayerRole = 'own' | 'target' | 'summary'

/**
 * Which role `player` plays in `viewer`'s own current view: their own board, a board they can actually
 * attack right now, or everyone else (not their turn, or already eliminated) - still a real board, just
 * styled plainer, no highlighting or animation (see redactGameState.ts's applyPlayerView, which is the one
 * place this actually changes anything sent or rendered). Independent of local vs remote - whatever renders
 * a player's own screen, remote today, local single-player later, decides what to draw for each role; this
 * only decides which role applies.
 * @param player
 * @param viewer
 */
export const roleFor = (player: Player, viewer: Player): PlayerRole => {
  if (player === viewer) {
    return 'own'
  }
  if (player.status > 0 && viewer.attacker) {
    return 'target'
  }
  return 'summary'
}
