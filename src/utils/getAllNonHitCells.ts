import treeloomMatrix from 'treeloom-matrix'
import checkIfHitCell from './checkIfHitCell'
import type { Point } from 'treeloom-matrix/dist/point/types'
import type { Board } from '../types'

/**
 * Get all points which were not yet hit in the matrix.
 * @param matrix
 */
const getAllNonHitCells = (matrix: Board): Point[] => treeloomMatrix.getAllPoints(matrix).filter(p => !checkIfHitCell(p, matrix))

export default getAllNonHitCells
