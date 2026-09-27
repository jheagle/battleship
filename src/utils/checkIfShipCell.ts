import type { Point } from 'matrix-dom/dist/point/types'
import type { Board, Tile } from '../types'

/**
 * Return the hasShip tile boolean at the specified point.
 * @param pnt
 * @param matrix
 */
const checkIfShipCell = (pnt: Point, matrix: Board): boolean => (matrix.children[pnt.z]?.children[pnt.y]?.children[pnt.x] as Tile | undefined)?.hasShip ?? false

export default checkIfShipCell
