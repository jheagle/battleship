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
   * All methods exported from this module are encapsulated within jDomCoreMatrix.
   * @typedef {Object} jDomCoreMatrix
   * @property {jDomCoreMatrix} jDomCoreMatrix
   * @property {function} adjacentEdgePoints
   * @property {function} adjacentPoints
   * @property {function} bindPointData
   * @property {function} checkEqualPoints
   * @property {function} checkInBetween
   * @property {function} checkValidPoint
   * @property {function} getAllPoints
   * @property {function} getAxisLengths
   * @property {function} getAxisOfCoord
   * @property {function} getDOMItemFromPoint
   * @property {function} getHighAbsoluteCoord
   * @property {function} getHighAbsoluteCoordAxis
   * @property {function} getInBetween
   * @property {function} getPointsLine
   * @property {function} getPointsLines
   * @property {function} lineEndPoint
   * @property {function} nextCell
   * @property {function} noConflict
   * @property {function} pointDifference
   * @property {function} pointDirection
   * @property {function} pointHasNegative
   * @property {function} randDirection
   * @property {function} randomStart
   * @property {function} testPointsBetween
   */

  /**
   * A reference to all functions to be used globally / exported
   * @type {jDomCoreMatrix}
   */
  const exportFunctions = {
    noConflict: () => {
      root.jDomCoreMatrix = previousJDomCoreMatrix
      return exportFunctions
    }
  }
  root.jDomCoreMatrix = exportFunctions

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
   * @param item
   * @param pnt
   * @returns {*}
   */
  const bindPointData = (item, pnt = jDomObjectsMatrix.point(0, 0, 0)) => jDomCore.mergeObjects(item, (item.point ? {point: jDomCore.cloneObject(pnt)} : {children: item.children.map((el, i) => bindPointData(el, jDomCore.mergeObjects(pnt, {[el.axis]: i})))}))
  exportFunctions.bindPointData = bindPointData

  /**
   * Based on provided point and point direction generate next point.
   * @param pnt
   * @param dir
   * @returns {Object.<string, number>}
   */
  const nextCell = (pnt, dir) => jDomObjectsMatrix.point(pnt.x + dir.x, pnt.y + dir.y, pnt.z + dir.z)
  exportFunctions.nextCell = nextCell

  /**
   * Based on provided point and point direction generate next point.
   * @param start
   * @param end
   * @returns {Object.<string, number>}
   */
  const pointDifference = (start, end) => jDomObjectsMatrix.point(end.x - start.x, end.y - start.y, end.z - start.z)
  exportFunctions.pointDifference = pointDifference

  /**
   * Given two points, compare the x, y, and z of each to see if they are the same
   * @param p1
   * @param p2
   * @returns {boolean}
   */
  const checkEqualPoints = (p1, p2) => p1.x === p2.x && p1.y === p2.y && p1.z === p2.z
  exportFunctions.checkEqualPoints = checkEqualPoints

  /**
   * Check if there is a negative coordinate value within the point provided
   * @param pnt
   * @returns {boolean}
   */
  const pointHasNegative = pnt => !!Object.keys(jDomCore.filterObject(pnt, (attr) => attr < 0)).length
  exportFunctions.pointHasNegative = pointHasNegative

  /**
   * Return the first coordinate number with the highest absolute value.
   * @param pnt
   * @returns {Array.<T>|*}
   */
  const getHighAbsoluteCoord = pnt => jDomCore.reduceObject(pnt, jDomCore.curry(jDomCore.getMaxOrMin)(!pointHasNegative(pnt)), 0)
  exportFunctions.getHighAbsoluteCoord = getHighAbsoluteCoord

  /**
   * Having provided a coordinate number, find all corresponding axis.
   * @param pnt
   * @param coord
   * @returns {*}
   */
  const getAxisOfCoord = (pnt, coord) => Object.keys(pnt).filter((key) => pnt[key] === coord)
  exportFunctions.getAxisOfCoord = getAxisOfCoord

  /**
   * Find all axis of the highest absolute value coordinate
   * @param pnt
   * @returns {*}
   */
  const getHighAbsoluteCoordAxis = pnt => getAxisOfCoord(pnt, getHighAbsoluteCoord(pnt))
  exportFunctions.getHighAbsoluteCoordAxis = getHighAbsoluteCoordAxis

  /**
   * Retrieve a directional coordinate value based on two provided points
   * (directions consist of two zero points and a single point of 1 / -1)
   * @param start
   * @param end
   * @returns {*}
   */
  const pointDirection = (start, end) => jDomCore.mergeObjects(jDomObjectsMatrix.point(0, 0, 0), {[`${getHighAbsoluteCoordAxis(pointDifference(start, end))[0]}`]: pointHasNegative(pointDifference(start, end)) ? -1 : 1})
  exportFunctions.pointDirection = pointDirection

  /**
   * Generate a random starting point for a line with the provided length and direction.
   * @param length
   * @param dir
   * @param lengthLimits
   * @returns {{x: number, y: number, z: number}}
   */
  const randomStart = (length, dir, lengthLimits = jDomObjectsMatrix.point(10, 10, 10)) => jDomObjectsMatrix.point(jDomCore.randomInteger(lengthLimits.x - ((length - 1) * dir.x)), jDomCore.randomInteger(lengthLimits.y - ((length - 1) * dir.y)), jDomCore.randomInteger(lengthLimits.z - ((length - 1) * dir.z)))
  exportFunctions.randomStart = randomStart

  /**
   * Given a start point, line length, and a direction, generate the end point of the line.
   * @param start
   * @param length
   * @param dir
   * @returns {Object.<string, number>}
   */
  const lineEndPoint = (start, length, dir) => jDomObjectsMatrix.point(start.x + dir.x * (length - 1), start.y + dir.y * (length - 1), start.z + dir.z * (length - 1))
  exportFunctions.lineEndPoint = lineEndPoint

  /**
   * Having provided two points, return an array of transition points
   * connecting 'start' and 'end'. return array includes 'start' (line[0])
   * and 'end' (line[line.length-1])
   * @param start
   * @param end
   * @param line
   * @returns {Array.<*>}
   */
  const getPointsLine = (start, end, line = []) => checkEqualPoints(start, end) ? line.concat([start]) : getPointsLine(nextCell(start, pointDirection(start, end)), end, line.concat([start]))
  exportFunctions.getPointsLine = getPointsLine

  /**
   * Takes an array of arrays containing two points each. Calls getPointsLine for each array of points.
   * Returns an array of all points captured for each line segment
   * @param lines
   * @returns {Array.<*>}
   */
  const getPointsLines = lines => lines.reduce((first, next) => first.concat(getPointsLine(...next)), [])
  exportFunctions.getPointsLines = getPointsLines

  /**
   * Given a start and end point, test the points between with the provided function.
   * Return the points as part of true or/and false properties based on the test.
   * @param start
   * @param end
   * @param matrix
   * @param func
   * @param inclusive
   * @returns {{true: Array, false: Array}}
   */
  const testPointsBetween = (start, end, matrix, func, inclusive = true) => getPointsLine(start, end).filter((prop, i, line) => ((i !== 0 && i !== line.length - 1) || inclusive)).reduce((newPoints, next) => jDomCore.mergeObjects(newPoints, {[`${!!func(next, matrix)}`]: [next]}), {
    true: [],
    false: []
  })
  exportFunctions.testPointsBetween = testPointsBetween

  /**
   * Retrieve all points between start and end as either true or
   * false properties based on the function used.
   * @param start
   * @param end
   * @param matrix
   * @param func
   * @param inclusive
   * @returns {{true: Array, false: Array}}
   */
  const getInBetween = (start, end, matrix, func, inclusive = true) => jDomCore.mergeObjects({
    true: [],
    false: []
  }, testPointsBetween(start, end, matrix, func, inclusive))
  exportFunctions.getInBetween = getInBetween

  /**
   * Given two points, check the cells between using specified function.
   * When inclusive is set to true the provided start and end points will also be tested
   * @param start
   * @param end
   * @param matrix
   * @param func
   * @param inclusive
   * @returns {boolean}
   */
  const checkInBetween = (start, end, matrix, func, inclusive = true) => (inclusive && (func(start, matrix) || func(end, matrix))) ? true : !!testPointsBetween(start, end, matrix, func).true.length
  exportFunctions.checkInBetween = checkInBetween

  /**
   * Return point-like object with all of the axis lengths.
   * @param matrix
   */
  const getAxisLengths = (matrix) => jDomObjectsMatrix.point(matrix.children[0].children[0].children.length, matrix.children[0].children.length, matrix.children.length)
  exportFunctions.getAxisLengths = getAxisLengths

  /**
   * Get random direction point
   * @param useCoords
   */
  const randDirection = (useCoords = []) => useCoords.length ? useCoords[jDomCore.randomInteger(useCoords.length)] : jDomObjectsMatrix.point(0, 0, 0)
  exportFunctions.randDirection = randDirection

  /**
   * Test if the provided point exists in the matrix.
   * @param pnt
   * @param matrix
   */
  const checkValidPoint = (pnt, matrix) => !!matrix.children[pnt.z] && !!matrix.children[pnt.z].children[pnt.y] && !!matrix.children[pnt.z].children[pnt.y].children[pnt.x] && !!matrix.children[pnt.z].children[pnt.y].children[pnt.x].point
  exportFunctions.checkValidPoint = checkValidPoint

  /**
   * Test if the provided point exists in the matrix.
   * @param pnt
   * @param matrix
   */
  const getDOMItemFromPoint = (pnt, matrix) => checkValidPoint(pnt, matrix) ? matrix.children[pnt.z].children[pnt.y].children[pnt.x] : false
  exportFunctions.getDOMItemFromPoint = getDOMItemFromPoint

  /**
   * Return an array of all the points in the matrix
   * @param matrix
   * @param allPoints
   * @returns {Array}
   */
  const getAllPoints = (matrix, allPoints = []) => (matrix.point) ? allPoints.concat([matrix.point]) : matrix.children.reduce((allPoints, child) => allPoints.concat(getAllPoints(child, [])), [])
  exportFunctions.getAllPoints = getAllPoints

  /**
   * Return all valid points surrounding a provided point
   * @param pnt
   * @param matrix
   * @returns {Array}
   */
  const adjacentPoints = (pnt, matrix) => getPointsLines([[jDomObjectsMatrix.point(-1, 1, 1), jDomObjectsMatrix.point(1, -1, -1)], [jDomObjectsMatrix.point(1, 1, 1), jDomObjectsMatrix.point(-1, 1, -1)], [jDomObjectsMatrix.point(-1, -1, 1), jDomObjectsMatrix.point(1, -1, 1)], [jDomObjectsMatrix.point(1, 0, 0), jDomObjectsMatrix.point(1, 1, -1)], [jDomObjectsMatrix.point(-1, 1, 0), jDomObjectsMatrix.point(1, 1, 0)]]).concat([jDomObjectsMatrix.point(0, 0, 1), jDomObjectsMatrix.point(1, 0, 0), jDomObjectsMatrix.point(-1, 0, -1), jDomObjectsMatrix.point(0, 0, -1)])
    .map(p => nextCell(pnt, p)).filter(p => checkValidPoint(nextCell(pnt, p), matrix))
  exportFunctions.adjacentPoints = adjacentPoints

  /**
   * Return all points which touch on edges (not diagonal)
   * @param pnt
   * @param matrix
   */
  const adjacentEdgePoints = (pnt, matrix) => [jDomObjectsMatrix.point(-1, 0, 0), jDomObjectsMatrix.point(1, 0, 0), jDomObjectsMatrix.point(0, -1, 0), jDomObjectsMatrix.point(0, 1, 0), jDomObjectsMatrix.point(0, 0, -1), jDomObjectsMatrix.point(0, 0, 1)].map(p => nextCell(pnt, p)).filter(p => checkValidPoint(p, matrix))
  exportFunctions.adjacentEdgePoints = adjacentEdgePoints

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = exportFunctions
    }
    exports = Object.assign(exports, exportFunctions)
  }
}).call(this || window || base || {}) // Use the external context to assign this, which will be Window if rendered via browser
