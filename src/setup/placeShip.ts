import jDomMatrix from 'matrix-dom'
import buildShip from './buildShip'
import checkIfShipCell from '../utils/checkIfShipCell'
import type { Point } from 'matrix-dom/dist/point/types'
import type { Board, Ship, ShipSpec } from '../types'

/**
 * Whether a ship of this length can go from start to end: a straight horizontal or vertical line of exactly that many
 * cells, inside the board, and not touching a ship which is already there.
 * @param board
 * @param start
 * @param end
 * @param length
 */
export const isValidPlacement = (board: Board, start: Point, end: Point, length: number): boolean => {
  const rows = board.children[0].children.length
  const columns = board.children[0].children[0].children.length
  const straight = start.x === end.x || start.y === end.y
  const cellCount = Math.abs(end.x - start.x) + Math.abs(end.y - start.y) + 1
  const inside = [start, end].every(p => p.x >= 0 && p.y >= 0 && p.x < columns && p.y < rows)
  if (!straight || cellCount !== length || !inside) {
    return false
  }
  return jDomMatrix.getLinePoints(start, end).every(point => !checkIfShipCell(point, board))
}

/**
 * Place a ship from the player's chosen start and end points, if the placement is valid. Returns false if it is not.
 * @param board
 * @param shipInfo
 * @param start
 * @param end
 * @param view
 */
export const placeShip = (board: Board, shipInfo: ShipSpec, start: Point, end: Point, view: boolean = true): Ship | false =>
  isValidPlacement(board, start, end, shipInfo.size)
    ? buildShip(shipInfo, jDomMatrix.getLinePoints(start, end), board, view)
    : false
