// Core system functions
/**
 * Return a curried version of the passed function.
 * The returned function expects the same number of arguments minus the ones provided.
 * fn is the name of the function being curried.
 * @param fn
 */
const curry = (fn) => function curried(...args) {
    return args.length >= fn.length ? fn(...args) : (...a) => curried(...[...args, ...a])
}

/**
 * Clone objects for manipulation without data corruption
 * @param object
 */
const cloneObject = (object) => cloneExclusions(JSON.parse(JSON.stringify(object)), object)

/**
 * Re-add the Object Properties which cannot be cloned and must be directly copied to the new cloned object
 * @param cloned
 * @param object
 * @returns {*}
 */
const cloneExclusions = (cloned, object) => {
    if (typeof object === 'object' && Object.keys(object).length) {
        Object.keys(object).map(key => cloned[key] = cloned[key] && !(object[key] instanceof HTMLElement) ? cloneExclusions(cloned[key], object[key]) : object[key])
        return cloned
    }
    if (Array.isArray(object) && object.length) {
        object.map((prop, i) => cloned[i] = cloned[i].length && !(prop instanceof HTMLElement) ? cloneExclusions(cloned[i], prop) : prop)
        return cloned
    }
    return cloned
}

/**
 * Perform a deep merge of objects. This will combine all objects and sub-objects,
 * objects having the same attributes will overwrite starting from the end of the argument
 * list and bubbling up to overwrite the first object. The merged object is then returned.
 * WARNING: This is a recursive function.
 * @param args
 * @returns {*}
 */
const mergeObjects = (...args) => {
    if (args.length === 1) {
        return args[0]
    }
    if (args.length > 2) {
        return args.reduce((obj1, obj2) => mergeObjects(obj1, obj2), {})
    }
    let obj1 = args[0] // original object
    let obj2 = args[1] // overwriting object
    if (typeof obj2 === 'object' && Object.keys(obj2).length) {
        Object.keys(obj2).map(key => obj1[key] = obj1[key] && !(obj2[key] instanceof HTMLElement) ? mergeObjects(obj1[key], obj2[key]) : obj2[key])
        return obj1
    }
    if (Array.isArray(obj2) && obj2.length) {
        obj2.map((prop, i) => obj1[i] = obj1[i].length && !(prop instanceof HTMLElement) ? mergeObjects(obj1[i], prop) : prop)
        return obj1
    }
    return typeof obj2 !== 'object' && !Array.isArray(obj2) ? obj2 : Object.assign(obj1, obj2)
}

/**
 * Generate an array of specified item extending to specified length
 * WARNING: This is a recursive function.
 * @param item
 * @param length
 * @param arr
 * @returns {Array}
 */
const fillArray = (item, length, arr = []) => {
    arr = arr.slice() // clone array
    arr.push(item) // add the item to the array
    return ( --length > 0 ? fillArray(cloneObject(item), length, arr) : arr ) // repeat adding items until length value is 0
}
const buildArray = curry(fillArray)

/**
 * Return next index in an ordered array until max index reached. Takes array and current index.
 * @param arr
 * @param i
 */
const nextIndex = (arr, i = 0) => ( i < arr.length - 1 ) ? ++i : arr.length - 1

/**
 * Based on provided point and point direction generate next point.
 * @param pnt
 * @param dir
 */
const nextCell = (pnt, dir) => point(pnt.x + dir.x, pnt.y + dir.y, pnt.z + dir.z)

/**
 * Based on provided point and point direction generate next point.
 * @param start
 * @param end
 */
const pointDifference = (start, end) => point(end.x - start.x, end.y - start.y, end.z - start.z)

/**
 * Generate point data for each item in the matrix
 * WARNING: This is a recursive function.
 * @param matrix
 * @param pnt
 * @param axis
 * @returns {*}
 */
const bindPointData = (item, pnt = {}) => {
    if (!Object.keys(pnt).length) {
        pnt = point(0, 0, 0)
    }
    if (item.point) {
        item.point = cloneObject(pnt)
    } else {
        item.children.map((el, i) => {
            pnt = mergeObjects(pnt, {[el.axis]: i})
            return bindPointData(el, pnt)
        })
    }
    return item
}

/**
 * Append styles to the provided element.
 * @param elem
 * @param styles
 */
const addElementStyles = (elem, styles) => {
    if (Object.keys(styles).length && elem.style) {
        Object.keys(styles).forEach((styleName) => elem.style[styleName] = styles[styleName])
    }
    return elem
}

/**
 * Create an HTML element based on the provided attributes and return the element as an Object.
 * @param elemAttr
 * @returns {Element}
 */
const generateElement = (elemAttr) => {
    let elem = document.createElement(elemAttr.element)
    Object.keys(elemAttr).map((attr) => {
        if (attr !== 'element' && attr !== 'styles') {
            elem.setAttribute(attr, elemAttr[attr])
        }
    })
    if (elemAttr.styles) {
        addElementStyles(elem, elemAttr.styles)
    }
    return elem
}

/**
 * Generate HTML element data for each object in the matrix
 * WARNING: This is a recursive function.
 * @param types
 * @param matrix
 * @param zIndex
 * @returns {*}
 */
const bindElements = (item) => {
    return DOMItem(item, {
        attributes: item.attributes,
        element: generateElement(item.attributes),
        children: item.children.map(bindElements)
    })
}

/**
 * Append each HTML element data in a combined HTML element
 * WARNING: This is a recursive function.
 * @param matrix
 * @returns {*}
 */
const buildHTML = (item) => {
    item.children.map(i => item.element.appendChild(buildHTML(i)))
    return item.element
}

/**
 * Select the parent HTML element for appending new elements
 * @param item
 * @param parent
 * @returns {*|HTMLElement}
 */
const appendHTML = (item, parent = documentItem.body) => {
    parent.children.push(item)
    buildHTML(parent)
    return parent
}

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
const getAxisLengths = (matrix) => ({
    x: matrix.children[0].children[0].children.length,
    y: matrix.children[0].children.length,
    z: matrix.children.length
})

/**
 * Create a single random number where range is within length. The number is adjusted by the provided direction (0 or 1)
 * @param length
 * @param range
 * @param dirAdjust
 */
const randCoords = (length, range = 0, dirAdjust = 0) => Math.floor(Math.random() * (length - ((range - 1) * dirAdjust)))

/**
 * Get random direction point
 * @param useZ
 */
const randDirection = (useZ = 0) => {
    switch (Math.floor(Math.random() * (2 + useZ))) {
        case 0:
            return point(1, 0, 0)
            break
        case 1:
            return point(0, 1, 0)
            break
        default:
            return point(0, 0, 1)
    }
}

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

/**
 * Attach an event listener to each cell in the matrix.
 * Accepts an unlimited number of additional arguments to be passed to the action function.
 * WARNING: This is a recursive function.
 * @param item
 * @param extra
 * @returns {*}
 */
const bindListeners = (item, ...extra) => {
    if (item.eventListeners && Object.keys(item.eventListeners).length && item.element instanceof HTMLElement) {
        Object.keys(item.eventListeners).map(event => item.element.addEventListener(event, () => item.eventListeners[event](item, ...extra)))
    } else {
        item.children.map(i => bindListeners(i, ...extra))
    }
    return item
}

/**
 * 
 * @param fn
 * @param time
 * @param args
 * @returns {*}
 */
const queueTimeout = (fn = {}, time = 0, ...args) => {
    queueTimeout.queue = queueTimeout.queue || []
    queueTimeout.isRunning = queueTimeout.isRunning || false
    if (fn) {
        queueTimeout.queue.push({func: fn, timeout: time, args: args});
    }
    if (queueTimeout.queue.length && !queueTimeout.isRunning) {
        queueTimeout.isRunning = true
        let toRun = queueTimeout.queue.shift()
        toRun.args = toRun.args || []
        return setTimeout(() => {
            toRun.func(...toRun.args)
            queueTimeout.isRunning = false
            return queueTimeout(false)
        }, toRun.timeout)
    }
    return queueTimeout.isRunning
}