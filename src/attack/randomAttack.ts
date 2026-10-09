import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'
import attackFleet from './attackFleet'
import getAllNonHitCells from '../utils/getAllNonHitCells'
import type { Player, Tile } from '../types'

/**
 * Attack a random still-unhit cell on a random still-afloat opponent's board - no targeting logic at all,
 * unlike computerAttack.ts's own density-based choice (this is deliberately the dumbest possible fallback, not
 * a robot's turn). Used when a human player's own turn-timeout deadline expires in a remote game (see
 * server/gameplay.ts) instead of leaving everyone else waiting on them indefinitely.
 * @param attacker
 * @param players
 */
const randomAttack = (attacker: Player, players: Player[]): Player[] => {
  const opponents = players.filter(player => player !== attacker && player.status > 0)
  if (!opponents.length) {
    return players
  }
  const victim = opponents[siFunciona.randomInteger(opponents.length)]
  const cells = getAllNonHitCells(victim.board)
  if (!cells.length) {
    return players
  }
  const point = cells[siFunciona.randomInteger(cells.length)]
  const tile = matrixDom.getDomItemFromPoint(point, victim.board) as Tile
  return attackFleet(tile)
}

export default randomAttack
