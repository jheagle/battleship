/**
 * Return the isHit tile boolean at the specified point.
 * @function checkIfHitCell
 * @param pnt
 * @param matrix
 * @returns {boolean}
 */
const checkIfHitCell = (pnt, matrix) => matrix.children[pnt.z].children[pnt.y].children[pnt.x].isHit

export default checkIfHitCell
