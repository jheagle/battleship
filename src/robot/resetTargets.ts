import jsonDom from 'json-dom'
import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'
import type { Point } from 'matrix-dom/dist/point/types'
import type { Player } from '../types'

/**
 * A cell the robot is thinking about, and how strongly (0 to 1, relative to the top score).
 */
export interface HeatCell {
  point: Point
  intensity: number
}

/**
 * The points being considered for attack (targets), which one has been chosen so far (target, once the search
 * narrows to it) and the player under attack (victim).
 */
export interface ResetTargetsData {
  targets: HeatCell[]
  target?: Point
  victim: Player
}

/**
 * A faint yellow for the weakest cells up to a solid one for the strongest, so the spread of the robot's thinking shows.
 * @param intensity
 */
export const shade = (intensity: number): string => `rgba(255, 215, 0, ${0.15 + 0.85 * intensity})`

/**
 * @param victim
 * @param point
 * @param color
 */
export const paint = (victim: Player, point: Point, color: string): void => {
  jsonDom.updateElement(siFunciona.mergeObjectsMutable(matrixDom.getDomItemFromPoint(point, victim.board), { attributes: { style: { borderColor: color } } }))
}

/**
 * @param data
 */
const resetTargets = (data: ResetTargetsData): ResetTargetsData => {
  data.victim.board.children.map(l => jsonDom.updateElement(siFunciona.mergeObjectsMutable(l, { attributes: { style: { borderColor: '#333' } } })))
  data.targets.forEach(t => paint(data.victim, t.point, '#333'))
  if (!data.target) {
    data.victim.board.children.map(l => jsonDom.updateElement(siFunciona.mergeObjectsMutable(l, { attributes: { style: { borderColor: 'yellow' } } })))
    data.targets.forEach(t => paint(data.victim, t.point, shade(t.intensity)))
  }
  return data
}

export default resetTargets
