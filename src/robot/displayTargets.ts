import queueTimeout from '../queue'
import resetTargets from './resetTargets'
import type { Point } from 'matrix-dom/dist/point/types'
import type { Player } from '../types'

/**
 * @param targets
 * @param target
 * @param victim
 */
const displayTargets = (targets: Point[], target: Point | undefined, victim: Player): Array<Promise<any>> => {
  return [
    queueTimeout(resetTargets, 0, { targets, victim }),
    queueTimeout(resetTargets, 200, { targets, target, victim })
  ]
}

export default displayTargets
