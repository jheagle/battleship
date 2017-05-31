// Game specific functions
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