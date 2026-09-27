import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'
import displayTargets from './displayTargets'
import filterAdjacentPoints from '../utils/filterAdjacentPoints'
import getAllNonHitCells from '../utils/getAllNonHitCells'
import targetBrokenShips from './targetBrokenShips'
import type { Player, Tile } from '../types'

/**
 * Choose which coordinate to attack.
 * @param victim
 */
const selectTargetCoordinate = (victim: Player): Tile | false => {
  const availTargets = targetBrokenShips(victim)
  const finalTargets = availTargets.length ? availTargets : getAllNonHitCells(victim.board).filter(t => filterAdjacentPoints(t))
  const target = finalTargets[siFunciona.randomInteger(finalTargets.length)]
  displayTargets(finalTargets, target, victim)
  // If there are available targets then hit one at random
  return matrixDom.getDomItemFromPoint(target, victim.board) as Tile | false
}

export default selectTargetCoordinate
