// Core matrix functions for working with a grid of points
/**
 * Generate point data for each item in the matrix
 * WARNING: This is a recursive function.
 * @param item
 * @param pnt
 * @returns {*}
 */
const bindPointData = (item, pnt = point(0, 0, 0)) => mergeObjects(item, (item.point ? {point: cloneObject(pnt)} : {children: item.children.map((el, i) => bindPointData(el, mergeObjects(pnt, {[el.axis]: i})))}))

/**
 * Based on provided point and point direction generate next point.
 * @param pnt
 * @param dir
 * @returns {Object.<string, number>}
 */
const nextCell = (pnt, dir) => point(pnt.x + dir.x, pnt.y + dir.y, pnt.z + dir.z)

/**
 * Based on provided point and point direction generate next point.
 * @param start
 * @param end
 * @returns {Object.<string, number>}
 */
const pointDifference = (start, end) => point(end.x - start.x, end.y - start.y, end.z - start.z)

/**
 * Given two points, compare the x, y, and z of each to see if they are the same
 * @param p1
 * @param p2
 * @returns {boolean}
 */
const checkEqualPoints = (p1, p2) => p1.x === p2.x && p1.y === p2.y && p1.z === p2.z

/**
 * Check if there is a negative coordinate value within the point provided
 * @param pnt
 * @returns {boolean}
 */
const pointHasNegative = pnt => !!Object.keys(filterObject(pnt, (attr, key) => attr < 0)).length

/**
 * Return the first coordinate number with the highest absolute value.
 * @param pnt
 * @returns {Array.<T>|*}
 */
const getHighAbsoluteCoord = pnt => reduceObject(pnt, curry(getMaxOrMin)(!pointHasNegative(pnt)), 0)

/**
 * Having provided a coordinate number, find all corresponding axis.
 * @param pnt
 * @param coord
 * @returns {*}
 */
const getAxisOfCoord = (pnt, coord) => Object.keys(pnt).filter((key) => pnt[key] === coord)

/**
 * Find all axis of the highest absolute value coordinate
 * @param pnt
 * @returns {*}
 */
const getHighAbsoluteCoordAxis = pnt => getAxisOfCoord(pnt, getHighAbsoluteCoord(pnt))

/**
 * Retrieve a directional coordinate value based on two provided points
 * (directions consist of two zero points and a single point of 1 / -1)
 * @param start
 * @param end
 * @returns {*}
 */
const pointDirection = (start, end) => mergeObjects(point(0, 0, 0), {[`${getHighAbsoluteCoordAxis(pointDifference(start, end))[0]}`]: pointHasNegative(pointDifference(start, end)) ? -1 : 1})

/**
 * Generate a random starting point for a line with the provided length and direction.
 * @param length
 * @param dir
 * @param lengthLimits
 * @returns {{x: number, y: number, z: number}}
 */
const randomStart = (length, dir, lengthLimits = point(10, 10, 10)) => point(randomInteger(lengthLimits.x - ((length - 1) * dir.x)), randomInteger(lengthLimits.y - ((length - 1) * dir.y)), randomInteger(lengthLimits.z - ((length - 1) * dir.z)))

/**
 * Given a start point, line length, and a direction, generate the end point of the line.
 * @param start
 * @param length
 * @param dir
 * @returns {Object.<string, number>}
 */
const lineEndPoint = (start, length, dir) => point(start.x + dir.x * (length - 1), start.y + dir.y * (length - 1), start.z + dir.z * (length - 1))

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

/**
 * Takes an array of arrays containing two points each. Calls getPointsLine for each array of points.
 * Returns and array of all points captured for each line segment
 * @param lines
 * @returns {Array.<*>}
 */
const getPointsLines = lines => lines.reduce((first, next) => first.concat(getPointsLine(...next)), [])

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
const testPointsBetween = (start, end, matrix, func, inclusive = true) => getPointsLine(start, end).filter((prop, i, line) => ((i !== 0 && i !== line.length - 1) || inclusive)).reduce((newPoints, next) => mergeObjects(newPoints, {[`${!!func(next, matrix)}`]: [next]}), {
    true: [],
    false: []
})

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
const getInBetween = (start, end, matrix, func, inclusive = true) => mergeObjects({
    true: [],
    false: []
}, testPointsBetween(start, end, matrix, func, inclusive))

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

/**
 * Return point-like object with all of the axis lengths.
 * @param matrix
 */
const getAxisLengths = (matrix) => point(matrix.children[0].children[0].children.length, matrix.children[0].children.length, matrix.children.length)

/**
 * Get random direction point
 * @param useCoords
 */
const randDirection = (useCoords = []) => useCoords.length ? useCoords[randomInteger(useCoords.length)] : point(0, 0, 0)

/**
 * Test if the provided point exists in the matrix.
 * @param pnt
 * @param matrix
 */
const checkValidPoint = (pnt, matrix) => !!matrix.children[pnt.z] && !!matrix.children[pnt.z].children[pnt.y] && !!matrix.children[pnt.z].children[pnt.y].children[pnt.x] && !!matrix.children[pnt.z].children[pnt.y].children[pnt.x].point

/**
 * Test if the provided point exists in the matrix.
 * @param pnt
 * @param matrix
 */
const getDOMItemFromPoint = (pnt, matrix) => checkValidPoint(pnt, matrix) ? matrix.children[pnt.z].children[pnt.y].children[pnt.x] : false;

/**
 * Return an array of all the points in the matrix
 * @param matrix
 * @param allPoints
 * @returns {Array}
 */
const getAllPoints = (matrix, allPoints = []) => (matrix.point) ? allPoints.concat([matrix.point]) : matrix.children.reduce((allPoints, child) => allPoints.concat(getAllPoints(child, [])), [])

/**
 * Return all valid points surrounding a provided point
 * @param pnt
 * @param matrix
 * @returns {Array}
 */
const adjacentPoints = (pnt, matrix) => getPointsLines([[point(-1, 1, 1), point(1, -1, -1)], [point(1, 1, 1), point(-1, 1, -1)], [point(-1, -1, 1), point(1, -1, 1)], [point(1, 0, 0), point(1, 1, -1)], [point(-1, 1, 0), point(1, 1, 0)]]).concat([point(0, 0, 1), point(1, 0, 0), point(-1, 0, -1), point(0, 0, -1)])
    .map(p => nextCell(pnt, p)).filter(p => checkValidPoint(nextCell(pnt, p), matrix))

/**
 * Return all points which touch on edges (not diagonal)
 * @param pnt
 * @param matrix
 */
const adjacentEdgePoints = (pnt, matrix) => [point(-1, 0, 0), point(1, 0, 0), point(0, -1, 0), point(0, 1, 0), point(0, 0, -1), point(0, 0, 1)].map(p => nextCell(pnt, p)).filter(p => checkValidPoint(p, matrix))

