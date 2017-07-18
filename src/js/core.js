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
 * This function is intended to replicate behaviour of the Array.map() function but for Objects.
 * If an array is passed in instead then it will perform standard map(). It is recommended to
 * always use the standard map() function when it is known that the object is actually an array.
 * @param obj
 * @param fn
 * @param args
 */
const mapObject = (obj, fn, ...args) => Array.isArray(obj) ? obj.map((prop, i) => fn(prop, i, ...args)) : Object.keys(obj).reduce((newObj, curr) => {
        newObj[curr] = fn(obj[curr], curr, ...args)
        return newObj
    }, {})

/**
 * Clone objects for manipulation without data corruption
 * @param object
 * @param parents
 */
const cloneObjectRules = (object, parents = []) => cloneExclusions(JSON.parse(JSON.stringify(object, (key, val) => removeCircularReference(key, val, parents))), object, parents = [])

/**
 * Call cloneObjectRules with the required object
 */
const cloneObject = curry(cloneObjectRules)

/**
 * Exclude cloning the same references multiple times. This ia utility function to be called with JSON.stringify
 * @param key
 * @param val
 * @param parents
 * @returns {*}
 */
const removeCircularReference = (key, val, parents = []) => {
    if (typeof val === 'object') {
        if (parents.indexOf(val) >= 0)
            return undefined
        parents.push(val)
    }
    return val
}

/**
 * Re-add the Object Properties which cannot be cloned and must be directly copied to the new cloned object
 * @param cloned
 * @param object
 * @param parents
 * @returns {*}
 */
const cloneExclusions = (cloned, object, parents = []) => {
    if ((typeof object === 'object' && Object.keys(object).length) || (Array.isArray(object) && object.length)) {
        parents.push(object);
        return mapObject(object, (prop, key) => (!cloned[key] || prop instanceof HTMLElement || parents.indexOf(prop) >= 0) ? prop : cloneExclusions(cloned[key], prop, parents))
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
        Object.keys(obj2).map(key => obj1[key] = (!obj1[key] || obj2[key] instanceof HTMLElement || key === 'parentItem') ? obj2[key] : mergeObjects(obj1[key], obj2[key]))
        return obj1
    }
    if (Array.isArray(obj2) && obj2.length) {
        return mapObject(obj2, (prop, key) => (!obj1[key].length || prop instanceof HTMLElement || key === 'parentItem') ? prop : mergeObjects(obj1[key], prop))
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
 * Given two points, compare the x, y, and z of each to see if they are the same
 * @param p1
 * @param p2
 */
const checkEqualPoints = (p1, p2) => p1.x === p2.x && p1.y === p2.y && p1.z === p2.z

/**
 * Generate point data for each item in the matrix
 * WARNING: This is a recursive function.
 * @param item
 * @param pnt
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
 *
 * @param attr
 * @param value
 * @param item
 * @param children
 * @returns {Array}
 */
const getChildrenFromAttribute = (attr, value, item = documentItem.body, children = []) => {
    if (item.attributes[attr] && item.attributes[attr] === value) {
        children.push(item)
    }
    item.children.map(child => getChildrenFromAttribute(attr, value, child, children))
    return children
}

/**
 *
 * @param item
 */
const getTopParentItem = item => Object.keys(item.parentItem).length ? getTopParentItem(item.parentItem) : item

/**
 *
 * @param elem
 * @param styles
 * @returns {*}
 */
const addElementStyles = (elem, styles) => {
    if (Object.keys(styles).length && elem.style) {
        Object.keys(styles).forEach((styleName) => elem.style[styleName] = styles[styleName])
    }
    return elem
}

/**
 *
 * @param config
 */
const updateElement = (config) => {
    if (!(config.element instanceof HTMLElement)) {
        return config
    }
    if (config.attributes) {
        Object.keys(config.attributes).map((attr) => {
            if (attr === 'styles') {
                addElementStyles(config.element, config.attributes[attr])
            } else if (attr !== 'element') {
                config.element.setAttribute(attr, config.attributes[attr])
            }
        })
    }
    if (config.elementProperties) {
        Object.keys(config.elementProperties).map((prop) => config.element[prop] = config.elementProperties[prop])
    }
    return config
}

/**
 * Generate HTML element data for each object in the matrix
 * WARNING: This is a recursive function.
 * @param config
 */
const updateElements = (config) => {
    config = updateElement(config)
    config.children.map(child => updateElements(child))
}

/**
 * Create an HTML element based on the provided attributes and return the element as an Object.
 * @param config
 */
const generateElement = (config) => {
    config.element = document.createElement(config.attributes.element)
    return updateElement(config).element
}

/**
 * Generate HTML element data for each object in the matrix
 * WARNING: This is a recursive function.
 * @param item
 * @param parent
 */
const bindElements = (item, parent = documentItem) => DOMItem(item, {
    attributes: item.attributes || {element: 'div', styles: {}},
    elementProperties: item.elementProperties || {},
    element: generateElement(item) || HTMLElement,
    parentItem: parent,
    children: item.children ? item.children.map(child => bindElements(child, item)) : []
})

/**
 * Append each HTML element data in a combined HTML element
 * WARNING: This is a recursive function.
 * @param item
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
 * @returns {*}
 */
const appendHTML = (item, parent = documentItem.body) => {
    if (Array.isArray(item)) {
        item.map(i => parent.children.push(i))
    } else {
        parent.children.push(item)
    }
    buildHTML(parent)
    return item
}

/**
 * Reverse of appendHTML, remove an element
 * @param item
 * @param parent
 * @returns {Array.<HTMLElement>}
 */
const removeChild = (item, parent = documentItem.body) => {
    parent.element.removeChild(item.element)
    return parent.children.splice(parent.children.indexOf(item), 1)
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
        Object.keys(item.eventListeners).map(event => item.element.addEventListener(event, (e) => item.eventListeners[event](e, item, ...extra)))
    } else {
        item.children.map(i => bindListeners(i, ...extra))
    }
    return item
}

/**
 * Run Timeout functions one after the other in queue
 * WARNING: This is a recursive function.
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
