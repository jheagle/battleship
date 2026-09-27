import matrixDom from 'matrix-dom'
import checkIfHitCell from './checkIfHitCell'
import type { Point } from 'matrix-dom/dist/point/types'
import type { Board } from '../types'

/**
 * Get the points which have same edges with the provided point and are not hit.
 * @param pnt
 * @param matrix
 */
const getAdjEdgeNonHitCells = (pnt: Point, matrix: Board): Point[] => matrixDom.adjacentEdgePoints(pnt, matrix).filter(p => !checkIfHitCell(p, matrix))

export default getAdjEdgeNonHitCells
