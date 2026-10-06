import jsonDom from 'json-dom'
import siFunciona from 'si-funciona'
import queueTimeout from '../queue'
import resetTargets from './resetTargets'
import { clearHeatHint } from '../attack/heatHint'
import type { HeatCell } from './resetTargets'
import type { Point } from 'matrix-dom/dist/point/types'
import type { Player } from '../types'

/** How long each stage of the robot's attack is shown for, in turn. */
export const STAGE_MS = 400

/**
 * Colour every row of a player's board, which is how a whole board is outlined.
 * @param player
 * @param color
 */
export const outlineBoard = (player: Player, color: string): void => {
  player.board.children.forEach(row => jsonDom.updateElement(siFunciona.mergeObjectsMutable(row, { attributes: { style: { borderColor: color } } })))
}

/**
 * The stages of the robot's thinking, shown in turn: the boards it is choosing between, the chosen board, the cells it
 * weighs, then the cell it picks at random. The shot itself comes after the last stage (see computerAttack).
 * @param cells
 * @param target
 * @param victim
 * @param opponents
 */
const displayTargets = (cells: HeatCell[], target: Point | undefined, victim: Player, opponents: Player[]): Array<Promise<any>> => {
  return [
    queueTimeout(() => {
      opponents.filter(p => p !== victim).forEach(p => outlineBoard(p, '#777'))
      return resetTargets({ targets: cells, victim })
    }, 0),
    queueTimeout(() => outlineBoard(victim, 'red'), STAGE_MS),
    queueTimeout(resetTargets, STAGE_MS, { targets: cells, target, victim })
  ]
}

/**
 * Take the display away once the robot has chosen: the heat map and every board outline.
 * @param victim
 * @param opponents
 */
export const clearTargets = (victim: Player, opponents: Player[]): void => {
  opponents.forEach(p => {
    outlineBoard(p, '#333')
    clearHeatHint(p)
  })
}

export default displayTargets
