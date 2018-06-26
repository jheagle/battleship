'use strict'
// Core matrix functions for working with a grid of points
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this || {}

  /**
   * Store reference to any pre-existing module of the same name
   * @type {jDomMatrixCore|*}
   */
  const previousJDomMatrixCore = root.jDomMatrixCore || {}

  /**
   * A reference to all functions to be used globally / exported
   * @typedef {Object} jDomMatrixCore
   * @module jDom/matrix/core
   */
  const jDomMatrixCore = {}
  root.jDomMatrixCore = jDomMatrixCore

  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {jDomMatrixCore}
   */
  jDomMatrixCore.noConflict = () => {
    root.jDomMatrixCore = previousJDomMatrixCore
    return jDomMatrixCore
  }

  /**
   * Verify availability of jDomMatrixObjects
   * @typedef {*|module:jDom/core/core} jDomCore
   */
  let jDomCore = root.jDomCore

  /**
   * If jDomCore remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomCore === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomCore = require('../core/core.js')
    } else {
      console.error('core.js requires jDomCore')
    }
  }

  /**
   * Verify availability of jDomMatrixObjects
   * @typedef {*|module:jDom/matrix/objects} jDomMatrixObjects
   */
  let jDomMatrixObjects = root.jDomMatrixObjects

  /**
   * If jDomCoreDom remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomMatrixObjects === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomMatrixObjects = require('./objects.js')
    } else {
      console.error('core.js requires jDomMatrixObjects')
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
  jDomMatrixCore.bindPointData = (item, pnt = jDomMatrixObjects.point(0, 0, 0)) => jDomCore.mergeObjects(item, (item.point ? {point: jDomCore.cloneObject(pnt)} : {children: item.children.map((el, i) => jDomMatrixCore.bindPointData(el, jDomCore.mergeObjects(pnt, {[el.axis]: i})))}))

  /**
   * Based on provided point and point direction generate next point.
   * @function nextCell
   * @param pnt
   * @param dir
   * @returns {Object.<string, number>}
   */
  jDomMatrixCore.nextCell = (pnt, dir) => jDomMatrixObjects.point(pnt.x + dir.x, pnt.y + dir.y, pnt.z + dir.z)

  /**
   * Based on provided point and point direction generate next point.
   * @function pointDifference
   * @param start
   * @param end
   * @returns {Object.<string, number>}
   */
  jDomMatrixCore.pointDifference = (start, end) => jDomMatrixObjects.point(end.x - start.x, end.y - start.y, end.z - start.z)

  /**
   * Given two points, compare the x, y, and z of each to see if they are the same
   * @function checkEqualPoints
   * @param p1
   * @param p2
   * @returns {boolean}
   */
  jDomMatrixCore.checkEqualPoints = (p1, p2) => p1.x === p2.x && p1.y === p2.y && p1.z === p2.z

  /**
   * Check if there is a negative coordinate value within the point provided
   * @function pointHasNegative
   * @param pnt
   * @returns {boolean}
   */
  jDomMatrixCore.pointHasNegative = pnt => !!Object.keys(jDomCore.filterObject(pnt, (attr) => attr < 0)).length

  /**
   * Return the first coordinate number with the highest absolute value.
   * @function getHighAbsoluteCoord
   * @param pnt
   * @returns {Array.<T>|*}
   */
  jDomMatrixCore.getHighAbsoluteCoord = pnt => jDomCore.reduceObject(pnt, jDomCore.curry(jDomCore.getMaxOrMin)(!jDomMatrixCore.pointHasNegative(pnt)), 0)

  /**
   * Having provided a coordinate number, find all corresponding axis.
   * @function getAxisOfCoord
   * @param pnt
   * @param coord
   * @returns {*}
   */
  jDomMatrixCore.getAxisOfCoord = (pnt, coord) => Object.keys(pnt).filter((key) => pnt[key] === coord)

  /**
   * Find all axis of the highest absolute value coordinate
   * @function getHighAbsoluteCoordAxis
   * @param pnt
   * @returns {*}
   */
  jDomMatrixCore.getHighAbsoluteCoordAxis = pnt => jDomMatrixCore.getAxisOfCoord(pnt, jDomMatrixCore.getHighAbsoluteCoord(pnt))

  /**
   * Retrieve a directional coordinate value based on two provided points
   * (directions consist of two zero points and a single point of 1 / -1)
   * @function pointDirection
   * @param start
   * @param end
   * @returns {*}
   */
  jDomMatrixCore.pointDirection = (start, end) => jDomCore.mergeObjects(jDomMatrixObjects.point(0, 0, 0), {[`${jDomMatrixCore.getHighAbsoluteCoordAxis(jDomMatrixCore.pointDifference(start, end))[0]}`]: jDomMatrixCore.pointHasNegative(jDomMatrixCore.pointDifference(start, end)) ? -1 : 1})

  /**
   * Generate a random starting point for a line with the provided length and direction.
   * @function randomStart
   * @param length
   * @param dir
   * @param lengthLimits
   * @returns {{x: number, y: number, z: number}}
   */
  jDomMatrixCore.randomStart = (length, dir, lengthLimits = jDomMatrixObjects.point(10, 10, 10)) => jDomMatrixObjects.point(jDomCore.randomInteger(lengthLimits.x - ((length - 1) * dir.x)), jDomCore.randomInteger(lengthLimits.y - ((length - 1) * dir.y)), jDomCore.randomInteger(lengthLimits.z - ((length - 1) * dir.z)))

  /**
   * Given a start point, line length, and a direction, generate the end point of the line.
   * @function lineEndPoint
   * @param start
   * @param length
   * @param dir
   * @returns {Object.<string, number>}
   */
  jDomMatrixCore.lineEndPoint = (start, length, dir) => jDomMatrixObjects.point(start.x + dir.x * (length - 1), start.y + dir.y * (length - 1), start.z + dir.z * (length - 1))

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
  jDomMatrixCore.getPointsLine = (start, end, line = []) => jDomMatrixCore.checkEqualPoints(start, end) ? line.concat([start]) : jDomMatrixCore.getPointsLine(jDomMatrixCore.nextCell(start, jDomMatrixCore.pointDirection(start, end)), end, line.concat([start]))

  /**
   * Takes an array of arrays containing two points each. Calls getPointsLine for each array of points.
   * Returns an array of all points captured for each line segment
   * @function getPointsLines
   * @param lines
   * @returns {Array.<*>}
   */
  jDomMatrixCore.getPointsLines = lines => lines.reduce((first, next) => first.concat(jDomMatrixCore.getPointsLine(...next)), [])

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
  jDomMatrixCore.testPointsBetween = (start, end, matrix, func, inclusive = true) => jDomMatrixCore.getPointsLine(start, end).filter((prop, i, line) => ((i !== 0 && i !== line.length - 1) || inclusive)).reduce((newPoints, next) => jDomCore.mergeObjects(newPoints, {[`${!!func(next, matrix)}`]: [next]}), {
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
  jDomMatrixCore.getInBetween = (start, end, matrix, func, inclusive = true) => jDomCore.mergeObjects({
    true: [],
    false: []
  }, jDomMatrixCore.testPointsBetween(start, end, matrix, func, inclusive))

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
  jDomMatrixCore.checkInBetween = (start, end, matrix, func, inclusive = true) => (inclusive && (func(start, matrix) || func(end, matrix))) ? true : !!jDomMatrixCore.testPointsBetween(start, end, matrix, func).true.length

  /**
   * Return point-like object with all of the axis lengths.
   * @function getAxisLengths
   * @param matrix
   */
  jDomMatrixCore.getAxisLengths = (matrix) => jDomMatrixObjects.point(matrix.children[0].children[0].children.length, matrix.children[0].children.length, matrix.children.length)

  /**
   * Get random direction point
   * @function randDirection
   * @param useCoords
   */
  jDomMatrixCore.randDirection = (useCoords = []) => useCoords.length ? useCoords[jDomCore.randomInteger(useCoords.length)] : jDomMatrixObjects.point(0, 0, 0)

  /**
   * Test if the provided point exists in the matrix.
   * @function checkValidPoint
   * @param pnt
   * @param matrix
   */
  jDomMatrixCore.checkValidPoint = (pnt, matrix) => !!matrix.children[pnt.z] && !!matrix.children[pnt.z].children[pnt.y] && !!matrix.children[pnt.z].children[pnt.y].children[pnt.x] && !!matrix.children[pnt.z].children[pnt.y].children[pnt.x].point

  /**
   * Retrieve the DOMItem associated with the provided point
   * @function getDOMItemFromPoint
   * @param pnt
   * @param matrix
   */
  jDomMatrixCore.getDOMItemFromPoint = (pnt, matrix) => jDomMatrixCore.checkValidPoint(pnt, matrix) ? matrix.children[pnt.z].children[pnt.y].children[pnt.x] : false

  /**
   * Return an array of all the points in the matrix
   * @function getAllPoints
   * @param matrix
   * @param allPoints
   * @returns {Array}
   */
  jDomMatrixCore.getAllPoints = (matrix, allPoints = []) => (matrix.point) ? allPoints.concat([matrix.point]) : matrix.children.reduce((allPoints, child) => allPoints.concat(jDomMatrixCore.getAllPoints(child, [])), [])

  /**
   * Return all valid points surrounding a provided point
   * @function adjacentPoints
   * @param pnt
   * @param matrix
   * @returns {Array}
   */
  jDomMatrixCore.adjacentPoints = (pnt, matrix) => jDomMatrixCore.getPointsLines([[jDomMatrixObjects.point(-1, 1, 1), jDomMatrixObjects.point(1, -1, -1)], [jDomMatrixObjects.point(1, 1, 1), jDomMatrixObjects.point(-1, 1, -1)], [jDomMatrixObjects.point(-1, -1, 1), jDomMatrixObjects.point(1, -1, 1)], [jDomMatrixObjects.point(1, 0, 0), jDomMatrixObjects.point(1, 1, -1)], [jDomMatrixObjects.point(-1, 1, 0), jDomMatrixObjects.point(1, 1, 0)]]).concat([jDomMatrixObjects.point(0, 0, 1), jDomMatrixObjects.point(1, 0, 0), jDomMatrixObjects.point(-1, 0, -1), jDomMatrixObjects.point(0, 0, -1)])
    .map(p => jDomMatrixCore.nextCell(pnt, p)).filter(p => jDomMatrixCore.checkValidPoint(jDomMatrixCore.nextCell(pnt, p), matrix))

  /**
   * Return all points which touch on edges (not diagonal)
   * @function adjacentEdgePoints
   * @param pnt
   * @param matrix
   */
  jDomMatrixCore.adjacentEdgePoints = (pnt, matrix) => [jDomMatrixObjects.point(-1, 0, 0), jDomMatrixObjects.point(1, 0, 0), jDomMatrixObjects.point(0, -1, 0), jDomMatrixObjects.point(0, 1, 0), jDomMatrixObjects.point(0, 0, -1), jDomMatrixObjects.point(0, 0, 1)].map(p => jDomMatrixCore.nextCell(pnt, p)).filter(p => jDomMatrixCore.checkValidPoint(p, matrix))

  /**
   * Retrieve the point associated with the provided element
   * @function getPointFromElement
   * @param elem
   * @returns module:jDomMatrixCore.point
   */
  jDomMatrixCore.getPointFromElement = (elem) => jDomMatrixObjects.point(
    Array.from(elem.parentNode.childNodes).indexOf(elem),
    Array.from(elem.parentNode.parentNode.childNodes).indexOf(elem.parentNode),
    Array.from(elem.parentNode.parentNode.parentNode.childNodes).indexOf(elem.parentNode.parentNode)
  )

  /**
   * Retrieve the DOMItem associated with the provided element in the matrix
   * @function getDOMItemFromElement
   * @param elem
   * @param matrix
   * @returns module:jDomObjects.DOMItem
   */
  jDomMatrixCore.getDOMItemFromElement = (elem, matrix) => jDomMatrixCore.getDOMItemFromPoint(jDomMatrixCore.getPointFromElement(elem), matrix)

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = jDomMatrixCore
    }
    exports = Object.assign(exports, jDomMatrixCore)
  }
}).call(this || window || base || {}) // Use the external context to assign this, which will be Window if rendered via browser
