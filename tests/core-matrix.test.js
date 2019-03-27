const jDomObjectsMatrix = require('../src/js/jDom/matrix/objects.js')
const jDomCoreMatrix = require('../src/js/jDom/matrix/core.js')

const p1 = jDomObjectsMatrix.point(1, 2, 3)
const p2 = jDomObjectsMatrix.point(2, 3, 4)

// adjacentEdgePoints
// adjacentPoints
// bindPointData
// areEqualPoints
// checkInBetween
// checkValidPoint
// getAllPoints
// getAxisLengths
// getAxisOfCoord
// getDOMItemFromPoint
// getHighAbsoluteCoord
// getHighAbsoluteCoordAxis
// getInBetween
// getPointsLine
it('returns four points', () => {
  expect(jDomCoreMatrix.getPointsLine(p1, p2).length).toBe(4)
})

// getPointsLines
// lineEndPoint
// nextCell
// noConflict
// pointDifference
// pointsToDirection
// pointHasNegative
// randDirection
// randomStart
// testPointsBetween