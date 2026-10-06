import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'
import displayTargets from './displayTargets'
import filterAdjacentPoints from '../utils/filterAdjacentPoints'
import getAllNonHitCells from '../utils/getAllNonHitCells'
import { densityChoices } from './densityTargets'
import type { Player, Tile } from '../types'

/**
 * Choose which coordinate to attack, in layers: the density model first, then the follow-up on broken ships, then the
 * checkerboard over every unattacked cell. The highest-rated density cells are what gets displayed, so the choice can
 * be seen before the checkerboard tie-break narrows it.
 * @param victim
 */
const selectTargetCoordinate = (victim: Player): Tile | false => {
  const { top, targets } = densityChoices(victim)
  const finalTargets = targets.length ? targets : getAllNonHitCells(victim.board).filter(t => filterAdjacentPoints(t))
  const target = finalTargets[siFunciona.randomInteger(finalTargets.length)]
  displayTargets(top.length ? top : finalTargets, target, victim)
  // Hit one of the most likely cells at random
  return matrixDom.getDomItemFromPoint(target, victim.board) as Tile | false
}

export default selectTargetCoordinate
