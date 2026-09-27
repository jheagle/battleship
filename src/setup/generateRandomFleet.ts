import jDomMatrix from 'matrix-dom'
import buildShip from './buildShip'
import generateStartEnd from './generateStartEnd'
import type { Board, Ship, ShipSpec } from '../types'

/**
 * Create a series of randomly placed ships based on the provided shipLengths.
 * The optional parameter view will set the visibility of the ships.
 * @param ships
 * @param matrix
 * @param view
 */
const generateRandomFleet = (ships: ShipSpec[], matrix: Board, view: boolean = false): Ship[] =>
  ships.map(
    ship => buildShip(
      ship,
      jDomMatrix.getLinePoints(...generateStartEnd(matrix, ship.size)),
      matrix,
      view
    )
  )

export default generateRandomFleet
