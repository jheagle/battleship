import type { Point } from 'matrix-dom/dist/point/types'
import type { Board, Tile } from '../types'

/**
 * Return the isHit tile boolean at the specified point.
 * @param pnt
 * @param matrix
 */
const checkIfHitCell = (pnt: Point, matrix: Board): boolean => (matrix.children[pnt.z].children[pnt.y].children[pnt.x] as Tile).isHit

export default checkIfHitCell
