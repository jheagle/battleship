import matrixDom from 'matrix-dom'
import checkIfHitCell from './checkIfHitCell'

/**
 * Get the points which have same edges with the provided point and are not hit.
 * @function getAdjEdgeNonHitCells
 * @param pnt
 * @param matrix
 * @returns {Array}
 */
const getAdjEdgeNonHitCells = (pnt, matrix) => matrixDom.adjacentEdgePoints(pnt, matrix).filter(p => !checkIfHitCell(p, matrix))

export default getAdjEdgeNonHitCells
