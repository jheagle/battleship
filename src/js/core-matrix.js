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
 * @returns {number, number, number}
 */
const nextCell = (pnt, dir) => point(pnt.x + dir.x, pnt.y + dir.y, pnt.z + dir.z)

/**
 * Based on provided point and point direction generate next point.
 * @param start
 * @param end
 * @returns {number, number, number}
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
 * Given a start and end point, test the points between with the provided function.
 * Return the points as part of true or/and false properties based on the test.
 * @param start
 * @param end
 * @param matrix
 * @param func
 * @returns {{true: Array, false: Array}}
 */
const testPointsBetween = (start, end, matrix, func) => {
    let points = {
        true: [],
        false: []
    }
    // Find the differences between the two points to get the ship direction
    let pntDiff = pointDifference(start, end)
    // Whichever difference is greater than 0 indicates that axis direction,
    // we then loop through all cells in that direction
    if (pntDiff.x > 1) {
        for (let i = start.x; i < end.x; ++i) {
            let test = point(i, start.y, start.z)
            if (func(test, matrix)) {
                points.true.push(test)
            } else {
                points.false.push(test)
            }
        }
    } else if (pntDiff.y > 1) {
        for (let i = start.y; i < end.y; ++i) {
            let test = point(start.x, i, start.z)
            if (func(test, matrix)) {
                points.true.push(test)
            } else {
                points.false.push(test)
            }
        }
    } else if (pntDiff.z > 1) {
        for (let i = start.z; i < end.z; ++i) {
            let test = point(start.x, start.y, i)
            if (func(test, matrix)) {
                points.true.push(test)
            } else {
                points.false.push(test)
            }
        }
    }
    return points
}

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
const getInBetween = (start, end, matrix, func, inclusive = true) => {
    let points = {
        true: [],
        false: []
    }

    // Return true if either of the two points have a ship
    if (inclusive) {
        if (func(start, matrix)) {
            points.true.push(start)
        } else {
            points.false.push(start)
        }
        if (func(end, matrix)) {
            points.true.push(end)
        } else {
            points.false.push(end)
        }
    }

    return mergeObjects(points, testPointsBetween(start, end, matrix, func))
}

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
 * Create a single random number where range is within length. The number is adjusted by the provided direction (0 or 1)
 * @param length
 * @param range
 * @param dirAdjust
 */
const randCoords = (length, range = 0, dirAdjust = 0) => Math.floor(Math.random() * (length - ((range - 1) * dirAdjust)))

/**
 * Get random direction point
 * @param useCoords
 */
const randDirection = (useCoords = []) => useCoords.length ? useCoords[Math.floor(Math.random() * useCoords.length)] : point(0, 0, 0)

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
 * @returns {Array}
 */
const getAllPoints = matrix => {
    let lengths = getAxisLengths(matrix)
    let allPoints = []
    for (let z = 0; z < lengths.z; ++z) {
        for (let y = 0; y < lengths.y; ++y) {
            for (let x = 0; x < lengths.x; ++x) {
                allPoints.push(matrix.children[z].children[y].children[x].point)
            }
        }
    }
    return allPoints
}

/**
 * Return all valid points surrounding a provided point
 * @param pnt
 * @param matrix
 * @returns {Array}
 */
const adjacentPoints = (pnt, matrix) => {
    let adjPoints = []
    for (let z = -1; z < 2; ++z) {
        for (let y = -1; y < 2; ++y) {
            for (let x = -1; x < 2; ++x) {
                let testPoint = point(pnt.x + x, pnt.y + y, pnt.z + z)
                if (checkValidPoint(testPoint, matrix) && point !== testPoint) {
                    adjPoints.push(testPoint)
                }
            }
        }
    }
    return adjPoints
}

/**
 * Return all points which touch on edges (not diagonal)
 * @param pnt
 * @param matrix
 */
const adjacentEdgePoints = (pnt, matrix) => [point(-1, 0, 0), point(1, 0, 0), point(0, -1, 0), point(0, 1, 0), point(0, 0, -1), point(0, 0, 1)].map(p => point(pnt.x + p.x, pnt.y + p.y, pnt.z + p.z)).filter(p => checkValidPoint(p, matrix))

