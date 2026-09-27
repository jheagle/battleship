import matrixDom from 'matrix-dom'
import checkIfHitCell from './checkIfHitCell'
import type { Point } from 'matrix-dom/dist/point/types'
import type { Board } from '../types'

/**
 * Get all points which were not yet hit in the matrix.
 * @param matrix
 */
const getAllNonHitCells = (matrix: Board): Point[] => matrixDom.getAllPoints(matrix).filter(p => !checkIfHitCell(p, matrix))

export default getAllNonHitCells
