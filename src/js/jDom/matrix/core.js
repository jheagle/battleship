/**
 * @file All of the core matrix functions for working with a grid of points.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
'use strict'
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this || {}

  /**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */
  const previousJDomMatrixCore = root.jDomMatrixCore || {}

  /**
   * All methods exported from this module are encapsulated within jDomMatrixCore.
   * @author Joshua Heagle <joshuaheagle@gmail.com>
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
      console.error('jDom/matrix/core requires jDom/core/core')
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
      console.error('jDom/matrix/core requires jDom/matrix/objects')
    }
  }

  /**
   * Generate point data for each item in the matrix
   * WARNING: This is a recursive function.
   * @function bindPointData
   * @param {module:jDom/matrix/objects.MatrixColumn|module:jDom/matrix/objects.MatrixRow} item - A special DomItem
   * which is either a layer, row, or column in a matrix.
   * @param {module:jDom/matrix/objects.Point} pnt - A point to be added to a specific Matrix Column
   * @returns {module:jDom/matrix/objects.MatrixColumn|module:jDom/matrix/objects.MatrixRow}
   */
  jDomMatrixCore.bindPointData = (item, pnt = jDomMatrixObjects.point(0, 0, 0)) => jDomCore.mergeObjects(
    item,
    item.point ? {point: jDomCore.cloneObject(pnt)} : {
      children: item.children.map(
        (el, i) => jDomMatrixCore.bindPointData(el, Object.assign(pnt, {[el.axis]: i}))
      )
    }
  )

  /**
   * Based on provided point and point direction generate next point.
   * @function nextCell
   * @param {module:jDom/matrix/objects.Point} pnt - Provide the current / initial point
   * @param {module:jDom/matrix/objects.Direction} dir - Provide the direction to be applied to find the next point
   * @returns {module:jDom/matrix/objects.Point}
   */
  jDomMatrixCore.nextCell = (pnt, dir) => jDomMatrixObjects.point(pnt.x + dir.x, pnt.y + dir.y, pnt.z + dir.z)

  /**
   * Based on provided point and another point, get a point with the difference between each axis
   * @function pointDifference
   * @param {module:jDom/matrix/objects.Point} start - The first point to compare
   * @param {module:jDom/matrix/objects.Point} end - The other point to be compared
   * @returns {module:jDom/matrix/objects.Point}
   */
  jDomMatrixCore.pointDifference = (start, end) => jDomMatrixObjects.point(
    end.x - start.x,
    end.y - start.y,
    end.z - start.z
  )

  /**
   * Given two points, compare the x, y, and z of each to see if they are the same
   * @function areEqualPoints
   * @param {module:jDom/matrix/objects.Point} p1 - The first point to compare
   * @param {module:jDom/matrix/objects.Point} p2 - The other point to be compared
   * @returns {boolean}
   */
  jDomMatrixCore.areEqualPoints = (p1, p2) => p1.x === p2.x && p1.y === p2.y && p1.z === p2.z

  /**
   * Return the first coordinate number with the highest absolute value.
   * @function getHighestAbsoluteCoordinate
   * @param {module:jDom/matrix/objects.Point} pnt - A Point to be assessed.
   * @returns {module:jDom/matrix/objects.coordinate}
   */
  jDomMatrixCore.getHighestAbsoluteCoordinate = pnt => jDomCore.reduceObject(pnt, jDomCore.getAbsoluteMax, 0)

  /**
   * Having provided a coordinate number, find all corresponding axis, return the first match.
   * @function getFirstAxisOfCoordinate
   * @param {module:jDom/matrix/objects.Point} pnt - The Point containing a matching coordinate.
   * @param {module:jDom/matrix/objects.coordinate} coordinate - The coordinate to search for.
   * @returns {false|module:jDom/matrix/objects.axis}
   */
  jDomMatrixCore.getFirstAxisOfCoordinate = (pnt, coordinate) => Object.keys(pnt).filter(
    (key) => pnt[key] === coordinate
  )[0] || false

  /**
   * Given a point and the value of the highest coordinate select the corresponding axis which will be the direction
   * (-1 or 1) to and set the other axis to 0.
   * @param {module:jDom/matrix/objects.Point} pnt - The which will be converted to a direction.
   * @param {module:jDom/matrix/objects.coordinate} highestCoordinate - The highest coordinate provided by the point.
   * @returns {module:jDom/matrix/objects.Direction}
   */
  const pointAndCoordinateToDirection = (pnt, highestCoordinate) => (
    axis => axis !== false
      ? jDomCore.mergeObjects(jDomMatrixObjects.point(0, 0, 0), {[`${axis}`]: highestCoordinate > 0 ? 1 : -1})
      : jDomMatrixObjects.point(0, 0, 0)
  )(jDomMatrixCore.getFirstAxisOfCoordinate(pnt, highestCoordinate))

  /**
   * Having a point, convert it to a direction where the axis with the highest coordinate value will be set to -1 or 1.
   * @param {module:jDom/matrix/objects.Point} pnt - The point to be converted to a direction.
   * @returns {module:jDom/matrix/objects.Direction}
   */
  const pointToDirection = pnt => pointAndCoordinateToDirection(pnt, jDomMatrixCore.getHighestAbsoluteCoordinate(pnt))

  /**
   * Retrieve a directional coordinate value based on two provided points
   * (directions consist of two zero coordinates and a single coordinate of 1 / -1)
   * @function pointsToDirection
   * @param {module:jDom/matrix/objects.Point} start - The first point to assess.
   * @param {module:jDom/matrix/objects.Point} end - The other point to assess.
   * @returns {module:jDom/matrix/objects.Direction}
   */
  jDomMatrixCore.pointsToDirection = (start, end) => pointToDirection(jDomMatrixCore.pointDifference(start, end))

  /**
   * Generate a random starting point for a line with the provided length and direction.
   * @function randomStart
   * @param {number} length - The intended length the resulting line.
   * @param {module:jDom/matrix/objects.Direction} dir - The direction the line will extend towards.
   * @param {module:jDom/matrix/objects.Point} [lengthLimits={x: 10, y: 10, z: 10}] - The maximum grid size.
   * @returns {module:jDom/matrix/objects.Point}
   */
  jDomMatrixCore.randomStart = (
    length,
    dir,
    lengthLimits = jDomMatrixObjects.point(10, 10, 10)
  ) => jDomMatrixObjects.point(
    jDomCore.randomInteger(lengthLimits.x - ((length - 1) * dir.x)),
    jDomCore.randomInteger(lengthLimits.y - ((length - 1) * dir.y)),
    jDomCore.randomInteger(lengthLimits.z - ((length - 1) * dir.z))
  )

  /**
   * Given a start point, line length, and a direction, generate the end point of the line.
   * @function lineEndPoint
   * @param {module:jDom/matrix/objects.Point} start - The selected starting point.
   * @param {number} length - The total length of the line.
   * @param {module:jDom/matrix/objects.Direction} dir - The direction of the line.
   * @returns {module:jDom/matrix/objects.Point}
   */
  jDomMatrixCore.lineEndPoint = (start, length, dir) => jDomMatrixObjects.point(
    start.x + dir.x * (length - 1),
    start.y + dir.y * (length - 1),
    start.z + dir.z * (length - 1)
  )

  /**
   * Having provided two points, return an array of transition points connecting 'start' and 'end'. Return array
   * includes 'start' (line[0]) and 'end' (line[line.length-1])
   * @function getPointsLine
   * @param {module:jDom/matrix/objects.Point} start - The starting location of the line.
   * @param {module:jDom/matrix/objects.Point} end - The final line destination.
   * @param {Array.<module:jDom/matrix/objects.Point>} [line=[]] - The resulting line to connect start and end.
   * @returns {Array.<module:jDom/matrix/objects.Point>}
   */
  jDomMatrixCore.getPointsLine = (start, end, line = []) => jDomMatrixCore.areEqualPoints(start, end)
    ? line.concat([start])
    : jDomMatrixCore.getPointsLine(
      jDomMatrixCore.nextCell(start, jDomMatrixCore.pointsToDirection(start, end)),
      end,
      line.concat([start])
    )

  /**
   * Takes an array of arrays containing two points each. Calls getPointsLine for each array of points. Returns an
   * array of all points captured for each line segment
   * @function getPointsLines
   * @param {Array.<Array.<module:jDom/matrix/objects.Point>>} lines - An array of lines only containing start and end.
   * @returns {Array.<Array.<module:jDom/matrix/objects.Point>>}
   */
  jDomMatrixCore.getPointsLines = lines => lines.reduce(
    (pointsArray, line) => pointsArray.concat(jDomMatrixCore.getPointsLine(...line)),
    []
  )

  /**
   * Function that produces a property of the new Object, taking three arguments
   * @callback module:jDom/matrix/core~testPointStatus
   * @param {module:jDom/matrix/objects.MatrixColumn|Object} pnt - A point which may have some status.
   * @param {module:jDom/matrix/objects.Matrix|Object} matrix - A matrix of points to find the point within.
   * @returns {boolean}
   */

  /**
   * Given a start and end point, test the points between with the provided function. Return the points as part of true
   * and / or false properties based on the test.
   * @function module:jDom/matrix/core~testPointsBetween
   * @param {module:jDom/matrix/objects.Point} start - The beginning point to check.
   * @param {module:jDom/matrix/objects.Point} end - The terminating point to check between.
   * @param {module:jDom/matrix/objects.Matrix} matrix - The grid of points all the points can exist on.
   * @param {module:jDom/matrix/core~testPointStatus} func - The test function which will return true or false.
   * @param {boolean} [inclusive=true] - Choose whether to include or exclude the start and end points in the results.
   * @returns {Object.<string, Array.<module:jDom/matrix/objects.Point>>}
   */
  jDomMatrixCore.testPointsBetween = (start, end, matrix, func, inclusive = true) =>
    jDomMatrixCore.getPointsLine(start, end).filter(
      (prop, i, line) => ((i !== 0 && i !== line.length - 1) || inclusive)
    ).reduce(
      (newPoints, next) => jDomCore.mergeObjects(newPoints, {[`${func(next, matrix)}`]: [next]}), {
        true: [],
        false: []
      }
    )

  /**
   * Given two points, check the cells between using specified function.
   * When inclusive is set to true the provided start and end points will also be tested
   * @function checkInBetween
   * @param {...*} args - These args match the parameter list for {@link module:jDom/matrix/core~testPointsBetween}
   * @returns {boolean}
   */
  jDomMatrixCore.checkInBetween = (...args) => !!jDomMatrixCore.testPointsBetween(...args).true.length

  /**
   * Return point-like object with all of the axis lengths.
   * @function getAxisLengths
   * @param {module:jDom/matrix/objects.Matrix} matrix - The matrix to get the dimensions of.
   * @returns {module:jDom/matrix/objects.Point}
   */
  jDomMatrixCore.getAxisLengths = (matrix) => jDomMatrixObjects.point(
    matrix.children[0].children[0].children.length,
    matrix.children[0].children.length,
    matrix.children.length
  )

  /**
   * Get random direction point
   * @function randDirection
   * @param {Array.<module:jDom/matrix/objects.Point>} [useCoordinates=[]] - An array of possible directions.
   * @returns {module:jDom/matrix/objects.Direction}
   */
  jDomMatrixCore.randDirection = (useCoordinates = []) => useCoordinates.length
    ? useCoordinates[jDomCore.randomInteger(useCoordinates.length)]
    : jDomMatrixObjects.point(0, 0, 0)

  /**
   * Test if the provided point exists in the matrix.
   * @function checkValidPoint
   * @param {module:jDom/matrix/objects.Point} pnt - Provide a point to validate.
   * @param {module:jDom/matrix/objects.Matrix} matrix - The matrix that contains valid points.
   * @returns {boolean}
   */
  jDomMatrixCore.checkValidPoint = (pnt, matrix) => !!matrix.children[pnt.z]
    && !!matrix.children[pnt.z].children[pnt.y]
    && !!matrix.children[pnt.z].children[pnt.y].children[pnt.x]
    && !!matrix.children[pnt.z].children[pnt.y].children[pnt.x].point

  /**
   * Retrieve the DomItem associated with the provided point
   * @function getDomItemFromPoint
   * @param {module:jDom/matrix/objects.Point} pnt - A point corresponding to a DomItem.
   * @param {module:jDom/matrix/objects.Matrix} matrix - The matrix containing the point.
   * @returns {false|module:jDom/core/dom/objects.DomItem}
   */
  jDomMatrixCore.getDomItemFromPoint = (pnt, matrix) => jDomMatrixCore.checkValidPoint(pnt, matrix)
    ? matrix.children[pnt.z].children[pnt.y].children[pnt.x]
    : false

  /**
   * Return an array of all the points in the matrix
   * @function getAllPoints
   * @param {module:jDom/matrix/objects.Matrix|module:jDom/matrix/objects.MatrixColumn} matrix - The matrix to retrieve
   * points from.
   * @param {Array.<module:jDom/matrix/objects.Point>} [allPoints=[]] - The array of points to be returned
   * @returns {Array.<module:jDom/matrix/objects.Point>}
   */
  jDomMatrixCore.getAllPoints = (matrix, allPoints = []) => (matrix.point)
    ? allPoints.concat([matrix.point])
    : matrix.children.reduce((allPoints, child) => allPoints.concat(jDomMatrixCore.getAllPoints(child, [])), [])

  /**
   * Return all valid points surrounding a provided point
   * @function adjacentPoints
   * @param {module:jDom/matrix/objects.Point} pnt - The point we want to find adjacent points for.
   * @param {module:jDom/matrix/objects.Matrix} matrix - The matrix having the point.
   * @returns {Array.<module:jDom/matrix/objects.Point>}
   */
  jDomMatrixCore.adjacentPoints = (pnt, matrix) => jDomMatrixCore.getPointsLines([
    [jDomMatrixObjects.point(-1, 1, 1), jDomMatrixObjects.point(1, -1, -1)],
    [jDomMatrixObjects.point(1, 1, 1), jDomMatrixObjects.point(-1, 1, -1)],
    [jDomMatrixObjects.point(-1, -1, 1), jDomMatrixObjects.point(1, -1, 1)],
    [jDomMatrixObjects.point(1, 0, 0), jDomMatrixObjects.point(1, 1, -1)],
    [jDomMatrixObjects.point(-1, 1, 0), jDomMatrixObjects.point(1, 1, 0)]
  ]).concat([
    jDomMatrixObjects.point(0, 0, 1),
    jDomMatrixObjects.point(1, 0, 0),
    jDomMatrixObjects.point(-1, 0, -1),
    jDomMatrixObjects.point(0, 0, -1)
  ]).map(p => jDomMatrixCore.nextCell(pnt, p))
    .filter(p => jDomMatrixCore.checkValidPoint(jDomMatrixCore.nextCell(pnt, p), matrix))

  /**
   * Return all points which touch on edges (not diagonal)
   * @function adjacentEdgePoints
   * @param {module:jDom/matrix/objects.Point} pnt - The point we want to find adjacent points for.
   * @param {module:jDom/matrix/objects.Matrix} matrix - The matrix having the point.
   * @returns {Array.<module:jDom/matrix/objects.Point>}
   */
  jDomMatrixCore.adjacentEdgePoints = (pnt, matrix) => [
    jDomMatrixObjects.point(-1, 0, 0),
    jDomMatrixObjects.point(1, 0, 0),
    jDomMatrixObjects.point(0, -1, 0),
    jDomMatrixObjects.point(0, 1, 0),
    jDomMatrixObjects.point(0, 0, -1),
    jDomMatrixObjects.point(0, 0, 1)
  ].map(p => jDomMatrixCore.nextCell(pnt, p)).filter(p => jDomMatrixCore.checkValidPoint(p, matrix))

  /**
   * Retrieve the point associated with the provided element.
   * @function getPointFromElement
   * @param {Node|HTMLElement|module:jDom/pseudoDom/objects.PseudoHTMLElement} elem - Provide an element associated with
   * a point.
   * @returns {module:jDom/matrix/objects.Point}
   */
  jDomMatrixCore.getPointFromElement = elem => jDomMatrixObjects.point(
    Array.from(elem.parentNode.childNodes).indexOf(elem),
    Array.from(elem.parentNode.parentNode.childNodes).indexOf(elem.parentNode),
    Array.from(elem.parentNode.parentNode.parentNode.childNodes).indexOf(elem.parentNode.parentNode)
  )

  /**
   * Retrieve the DomItem associated with the provided element in the matrix
   * @function getDomItemFromElement
   * @param {Node|HTMLElement|module:jDom/pseudoDom/objects.PseudoHTMLElement} elem - Provide an element having an
   * associated DomItem.
   * @param {module:jDom/matrix/objects.Matrix} matrix - The matrix potentially containing the DomItem with Point.
   * @returns {module:jDom/core/dom/objects.DomItem}
   */
  jDomMatrixCore.getDomItemFromElement = (elem, matrix) => jDomMatrixCore.getDomItemFromPoint(
    jDomMatrixCore.getPointFromElement(elem),
    matrix
  )

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
