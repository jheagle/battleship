import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'
import checkIfShipCell from '../utils/checkIfShipCell'
import type { Point } from 'matrix-dom/dist/point/types'
import type { Board } from '../types'

/**
 * Every straight, horizontal or vertical, start and end point of a ship of this length which fits on the board without
 * touching a ship already there. Ships only go along one axis for now (no diagonals, z is always 0); diagonal or 3D
 * ships, if they come in a later version, would add their own directions here.
 * @param matrix
 * @param shipLength
 */
const validPlacements = (matrix: Board, shipLength: number): Array<[Point, Point]> => {
  const rows = matrix.children[0].children.length
  const columns = matrix.children[0].children[0].children.length
  const placements: Array<[Point, Point]> = []
  const directions = [{ x: 1, y: 0 }, { x: 0, y: 1 }]
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      for (const step of directions) {
        const end = { x: x + step.x * (shipLength - 1), y: y + step.y * (shipLength - 1) }
        if (end.x >= columns || end.y >= rows) continue
        const line = Array.from({ length: shipLength }, (_, i) => matrixDom.point(x + step.x * i, y + step.y * i, 0))
        if (line.some(point => checkIfShipCell(point, matrix))) continue
        placements.push([matrixDom.point(x, y, 0), matrixDom.point(end.x, end.y, 0)])
      }
    }
  }
  return placements
}

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
