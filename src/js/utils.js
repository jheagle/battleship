// Utility Functions
const curry = (fn) => function curried(...args) {
    return args.length >= fn.length ? fn(...args) : (...a) => curried(...[...args, ...a]);
}

const cloneObject = (object) => {
    return JSON.parse(JSON.stringify(object));
}

const mergeObjects = (...args) => {
    let obj1 = args[0];
    let obj2 = args[1];
    while (args.length > 2){
        let endArgs = args.splice(args.length - 2, 2);
        obj2 = args[args.length - 2] = mergeObjects(...endArgs);
    }
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return typeof obj2 === 'object' ? obj2 : obj1;
    }
    Object.keys(obj2).map((prop) => {
        if (typeof obj2[prop] === 'object' && obj1.hasOwnProperty(prop) && typeof obj1[prop] === 'object') {
            obj1[prop] = mergeObjects(obj1[prop], obj2[prop]);
            if (Object.keys(obj1[prop]).length > Object.keys(obj2[prop]).length) {
                obj2[prop] = cloneObject(obj1[prop]);
            }
        }
    });
    return Object.assign(obj1, obj2);
}

const fillArray = (i, l, a = []) => {
    a = a.slice();
    a.push(i);
    return ( --l > 0 ? fillArray(cloneObject(i), l, a) : a );
}

const buildArray = curry(fillArray);

const nextIndex = (a, i = 0) => ( i < a.length - 1 ) ? ++i : a.length - 1;

const nextCell = (pnt, dir) => pnt.z ? {
        x: pnt.x + dir.x,
        y: pnt.y + dir.y,
        z: pnt.z + dir.z,
    } : {
        x: pnt.x + dir.x,
        y: pnt.y + dir.y,
    };

const locateCells = (matrix, pnt = {}, depth = 0) => {
    if (!Object.keys(pnt).length) {
        pnt = point(0, 0);
    }
    if (Array.isArray(matrix)) {
        return matrix.map((arr, i) => {
            switch (depth) {
                case 0:
                    pnt = mergeObjects(pnt, {y: i});
                    break;
                case 1:
                    pnt = mergeObjects(pnt, {x: i});
                    break;
                default:
                    pnt = mergeObjects(pnt, {z: i});
            }
            return locateCells(arr, pnt, depth + 1);
        });
    }
    matrix.point = cloneObject(pnt);
    return matrix;
}

const checkIfShipCell = (point, matrix) => matrix[point.y][point.x].hasShip;
const checkIfAnyShip = (arr, matrix) => arr.filter((point) => !checkIfShipCell(point, matrix));

const checkShipBetween = (start, end, matrix) => {
    if (checkIfShipCell(start, matrix) || checkIfShipCell(end, matrix)) {
        return true;
    }
    let testArr = [];
    let xdiff = end.x - start.x;
    let ydiff = end.y - start.y;
    if (xdiff > 0) {
        for (let i = start.x; i < end.x; ++i) {
            if (checkIfShipCell({x: i, y: start.y}, matrix)) {
                return true;
            }
        }
    } else if (ydiff > 0) {
        for (let i = start.y; i < end.y; ++i) {
            if (checkIfShipCell({x: start.x, y: i}, matrix)) {
                return true;
            }
        }
    }
    return false;
}

const buildShip = (l, start, dir, matrix, view = false) => {
    let unit = ship();
    let cur = start;
    for (let i = 0; i < l; ++i) {
        unit.parts.push(setShip(matrix, cur, view));
        cur = nextCell(cur, dir);
    }
    return unit;
}

const buildFleet = (shipStats, matrix, view = false) => {
    let shipFleet = [];
    for (let size in shipStats) {
        let start = point(0, 0);
        let dirSelect = 0;
        let dir = point(0, 1);
        let end = point(0, 0);
        do {
            dirSelect = Math.floor(Math.random() * 2);
            dir = dirSelect === 0 ? point(0, 1) : point(1, 0);
            start = point(Math.floor(Math.random() * (matrix.length - ((shipStats[size] - 1) * dir.x))), Math.floor(Math.random() * (matrix[0].length - ((shipStats[size] - 1) * dir.y))));
            end = point(start.x + dir.x * (shipStats[size] - 1), start.y + dir.y * (shipStats[size] - 1));
        } while (checkShipBetween(start, end, matrix));
        shipFleet.push(buildShip(shipStats[size], start, dir, matrix, view));
    }
    return shipFleet;
}

const fleetBuilder = curry(buildFleet);
