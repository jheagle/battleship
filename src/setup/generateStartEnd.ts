import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'
import checkIfShipCell from '../utils/checkIfShipCell'
import type { Point } from 'matrix-dom/dist/point/types'
import type { Board } from '../types'

/**
 * Every straight, horizontal or vertical, start and end point of a ship of this length which fits on the board without
 * touching a ship already there. Ships only go along one axis for now (no diagonals, z is always 0) - matrix-dom's
 * getLinesOfLength enumerates every line the geometry allows, and only knows about shape, not what occupies a cell,
 * so the blocked-cell filter (and any future direction, if diagonal or 3D ships ever arrive) stays here.
 * @param matrix
 * @param shipLength
 */
const validPlacements = (matrix: Board, shipLength: number): Array<[Point, Point]> =>
  matrixDom.getLinesOfLength(matrixDom.getAxisLengths(matrix), shipLength)
    .filter(line => !line.some(point => checkIfShipCell(point, matrix)))
    .map(line => [line[0], line[line.length - 1]])

/**
 * Pick a start and end point for a ship of the given length, at random from every placement that fits. Throws if no
 * placement fits, rather than searching forever.
 * @param matrix
 * @param shipLength
 */
const generateStartEnd = (matrix: Board, shipLength: number): [Point, Point] => {
  const placements = validPlacements(matrix, shipLength)
  if (!placements.length) {
    throw new Error(`No room on the board for a ship of length ${shipLength}`)
  }
  return placements[siFunciona.randomInteger(placements.length)]
}

export default generateStartEnd
