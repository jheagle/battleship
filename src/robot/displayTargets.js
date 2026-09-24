import queueTimeout from '../queue'
import resetTargets from './resetTargets'

/**
 *
 * @param targets
 * @param target
 * @param victim
 * @returns {Array}
 */
const displayTargets = (targets, target, victim) => {
  return [
    queueTimeout(resetTargets, 0, { targets, victim }),
    queueTimeout(resetTargets, 200, { targets, target, victim })
  ]
}

export default displayTargets
