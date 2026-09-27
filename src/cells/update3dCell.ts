import siFunciona from 'si-funciona'
import configureHtml from './configureHtml'

import type { Board, Tile } from '../types'

/**
 * Given a cell and new config data, update the data of the cell
 * @param config
 * @param matrix
 * @param x
 * @param y
 * @param z
 * @param isRobot
 */
const update3dCell = (config: Partial<Tile>, matrix: Board, x: number, y: number, z: number, isRobot: boolean = false): Tile => configureHtml(siFunciona.mergeObjectsMutable(matrix.children[z].children[y].children[x], config) as Tile, isRobot)

export default update3dCell
