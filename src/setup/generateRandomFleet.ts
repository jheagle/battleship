import jDomMatrix from 'matrix-dom'
import buildShip from './buildShip'
import generateStartEnd from './generateStartEnd'

/**
 * Create a series of randomly placed ships based on the provided shipLengths.
 * The optional parameter view will set the visibility of the ships.
 * @param {Array} ships
 * @param {Object} matrix
 * @param {boolean} [view=false]
 * @returns {Array}
 */
const generateRandomFleet = (ships, matrix, view = false) =>
  ships.map(
    ship => buildShip(
      ship,
      jDomMatrix.getLinePoints(...generateStartEnd(matrix, ship.size)),
      matrix,
      view
    )
  )

export default generateRandomFleet
