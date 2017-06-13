// Game specific functions
/**
 * Return the hasShip tile boolean at the specified point.
 * @param point
 * @param matrix
 */
const checkIfShipCell = (point, matrix) => matrix.z[point.z].y[point.y].x[point.x].hasShip;

/**
 * Generate a ship with the specified length, beginning and direction.
 * The visibility of the ship on the board is determined by the view parameter.
 * @param length
 * @param start
 * @param dir
 * @param matrix
 * @param view
 */
const buildShip = (length, start, dir, matrix, view = false) => {
    let unit = ship();
    let cur = start;
    for (let i = 0; i < length; ++i) {
        unit.parts.push(setShip(matrix, cur, view));
        cur = nextCell(cur, dir);
    }
    return unit;
}

/**
 * Create a series of randomly placed ships based on the provided shipLengths.
 * The optional parameter view will set the visibility of the ships.
 * @param shipLengths
 * @param matrix
 * @param view
 * @returns {Array}
 */
const generateRandomFleet = (shipLengths, matrix, view = false) => {
    let shipFleet = []; // Create array to store generated ships
    let lengths = {x: matrix.z[0].y[0].x.length, y: matrix.z[0].y.length, z: matrix.z.length}; // store the length of each dimension
    // Loop through all of the provided lengths to create a ship for each
    for (let size in shipLengths) {
        let dir = point(1, 0, 0); // default direction adjuster
        let start = point(0, 0, 0); // default initial ship coordinates
        let end = point(0, 0, 0); // default final ship coordinates
        let useZ = shipLengths[size] <= lengths.z ? 1 : 0; // check if a ship will fit on the z axis
        // generate and test ship coordinates, if the test fails re-generate and test again till success
        do {
            // randomly select ship direction
            switch (Math.floor(Math.random() * (2 + useZ))) {
                case 0:
                    dir = point(1, 0, 0);
                    break;
                case 1:
                    dir = point(0, 1, 0);
                    break;
                default:
                    dir = point(0, 0, 1);
            }
            // generate start and end coordinates based on direction and ensuring start is far enough from edge of matrix
            start = point(randCoords(lengths.x, shipLengths[size], dir.x), randCoords(lengths.y, shipLengths[size], dir.y), randCoords(lengths.z, shipLengths[size], dir.z));
            end = point(start.x + dir.x * (shipLengths[size] - 1), start.y + dir.y * (shipLengths[size] - 1), start.z + dir.z * (shipLengths[size] - 1));
        } while (checkInBetween(start, end, matrix, checkIfShipCell)); // test if there are any ship between start and end
        shipFleet.push(buildShip(shipLengths[size], start, dir, matrix, view)); // once coordinates pass test, generate the ship and pass to the Fleet
    }
    return shipFleet;
}
// shortcut for generating random fleet with the above function
const randomFleet = curry(generateRandomFleet);