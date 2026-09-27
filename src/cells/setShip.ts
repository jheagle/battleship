import setHiddenShip from './setHiddenShip'
import setViewShip from './setViewShip'

import type { Point } from 'matrix-dom/dist/point/types'
import type { Board, Tile } from '../types'

/**
 * Set a specified point to be part of a ship
 * @param matrix
 * @param point
 * @param view
 */
const setShip = (matrix: Board, point: Point, view: boolean): Tile => view ? setViewShip(matrix, point.x, point.y, point.z) : setHiddenShip(matrix, point.x, point.y, point.z)

export default setShip
