import matrixDom from 'matrix-dom'
import checkIfHitCell from '../utils/checkIfHitCell'
import getALowStatusItem from '../utils/getALowStatusItem'
import getAdjEdgeNonHitCells from '../utils/getAdjEdgeNonHitCells'
import getBrokenItems from '../utils/getBrokenItems'
import numDamagedParts from '../utils/numDamagedParts'
import type { Point } from 'matrix-dom/dist/point/types'
import type { Player } from '../types'

/**
 * If there are existing broken ships, return the point(s) to target next: the cells adjacent to the hit parts, or,
 * once a ship is damaged in more than one place, a single decisive point (the gap between two hits, or the point
 * just past one end of a run of hits). Returns an empty array when there is nothing broken to follow up on.
 * @param victim
 */
const targetBrokenShips = (victim: Player): Point[] => {
  // Try to get broken ships
  const brokenShips = getBrokenItems(victim.shipFleet)
  if (!brokenShips.length) {
    return []
  }
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
        // A single decisive point: the caller picks it deterministically since there is only one candidate here.
        return [targetPoints.false[0]]
      }
    }
    // If there are no points between, attack the outer points first.
    const pntDiff = matrixDom.pointDifference(hitParts[0].point, hitParts[1].point)
    const dirPnts = (pntDiff.x > 0 ? [matrixDom.point(-1, 0, 0), matrixDom.point(1, 0, 0)] : [matrixDom.point(0, -1, 0), matrixDom.point(0, 1, 0)]).map((p, i) => matrixDom.nextCell(hitParts[(hitParts.length - 1) * i].point, p)).filter(p => matrixDom.checkValidPoint(p, victim.board)).filter(a => !checkIfHitCell(a, victim.board))
    // Check outer points which are valid and not hit.
    const target = dirPnts.reduce((a, b) => checkIfHitCell(a, victim.board) ? b : a)
    if (target) {
      return [target]
    }
  }
  // If there is only one hit part, then set that as the lastTarget for detecting adjacent parts.
  return getAdjEdgeNonHitCells(hitParts[0].point, victim.board)
}

export default targetBrokenShips
