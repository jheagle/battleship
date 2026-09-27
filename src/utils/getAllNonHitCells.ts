import matrixDom from 'matrix-dom'
import checkIfHitCell from './checkIfHitCell'

/**
 * Get all points which were not yet hit in the matrix.
 * @function getAllNonHitCells
 * @param matrix
 * @returns {Array}
 */
const getAllNonHitCells = matrix => matrixDom.getAllPoints(matrix).filter(p => !checkIfHitCell(p, matrix))

export default getAllNonHitCells
