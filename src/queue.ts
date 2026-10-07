import { getSession } from './setup/gameSession'
import type { DomItem } from 'json-dom/dist/domItem/types'

/**
 * The timed queue the given item's game runs on: steps queued here run one after another, after their delay. Each
 * game has its own queue (see gameSession), so two games' turn changes, robot attacks, and animations never interleave.
 * @param item
 * @param fn
 * @param time
 * @param args
 */
const queueTimeout = (item: DomItem, fn: Function, time: number = 0, ...args: any[]): Promise<any> => getSession(item).queue(fn, time, ...args)

export default queueTimeout
