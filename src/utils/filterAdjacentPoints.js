/**
 * Used to generate 'checkerboard' style attack by only attacking every non-edge-touching cell
 * @function filterAdjacentPoints
 * @param pnt
 * @returns {boolean}
 */
const filterAdjacentPoints = pnt => ((pnt.z % 2 === 0 && ((pnt.x % 2 === 0 && pnt.y % 2 === 0) || (pnt.x % 2 !== 0 && pnt.y % 2 !== 0))) || (pnt.z % 2 !== 0 && ((pnt.x % 2 !== 0 && pnt.y % 2 === 0) || (pnt.x % 2 === 0 && pnt.y % 2 !== 0))))

export default filterAdjacentPoints
