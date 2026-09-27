import jsonDom from 'json-dom'
import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'
import type { Point } from 'matrix-dom/dist/point/types'
import type { Player } from '../types'

/**
 * The points being considered for attack (targets), which one has been chosen so far (target, once the search
 * narrows to it) and the player under attack (victim).
 */
export interface ResetTargetsData {
  targets: Point[]
  target?: Point
  victim: Player
}

/**
 * @param data
 */
const resetTargets = (data: ResetTargetsData): ResetTargetsData => {
  data.victim.board.children.map(l => jsonDom.updateElement(siFunciona.mergeObjectsMutable(l, { attributes: { style: { borderColor: '#333' } } })))
  data.targets.forEach(t => jsonDom.updateElement(siFunciona.mergeObjectsMutable(matrixDom.getDomItemFromPoint(t, data.victim.board), { attributes: { style: { borderColor: '#333' } } })))
  if (!data.target) {
    data.victim.board.children.map(l => jsonDom.updateElement(siFunciona.mergeObjectsMutable(l, { attributes: { style: { borderColor: 'yellow' } } })))
    data.targets.forEach(t => jsonDom.updateElement(siFunciona.mergeObjectsMutable(matrixDom.getDomItemFromPoint(t, data.victim.board), { attributes: { style: { borderColor: 'yellow' } } })))
  }
  return data
}

export default resetTargets
