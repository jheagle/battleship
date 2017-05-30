// Utility Functions
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
 * Generate an array of specified item (i) extending to specified length (l)
 * @param i
 * @param l
 * @param a
 * @returns {Array}
 */
const fillArray = (i, l, a = []) => {
    a = a.slice(); // clone array
    a.push(i); // add the item to the array
    return ( --l > 0 ? fillArray(cloneObject(i), l, a) : a ); // repeat adding items until length value is 0
}
const buildArray = curry(fillArray);

/**
 *
 * @param a
 * @param i
 */
const nextIndex = (a, i = 0) => ( i < a.length - 1 ) ? ++i : a.length - 1;

/**
 *
 * @param pnt
 * @param dir
 */
const nextCell = (pnt, dir) => ({
    x: pnt.x + dir.x,
    y: pnt.y + dir.y,
    z: pnt.z + dir.z,
});

/**
 *
 * @param matrix
 * @param pnt
 * @param depth
 * @returns {*}
 */
const locateCells = (matrix, pnt = {}, depth = 0) => {
    if (!Object.keys(pnt).length) {
        pnt = point(0, 0, 0);
    }
    if (Array.isArray(matrix)) {
        return matrix.map((arr, i) => {
            switch (depth) {
                case 0:
                    pnt = mergeObjects(pnt, {z: i});
                    break;
                case 1:
                    pnt = mergeObjects(pnt, {y: i});
                    break;
                default:
                    pnt = mergeObjects(pnt, {x: i});
            }
            return locateCells(arr, pnt, depth + 1);
        });
    }
    matrix.point = cloneObject(pnt);
    return matrix;
}

/**
 *
 * @param point
 * @param matrix
 */
const checkIfShipCell = (point, matrix) => matrix[point.z][point.y][point.x].hasShip;

/**
 *
 * @param arr
 * @param matrix
 */
const checkIfAnyShip = (arr, matrix) => arr.filter((point) => !checkIfShipCell(point, matrix));

/**
 *
 * @param start
 * @param end
 * @param matrix
 * @returns {boolean}
 */
const checkShipBetween = (start, end, matrix) => {
    if (checkIfShipCell(start, matrix) || checkIfShipCell(end, matrix)) {
        return true;
    }
    let xdiff = end.x - start.x;
    let ydiff = end.y - start.y;
    let zdiff = end.z - start.z;
    if (xdiff > 0) {
        for (let i = start.x; i < end.x; ++i) {
            if (checkIfShipCell({x: i, y: start.y, z: start.z}, matrix)) {
                return true;
            }
        }
    } else if (ydiff > 0) {
        for (let i = start.y; i < end.y; ++i) {
            if (checkIfShipCell({x: start.x, y: i, z: start.z}, matrix)) {
                return true;
            }
        }
    } else if (zdiff > 0) {
        for (let i = start.z; i < end.z; ++i) {
            if (checkIfShipCell({x: start.x, y: start.y, z: i}, matrix)) {
                return true;
            }
        }
    }
    return false;
}

/**
 *
 * @param l
 * @param start
 * @param dir
 * @param matrix
 * @param view
 */
const buildShip = (l, start, dir, matrix, view = false) => {
    let unit = ship();
    let cur = start;
    for (let i = 0; i < l; ++i) {
        unit.parts.push(setShip(matrix, cur, view));
        cur = nextCell(cur, dir);
    }
    return unit;
}

/**
 *
 * @param shipStats
 * @param matrix
 * @param view
 * @returns {Array}
 */
const buildFleet = (shipStats, matrix, view = false) => {
    let shipFleet = [];
    for (let size in shipStats) {
        let start = point(0, 0, 0);
        let dirSelect = 0;
        let dir = point(1, 0, 0);
        let end = point(0, 0, 0);
        do {
            dirSelect = Math.floor(Math.random() * (matrix.length + 1));
            switch (dirSelect) {
                case 1:
                    dir = point(0, 1, 0);
                    break;
                case 2:
                    dir = point(0, 1, 0);
                    break;
            }
            start = point(Math.floor(Math.random() * (matrix[0][0].length - ((shipStats[size] - 1) * dir.x))), Math.floor(Math.random() * (matrix[0].length - ((shipStats[size] - 1) * dir.y))), Math.floor(Math.random() * (matrix.length - ((shipStats[size] - 1) * dir.z))));
            end = point(start.x + dir.x * (shipStats[size] - 1), start.y + dir.y * (shipStats[size] - 1), start.z + dir.z * (shipStats[size] - 1));
        } while (checkShipBetween(start, end, matrix));
        shipFleet.push(buildShip(shipStats[size], start, dir, matrix, view));
    }
    return shipFleet;
}
const fleetBuilder = curry(buildFleet);

/**
 *
 * @param matrix
 * @param func
 * @param board
 * @param extra
 * @returns {*}
 */
const bindListeners = (matrix, func, board, ...extra) => {
    if (Array.isArray(matrix)) {
        return matrix.map((arr) => {
            return bindListeners(arr, func, board, ...extra);
        });
    }
    return matrix.element instanceof HTMLElement ? matrix.element.addEventListener('click', () => func(board, matrix.point, ...extra)) : matrix.element;
}
