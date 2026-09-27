import jDomMatrix from 'matrix-dom'
import checkIfShipCell from '../utils/checkIfShipCell'
import selectShipDirection from './selectShipDirection'
import type { Point } from 'matrix-dom/dist/point/types'
import type { Board } from '../types'

/**
 * Get a qualifying start and direction point for a ship of specified length
 * WARNING: This is a recursive function.
 * @param matrix
 * @param shipLength
 */
const generateStartEnd = (matrix: Board, shipLength: number): [Point, Point] => {
  const direction = selectShipDirection()
  const start = jDomMatrix.randomStart(matrix, shipLength, direction)
  return jDomMatrix.checkInBetween(
    start,
    jDomMatrix.lineEndPoint(start, shipLength, direction),
    matrix,
    checkIfShipCell
  )
    ? generateStartEnd(matrix, shipLength)
    : [start, jDomMatrix.lineEndPoint(start, shipLength, direction)]
}

export default generateStartEnd
