import setShip from '../cells/setShip'
import ship from '../components/pieces/ship'

/**
 * Generate a ship with the provided line of points.
 * The visibility of the ship on the board is determined by the view parameter.
 * @param shipInfo
 * @param line
 * @param matrix
 * @param view
 * @returns {{name: string, status: number, parts: Array}}
 */
const buildShip = (shipInfo, line, matrix, view = false) =>
  Object.assign(
    ship(shipInfo.name),
    { parts: line.map(p => setShip(matrix, p, view)) }
  )

export default buildShip
