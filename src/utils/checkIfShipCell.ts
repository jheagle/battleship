/**
 * Return the hasShip tile boolean at the specified point.
 * @function checkIfShipCell
 * @param pnt
 * @param matrix
 * @returns {boolean}
 */
const checkIfShipCell = (pnt, matrix) => matrix.children[pnt.z]?.children[pnt.y]?.children[pnt.x]?.hasShip ?? false

export default checkIfShipCell
