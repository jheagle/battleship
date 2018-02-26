const jDomObjectsMatrix = require('../src/js/objects-matrix.js')
const jDomCoreMatrix = require('../src/js/core-matrix.js')

const p1 = jDomObjectsMatrix.point(1, 2, 3)
const p2 = jDomObjectsMatrix.point(2, 3, 4)

// adjacentEdgePoints
// adjacentPoints
// bindPointData
// checkEqualPoints
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
// pointDirection
// pointHasNegative
// randDirection
// randomStart
// testPointsBetween