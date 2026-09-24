import setHiddenShip from './setHiddenShip'
import setViewShip from './setViewShip'

/**
 * Set a specified point to be part of a ship
 * @function setShip
 * @param matrix
 * @param point
 * @param view
 */
const setShip = (matrix, point, view) => view ? setViewShip(matrix, point.x, point.y, point.z) : setHiddenShip(matrix, point.x, point.y, point.z)

export default setShip
