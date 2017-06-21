// Core system functions
/**
 * Return a curried version of the passed function.
 * The returned function expects the same number of arguments minus the ones provided.
 * fn is the name of the function being curried.
 * @param fn
 */
const curry = (fn) => function curried(...args) {
    return args.length >= fn.length ? fn(...args) : (...a) => curried(...[...args, ...a]);
}

/**
 * Clone objects for manipulation without data corruption
 * @param object
 */
const cloneObject = (object) => {
    return JSON.parse(JSON.stringify(object));
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
    let obj1 = args[0]; // original object
    let obj2 = args[1]; // overwriting object
    // When there are more than two objects start from end of list and perform merge
    // Loop ends when object list has no more than two objects.
    while (args.length > 2) {
        let endArgs = args.splice(args.length - 2, 2); // remove last two objects from list and perform merge
        obj2 = args[args.length - 2] = mergeObjects(...endArgs);
    }
    // Discontinue deep merge if the inputs are not objects
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return typeof obj2 === 'object' ? obj2 : obj1; // Simply return the passed argument
    }
    // Loop through object properties to find sub-objects
    Object.keys(obj2).map((prop) => {
        if (typeof obj2[prop] === 'object' && obj1.hasOwnProperty(prop) && typeof obj1[prop] === 'object') {
            // If a sub-object is found perform merge on that object.
            obj1[prop] = mergeObjects(obj1[prop], obj2[prop]);
            // Add preference for the object with more properties to do the overwriting
            if (Object.keys(obj1[prop]).length > Object.keys(obj2[prop]).length) {
                obj2[prop] = cloneObject(obj1[prop]);
            }
        }
    });
    return Object.assign(obj1, obj2); // assign() will perform a merge of the objects at the top level
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
    arr = arr.slice(); // clone array
    arr.push(item); // add the item to the array
    return ( --length > 0 ? fillArray(cloneObject(item), length, arr) : arr ); // repeat adding items until length value is 0
}
const buildArray = curry(fillArray);

/**
 * Return next index in an ordered array until max index reached. Takes array and current index.
 * @param arr
 * @param i
 */
const nextIndex = (arr, i = 0) => ( i < arr.length - 1 ) ? ++i : arr.length - 1;

/**
 * Based on provided point and point direction generate next point.
 * @param pnt
 * @param dir
 */
const nextCell = (pnt, dir) => point(pnt.x + dir.x, pnt.y + dir.y, pnt.z + dir.z);

/**
 * Based on provided point and point direction generate next point.
 * @param start
 * @param end
 */
const pointDifference = (start, end) => point(end.x - start.x, end.y - start.y, end.z - start.z);

/**
 * Generate point data for each item in the matrix
 * WARNING: This is a recursive function.
 * @param matrix
 * @param pnt
 * @param axis
 * @returns {*}
 */
const bindPointData = (matrix, pnt = {}, axis = 'z') => {
    if (!Object.keys(pnt).length) {
        pnt = point(0, 0, 0);
    }
    if (Array.isArray(matrix)) {
        return matrix.map((el, i) => {
            pnt = mergeObjects(pnt, {[axis]: i});
            return bindPointData(el, pnt, axis);
        });
    }
    if (typeof matrix === 'object' && !matrix.point) {
        Object.keys(matrix).map((key) => Array.isArray(matrix[key]) ? bindPointData(matrix[key], pnt, key) : matrix[key]);
        return matrix;
    }
    matrix.point = cloneObject(pnt);
    return matrix;
}

/**
 * Append styles to the provided element.
 * @param elem
 * @param styles
 */
const addElementStyles = (elem, styles) => {
    if (Object.keys(styles).length && elem.style) {
        Object.keys(styles).forEach((styleName) => elem.style[styleName] = styles[styleName]);
    }
    return elem;
}

/**
 * Create an HTML element based on the provided attributes and return the element as an Object.
 * @param elemAttr
 * @returns {Element}
 */
const generateElement = (elemAttr) => {
    let elem = document.createElement(elemAttr.type);
    Object.keys(elemAttr).map((attr) => {
        if (attr !== 'type' && attr !== 'styles') {
            elem.setAttribute(attr, elemAttr[attr]);
        }
    });
    if (elemAttr.styles) {
        addElementStyles(elem, elemAttr.styles);
    }
    return elem;
}

/**
 * Generate HTML element data for each object in the matrix
 * WARNING: This is a recursive function.
 * @param types
 * @param matrix
 * @param zIndex
 * @returns {*}
 */
const bindElements = (types, matrix, zIndex = 0) => {
    if (Array.isArray(matrix)) {
        return matrix.map((el, i) => el.axis === 'z' ? bindElements(types, el, i) : bindElements(types, el, 0));
    }
    if (matrix.element && types[matrix.axis]) {
        types[matrix.axis].styles = mergeObjects(matrix.styles, Array.isArray(types[matrix.axis]) ? types[matrix.axis][types[matrix.axis].length - 1].styles : types[matrix.axis].styles);
        Array.isArray(types[matrix.axis]) ? types[matrix.axis][0].styles.zIndex = zIndex : types[matrix.axis].styles.zIndex = zIndex;
        matrix.element = Array.isArray(types[matrix.axis]) ? (types[matrix.axis].map(type => matrix.element instanceof HTMLElement ? matrix.element.appendChild(generateElement(type)) : matrix.element = generateElement(type)))[0] : generateElement(types[matrix.axis]);
    }
    Object.keys(matrix).map((key) => {
        return Array.isArray(matrix[key]) ? bindElements(types, matrix[key], 0) : matrix[key]
    });
    return matrix;
}

/**
 * Append each HTML element data in a combined HTML element
 * WARNING: This is a recursive function.
 * @param matrix
 * @returns {*}
 */
const buildHTML = (matrix) => {
    if (Array.isArray(matrix)) {
        return matrix.map((el) => buildHTML(el));
    }
    Object.keys(matrix).map((key) => {
        if (Array.isArray(matrix[key])) {
            return buildHTML(matrix[key]).map((elem) => matrix.element instanceof HTMLElement ? matrix.element.appendChild(elem) : elem);
        } else {
            return matrix[key]
        }
    });
    return matrix.element;
}

/**
 * Select the parent HTML element to append matrix to
 * @param matrix
 * @param parent
 */
const appendHTML = (matrix, parent = document.body) => parent.appendChild(buildHTML(matrix));

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
    };
    // Find the differences between the two points to get the ship direction
    let pntDiff = pointDifference(start, end);
    // Whichever difference is greater than 0 indicates that axis direction,
    // we then loop through all cells in that direction
    if (pntDiff.x > 1) {
        for (let i = start.x; i < end.x; ++i) {
            let test = point(i, start.y, start.z);
            if (func(test, matrix)) {
                points.true.push(test);
            } else {
                points.false.push(test);
            }
        }
    } else if (pntDiff.y > 1) {
        for (let i = start.y; i < end.y; ++i) {
            let test = point(start.x, i, start.z);
            if (func(test, matrix)) {
                points.true.push(test);
            } else {
                points.false.push(test);
            }
        }
    } else if (pntDiff.z > 1) {
        for (let i = start.z; i < end.z; ++i) {
            let test = point(start.x, start.y, i);
            if (func(test, matrix)) {
                points.true.push(test);
            } else {
                points.false.push(test);
            }
        }
    }
    return points;
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
    };

    // Return true if either of the two points have a ship
    if (inclusive) {
        if (func(start, matrix)) {
            points.true.push(start);
        } else {
            points.false.push(start);
        }
        if (func(end, matrix)) {
            points.true.push(end);
        } else {
            points.false.push(end);
        }
    }

    return mergeObjects(points, testPointsBetween(start, end, matrix, func));
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
const checkInBetween = (start, end, matrix, func, inclusive = true) => {
    // Return true if either of the two points have a ship
    if (inclusive && (func(start, matrix) || func(end, matrix))) {
        return true;
    }
    return !!testPointsBetween(start, end, matrix, func).true.length;
}

/**
 * Return point-like object with all of the axis lengths.
 * @param matrix
 */
const getAxisLengths = (matrix) => ({x: matrix.z[0].y[0].x.length, y: matrix.z[0].y.length, z: matrix.z.length});

/**
 * Create a single random number where range is within length. The number is adjusted by the provided direction (0 or 1)
 * @param length
 * @param range
 * @param dirAdjust
 */
const randCoords = (length, range = 0, dirAdjust = 0) => Math.floor(Math.random() * (length - ((range - 1) * dirAdjust)));

/**
 * Test if the provided point exists in the matrix.
 * @param pnt
 * @param matrix
 */
const checkValidPoint = (pnt, matrix) => !!matrix.z[pnt.z] && !!matrix.z[pnt.z].y[pnt.y] && !!matrix.z[pnt.z].y[pnt.y].x[pnt.x] && !!matrix.z[pnt.z].y[pnt.y].x[pnt.x].point;

/**
 * Return an array of all the points in the matrix
 * @param matrix
 * @returns {Array}
 */
const getAllPoints = matrix => {
    let lengths = getAxisLengths(matrix);
    let allPoints = [];
    for (let z = 0; z < lengths.z; ++z) {
        for (let y = 0; y < lengths.y; ++y) {
            for (let x = 0; x < lengths.x; ++x) {
                allPoints.push(matrix.z[z].y[y].x[x].point);
            }
        }
    }
    return allPoints;
}

/**
 * Return all valid points surrounding a provided point
 * @param pnt
 * @param matrix
 * @returns {Array}
 */
const adjacentPoints = (pnt, matrix) => {
    let adjPoints = [];
    for (let z = -1; z < 2; ++z) {
        for (let y = -1; y < 2; ++y) {
            for (let x = -1; x < 2; ++x) {
                let testPoint = point(pnt.x + x, pnt.y + y, pnt.z + z);
                if (checkValidPoint(testPoint, matrix) && point !== testPoint) {
                    adjPoints.push(testPoint);
                }
            }
        }
    }
    return adjPoints;
}

/**
 * Return all points which touch on edges (not diagonal)
 * @param pnt
 * @param matrix
 */
const adjacentEdgePoints = (pnt, matrix) => [point(-1, 0, 0), point(1, 0, 0), point(0, -1, 0), point(0, 1, 0), point(0, 0, -1), point(0, 0, 1)].map(p => point(pnt.x + p.x, pnt.y + p.y, pnt.z + p.z)).filter(p => checkValidPoint(p, matrix));

/**
 * Attach an event listener to each cell in the matrix.
 * Accepts an unlimited number of additional arguments to be passed to the action function.
 * WARNING: This is a recursive function.
 * @param matrix
 * @param event
 * @param func
 * @param extra
 * @returns {*}
 */
const bindListeners = (matrix, event, func, ...extra) => {
    if (Array.isArray(matrix)) {
        return matrix.map((arr) => {
            return bindListeners(arr, event, func, ...extra);
        });
    }
    if (typeof matrix === 'object' && !matrix.point) {
        Object.keys(matrix).map((key) => Array.isArray(matrix[key]) ? bindListeners(matrix[key], event, func, ...extra) : matrix[key]);
        return matrix;
    }
    return matrix.element instanceof HTMLElement && matrix.point ? matrix.element.addEventListener(event, () => func(matrix.point, ...extra)) : matrix.element;
}
