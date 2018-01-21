let jDomObjectsMatrix = require('../src/js/objects-matrix.js')
let jDomCoreMatrix = require('../src/js/core-matrix.js')

let p1 = jDomObjectsMatrix.point(1, 2, 3)
let p2 = jDomObjectsMatrix.point(2, 3, 4)

let dir = jDomCoreMatrix.getPointsLine(p1, p2)

console.log(dir)