import jsonDom from 'json-dom'
import matrixDom from 'matrix-dom'
import { densityChoices } from '../robot/densityTargets'
import { paint, shade } from '../robot/resetTargets'
import type { Player } from '../types'

/**
 * The boards a player is attacking: every other player's board.
 * @param player
 */
export const victimsOf = (player: Player): Player[] => (jsonDom.getParentsByClass('boards', player)[0].children as Player[]).filter(p => p !== player)

/**
 * Shade a board's cells by the robot's weighting, as a hint to a human about where a ship may be. The weighting only
 * uses what a player can already see: attacked cells, hit parts and the lengths of unsunk ships.
 * @param victim
 */
export const showHeatHint = (victim: Player): void => {
  densityChoices(victim).heat.forEach(cell => paint(victim, cell.point, shade(cell.intensity)))
}

/**
 * Put a board's cells back to their normal border.
 * @param victim
 */
export const clearHeatHint = (victim: Player): void => {
  matrixDom.getAllPoints(victim.board).filter(p => p.z === 0).forEach(point => paint(victim, point, '#333'))
}
