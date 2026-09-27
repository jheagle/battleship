import setShip from '../cells/setShip'
import ship from '../components/pieces/ship'
import type { Point } from 'matrix-dom/dist/point/types'
import type { Board, Ship, ShipSpec } from '../types'

/**
 * Generate a ship with the provided line of points.
 * The visibility of the ship on the board is determined by the view parameter.
 * @param shipInfo
 * @param line
 * @param matrix
 * @param view
 */
const buildShip = (shipInfo: ShipSpec, line: Point[], matrix: Board, view: boolean = false): Ship =>
  Object.assign(
    ship(shipInfo.name),
    { parts: line.map(p => setShip(matrix, p, view)) }
  )

export default buildShip
