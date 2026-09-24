import siFunciona from 'si-funciona'

/**
 * The one timed queue the whole game runs on: steps queued here run one after another, after their delay.
 */
const queueTimeout = siFunciona.queueTimeout()

export default queueTimeout
