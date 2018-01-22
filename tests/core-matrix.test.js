const jDomObjectsMatrix = require('../src/js/objects-matrix.js')
const jDomCoreMatrix = require('../src/js/core-matrix.js')

const p1 = jDomObjectsMatrix.point(1, 2, 3)
const p2 = jDomObjectsMatrix.point(2, 3, 4)

test('returns four points', () => {
  expect(jDomCoreMatrix.getPointsLine(p1, p2).length).toBe(4)
})