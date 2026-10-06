import queueTimeout from '../queue'
import resetTargets from './resetTargets'
import type { HeatCell } from './resetTargets'
import type { Point } from 'matrix-dom/dist/point/types'
import type { Player } from '../types'

/**
 * Show the robot's thinking as a heat map of the cells it is weighing, then clear it once it has chosen.
 * @param cells
 * @param target
 * @param victim
 */
const displayTargets = (cells: HeatCell[], target: Point | undefined, victim: Player): Array<Promise<any>> => {
  return [
    queueTimeout(resetTargets, 0, { targets: cells, victim }),
    queueTimeout(resetTargets, 200, { targets: cells, target, victim })
  ]
}

export default displayTargets
