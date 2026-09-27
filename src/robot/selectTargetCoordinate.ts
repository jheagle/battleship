import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'
import checkIfHitCell from '../utils/checkIfHitCell'
import displayTargets from './displayTargets'
import filterAdjacentPoints from '../utils/filterAdjacentPoints'
import getALowStatusItem from '../utils/getALowStatusItem'
import getAdjEdgeNonHitCells from '../utils/getAdjEdgeNonHitCells'
import getAllNonHitCells from '../utils/getAllNonHitCells'
import getBrokenItems from '../utils/getBrokenItems'
import numDamagedParts from '../utils/numDamagedParts'

/**
 * Choose which coordinate to attack.
 * @param victim
 * @returns {*}
 */
const selectTargetCoordinate = (victim) => {
  // Try to get broken ships
  const brokenShips = getBrokenItems(victim.shipFleet)
  let availTargets = []
  if (brokenShips.length) {
    // If there are broken ships, target those first, select the most broken ships (more than one damaged part)
    const moreBrokenShips = brokenShips.filter(ship => numDamagedParts(ship.parts.length, ship.status) > 1)
    // Of the broken ships, attack the lowest status ship
    const targetShip = getALowStatusItem(moreBrokenShips.length ? moreBrokenShips : brokenShips)
    // Get all of the parts which have been hit
    const hitParts = targetShip.parts.filter(part => checkIfHitCell(part.point, victim.board))
    if (moreBrokenShips.length) {
      // If there are more broken ships, attack the parts between hit points first.
      for (let i = 0; i < hitParts.length; ++i) {
        const targetPoints = matrixDom.testPointsBetween(hitParts[0].point, hitParts[i].point, victim.board, checkIfHitCell, false)
        if (targetPoints.false.length) {
          displayTargets(targetPoints.false, targetPoints.false[0], victim)
          return matrixDom.getDomItemFromPoint(targetPoints.false[0], victim.board)
        }
      }
      // If there are no points between, attack the outer points first.
      const pntDiff = matrixDom.pointDifference(hitParts[0].point, hitParts[1].point)
      const dirPnts = (pntDiff.x > 0 ? [matrixDom.point(-1, 0, 0), matrixDom.point(1, 0, 0)] : [matrixDom.point(0, -1, 0), matrixDom.point(0, 1, 0)]).map((p, i) => matrixDom.nextCell(hitParts[(hitParts.length - 1) * i].point, p)).filter(p => matrixDom.checkValidPoint(p, victim.board)).filter(a => !checkIfHitCell(a, victim.board))
      // Check outer points which are valid and not hit.
      const target = dirPnts.reduce((a, b) => checkIfHitCell(a, victim.board) ? b : a)
      if (target) {
        displayTargets(dirPnts, target, victim)
        return matrixDom.getDomItemFromPoint(target, victim.board)
      }
    }
    // If there is only one hit part, then set that as the lastTarget for detecting adjacent parts.
    availTargets = getAdjEdgeNonHitCells(hitParts[0].point, victim.board)
  }
  const finalTargets = availTargets.length ? availTargets : getAllNonHitCells(victim.board).filter(t => filterAdjacentPoints(t))
  const target = finalTargets[siFunciona.randomInteger(finalTargets.length)]
  displayTargets(finalTargets, target, victim)

  // If there are available targets then hit one at random
  return matrixDom.getDomItemFromPoint(target, victim.board)
}

export default selectTargetCoordinate
