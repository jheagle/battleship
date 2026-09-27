import siFunciona from 'si-funciona'

/**
 * The one timed queue the whole game runs on: steps queued here run one after another, after their delay.
 */
const queueTimeout: (fn: Function, time: number, ...args: any) => Promise<any> = siFunciona.queueTimeout()

export default queueTimeout
