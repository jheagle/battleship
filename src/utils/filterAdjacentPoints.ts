import type { Point } from 'matrix-dom/dist/point/types'

/**
 * Used to generate 'checkerboard' style attack by only attacking every non-edge-touching cell
 * @param pnt
 */
const filterAdjacentPoints = (pnt: Point): boolean => ((pnt.z % 2 === 0 && ((pnt.x % 2 === 0 && pnt.y % 2 === 0) || (pnt.x % 2 !== 0 && pnt.y % 2 !== 0))) || (pnt.z % 2 !== 0 && ((pnt.x % 2 !== 0 && pnt.y % 2 === 0) || (pnt.x % 2 === 0 && pnt.y % 2 !== 0))))

export default filterAdjacentPoints
