import jDomMatrix from 'matrix-dom'
import checkIfShipCell from '../utils/checkIfShipCell'
import selectShipDirection from './selectShipDirection'

/**
 * Get a qualifying start and direction point for a ship of specified length
 * WARNING: This is a recursive function.
 * @param matrix
 * @param shipLength
 * @param startDir
 * @returns {Array}
 */
const generateStartEnd = (matrix, shipLength) => {
  const direction = selectShipDirection(shipLength)
  const start = jDomMatrix.randomStart(matrix, shipLength, direction)
  return jDomMatrix.checkInBetween(
    ...[start, jDomMatrix.lineEndPoint(start, shipLength, direction)],
    matrix,
    checkIfShipCell
  )
    ? generateStartEnd(matrix, shipLength)
    : [start, jDomMatrix.lineEndPoint(start, shipLength, direction)]
}

export default generateStartEnd
