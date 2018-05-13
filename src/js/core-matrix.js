'use strict'
// Core matrix functions for working with a grid of points
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this || {}

  /**
   * Store reference to any pre-existing module of the same name
   * @type {jDomCoreMatrix|*}
   */
  const previousJDomCoreMatrix = root.jDomCoreMatrix || {}

  /**
   * A reference to all functions to be used globally / exported
   * @module jDomCoreMatrix
   */
  const jDomCoreMatrix = {}
  root.jDomCoreMatrix = jDomCoreMatrix
  
  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {jDomCoreMatrix}
   */
  jDomCoreMatrix.noConflict = () => {
    root.jDomCoreMatrix = previousJDomCoreMatrix
    return jDomCoreMatrix
  }

  /**
   * Verify availability of jDomObjectsMatrix
   * @type {*|jDomCore}
   */
  let jDomCore = root.jDomCore

  /**
   * If jDomCore remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomCore === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomCore = require('./core.js')
    } else {
      console.error('core-matrix.js requires jDomCore')
    }
  }

  /**
   * Verify availability of jDomObjectsMatrix
   * @type {*|jDomObjectsMatrix}
   */
  let jDomObjectsMatrix = root.jDomObjectsMatrix

  /**
   * If jDomCoreDom remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomObjectsMatrix === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomObjectsMatrix = require('./objects-matrix.js')
    } else {
      console.error('core-matrix.js requires jDomObjectsMatrix')
    }
  }

  /**
   * Generate point data for each item in the matrix
   * WARNING: This is a recursive function.
   * @function bindPointData
   * @param item
   * @param pnt
   * @returns {*}
   */
  jDomCoreMatrix.bindPointData = (item, pnt = jDomObjectsMatrix.point(0, 0, 0)) => jDomCore.mergeObjects(item, (item.point ? {point: jDomCore.cloneObject(pnt)} : {children: item.children.map((el, i) => jDomCoreMatrix.bindPointData(el, jDomCore.mergeObjects(pnt, {[el.axis]: i})))}))

  /**
   * Based on provided point and point direction generate next point.
   * @function nextCell
   * @param pnt
   * @param dir
   * @returns {Object.<string, number>}
   */
  jDomCoreMatrix.nextCell = (pnt, dir) => jDomObjectsMatrix.point(pnt.x + dir.x, pnt.y + dir.y, pnt.z + dir.z)

  /**
   * Based on provided point and point direction generate next point.
   * @function pointDifference
   * @param start
   * @param end
   * @returns {Object.<string, number>}
   */
  jDomCoreMatrix.pointDifference = (start, end) => jDomObjectsMatrix.point(end.x - start.x, end.y - start.y, end.z - start.z)

  /**
   * Given two points, compare the x, y, and z of each to see if they are the same
   * @function checkEqualPoints
   * @param p1
   * @param p2
   * @returns {boolean}
   */
  jDomCoreMatrix.checkEqualPoints = (p1, p2) => p1.x === p2.x && p1.y === p2.y && p1.z === p2.z

  /**
   * Check if there is a negative coordinate value within the point provided
   * @function pointHasNegative
   * @param pnt
   * @returns {boolean}
   */
  jDomCoreMatrix.pointHasNegative = pnt => !!Object.keys(jDomCore.filterObject(pnt, (attr) => attr < 0)).length

  /**
   * Return the first coordinate number with the highest absolute value.
   * @function getHighAbsoluteCoord
   * @param pnt
   * @returns {Array.<T>|*}
   */
  jDomCoreMatrix.getHighAbsoluteCoord = pnt => jDomCore.reduceObject(pnt, jDomCore.curry(jDomCore.getMaxOrMin)(!jDomCoreMatrix.pointHasNegative(pnt)), 0)

  /**
   * Having provided a coordinate number, find all corresponding axis.
   * @function getAxisOfCoord
   * @param pnt
   * @param coord
   * @returns {*}
   */
  jDomCoreMatrix.getAxisOfCoord = (pnt, coord) => Object.keys(pnt).filter((key) => pnt[key] === coord)

  /**
   * Find all axis of the highest absolute value coordinate
   * @function getHighAbsoluteCoordAxis
   * @param pnt
   * @returns {*}
   */
  jDomCoreMatrix.getHighAbsoluteCoordAxis = pnt => jDomCoreMatrix.getAxisOfCoord(pnt, jDomCoreMatrix.getHighAbsoluteCoord(pnt))

  /**
   * Retrieve a directional coordinate value based on two provided points
   * (directions consist of two zero points and a single point of 1 / -1)
   * @function pointDirection
   * @param start
   * @param end
   * @returns {*}
   */
  jDomCoreMatrix.pointDirection = (start, end) => jDomCore.mergeObjects(jDomObjectsMatrix.point(0, 0, 0), {[`${jDomCoreMatrix.getHighAbsoluteCoordAxis(jDomCoreMatrix.pointDifference(start, end))[0]}`]: jDomCoreMatrix.pointHasNegative(jDomCoreMatrix.pointDifference(start, end)) ? -1 : 1})

  /**
   * Generate a random starting point for a line with the provided length and direction.
   * @function randomStart
   * @param length
   * @param dir
   * @param lengthLimits
   * @returns {{x: number, y: number, z: number}}
   */
  jDomCoreMatrix.randomStart = (length, dir, lengthLimits = jDomObjectsMatrix.point(10, 10, 10)) => jDomObjectsMatrix.point(jDomCore.randomInteger(lengthLimits.x - ((length - 1) * dir.x)), jDomCore.randomInteger(lengthLimits.y - ((length - 1) * dir.y)), jDomCore.randomInteger(lengthLimits.z - ((length - 1) * dir.z)))

  /**
   * Given a start point, line length, and a direction, generate the end point of the line.
   * @function lineEndPoint
   * @param start
   * @param length
   * @param dir
   * @returns {Object.<string, number>}
   */
  jDomCoreMatrix.lineEndPoint = (start, length, dir) => jDomObjectsMatrix.point(start.x + dir.x * (length - 1), start.y + dir.y * (length - 1), start.z + dir.z * (length - 1))

  /**
   * Having provided two points, return an array of transition points
   * connecting 'start' and 'end'. return array includes 'start' (line[0])
   * and 'end' (line[line.length-1])
   * @function getPointsLine
   * @param start
   * @param end
   * @param line
   * @returns {Array.<*>}
   */
  jDomCoreMatrix.getPointsLine = (start, end, line = []) => jDomCoreMatrix.checkEqualPoints(start, end) ? line.concat([start]) : jDomCoreMatrix.getPointsLine(jDomCoreMatrix.nextCell(start, jDomCoreMatrix.pointDirection(start, end)), end, line.concat([start]))

  /**
   * Takes an array of arrays containing two points each. Calls getPointsLine for each array of points.
   * Returns an array of all points captured for each line segment
   * @function getPointsLines
   * @param lines
   * @returns {Array.<*>}
   */
  jDomCoreMatrix.getPointsLines = lines => lines.reduce((first, next) => first.concat(jDomCoreMatrix.getPointsLine(...next)), [])

  /**
   * Given a start and end point, test the points between with the provided function.
   * Return the points as part of true or/and false properties based on the test.
   * @function testPointsBetween
   * @param start
   * @param end
   * @param matrix
   * @param func
   * @param inclusive
   * @returns {{true: Array, false: Array}}
   */
  jDomCoreMatrix.testPointsBetween = (start, end, matrix, func, inclusive = true) => jDomCoreMatrix.getPointsLine(start, end).filter((prop, i, line) => ((i !== 0 && i !== line.length - 1) || inclusive)).reduce((newPoints, next) => jDomCore.mergeObjects(newPoints, {[`${!!func(next, matrix)}`]: [next]}), {
    true: [],
    false: []
  })

  /**
   * Retrieve all points between start and end as either true or
   * false properties based on the function used.
   * @function getInBetween
   * @param start
   * @param end
   * @param matrix
   * @param func
   * @param inclusive
   * @returns {{true: Array, false: Array}}
   */
  jDomCoreMatrix.getInBetween = (start, end, matrix, func, inclusive = true) => jDomCore.mergeObjects({
    true: [],
    false: []
  }, jDomCoreMatrix.testPointsBetween(start, end, matrix, func, inclusive))

  /**
   * Given two points, check the cells between using specified function.
   * When inclusive is set to true the provided start and end points will also be tested
   * @function checkInBetween
   * @param start
   * @param end
   * @param matrix
   * @param func
   * @param inclusive
   * @returns {boolean}
   */
  jDomCoreMatrix.checkInBetween = (start, end, matrix, func, inclusive = true) => (inclusive && (func(start, matrix) || func(end, matrix))) ? true : !!jDomCoreMatrix.testPointsBetween(start, end, matrix, func).true.length

  /**
   * Return point-like object with all of the axis lengths.
   * @function getAxisLengths
   * @param matrix
   */
  jDomCoreMatrix.getAxisLengths = (matrix) => jDomObjectsMatrix.point(matrix.children[0].children[0].children.length, matrix.children[0].children.length, matrix.children.length)

  /**
   * Get random direction point
   * @function randDirection
   * @param useCoords
   */
  jDomCoreMatrix.randDirection = (useCoords = []) => useCoords.length ? useCoords[jDomCore.randomInteger(useCoords.length)] : jDomObjectsMatrix.point(0, 0, 0)

  /**
   * Test if the provided point exists in the matrix.
   * @function checkValidPoint
   * @param pnt
   * @param matrix
   */
  jDomCoreMatrix.checkValidPoint = (pnt, matrix) => !!matrix.children[pnt.z] && !!matrix.children[pnt.z].children[pnt.y] && !!matrix.children[pnt.z].children[pnt.y].children[pnt.x] && !!matrix.children[pnt.z].children[pnt.y].children[pnt.x].point

  /**
   * Test if the provided point exists in the matrix.
   * @function getDOMItemFromPoint
   * @param pnt
   * @param matrix
   */
  jDomCoreMatrix.getDOMItemFromPoint = (pnt, matrix) => jDomCoreMatrix.checkValidPoint(pnt, matrix) ? matrix.children[pnt.z].children[pnt.y].children[pnt.x] : false

  /**
   * Return an array of all the points in the matrix
   * @function getAllPoints
   * @param matrix
   * @param allPoints
   * @returns {Array}
   */
  jDomCoreMatrix.getAllPoints = (matrix, allPoints = []) => (matrix.point) ? allPoints.concat([matrix.point]) : matrix.children.reduce((allPoints, child) => allPoints.concat(jDomCoreMatrix.getAllPoints(child, [])), [])

  /**
   * Return all valid points surrounding a provided point
   * @function adjacentPoints
   * @param pnt
   * @param matrix
   * @returns {Array}
   */
  jDomCoreMatrix.adjacentPoints = (pnt, matrix) => jDomCoreMatrix.getPointsLines([[jDomObjectsMatrix.point(-1, 1, 1), jDomObjectsMatrix.point(1, -1, -1)], [jDomObjectsMatrix.point(1, 1, 1), jDomObjectsMatrix.point(-1, 1, -1)], [jDomObjectsMatrix.point(-1, -1, 1), jDomObjectsMatrix.point(1, -1, 1)], [jDomObjectsMatrix.point(1, 0, 0), jDomObjectsMatrix.point(1, 1, -1)], [jDomObjectsMatrix.point(-1, 1, 0), jDomObjectsMatrix.point(1, 1, 0)]]).concat([jDomObjectsMatrix.point(0, 0, 1), jDomObjectsMatrix.point(1, 0, 0), jDomObjectsMatrix.point(-1, 0, -1), jDomObjectsMatrix.point(0, 0, -1)])
    .map(p => jDomCoreMatrix.nextCell(pnt, p)).filter(p => jDomCoreMatrix.checkValidPoint(jDomCoreMatrix.nextCell(pnt, p), matrix))

  /**
   * Return all points which touch on edges (not diagonal)
   * @function adjacentEdgePoints
   * @param pnt
   * @param matrix
   */
  jDomCoreMatrix.adjacentEdgePoints = (pnt, matrix) => [jDomObjectsMatrix.point(-1, 0, 0), jDomObjectsMatrix.point(1, 0, 0), jDomObjectsMatrix.point(0, -1, 0), jDomObjectsMatrix.point(0, 1, 0), jDomObjectsMatrix.point(0, 0, -1), jDomObjectsMatrix.point(0, 0, 1)].map(p => jDomCoreMatrix.nextCell(pnt, p)).filter(p => jDomCoreMatrix.checkValidPoint(p, matrix))

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = jDomCoreMatrix
    }
    exports = Object.assign(exports, jDomCoreMatrix)
  }
}).call(this || window || base || {}) // Use the external context to assign this, which will be Window if rendered via browser
