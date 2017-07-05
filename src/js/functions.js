// Game specific functions
/**
 * Return the hasShip tile boolean at the specified point.
 * @param pnt
 * @param matrix
 */
const checkIfShipCell = (pnt, matrix) => matrix.children[pnt.z].children[pnt.y].children[pnt.x].hasShip

/**
 * Return the isHit tile boolean at the specified point.
 * @param pnt
 * @param matrix
 */
const checkIfHitCell = (pnt, matrix) => matrix.children[pnt.z].children[pnt.y].children[pnt.x].isHit

/**
 * Get all points which were not yet hit in the matrix.
 * @param matrix
 */
const getAllNonHitCells = matrix => getAllPoints(matrix).filter(p => !checkIfHitCell(p, matrix))

/**
 * Get the points surrounding a provided point which were not hit.
 * @param pnt
 * @param matrix
 */
const getAdjNonHitCells = (pnt, matrix) => adjacentPoints(pnt, matrix).filter(p => !checkIfHitCell(p, matrix))

/**
 * Get the points which have same edges with the provided point and are not hit.
 * @param pnt
 * @param matrix
 */
const getAdjEdgeNonHitCells = (pnt, matrix) => adjacentEdgePoints(pnt, matrix).filter(p => !checkIfHitCell(p, matrix))

/**
 * Given an array of items, return the item with the lowest status property (at the end of the array)
 * @param items
 */
const getALowStatusItem = items => items.reduce((a, b) => b.status <= a.status ? b : a)

/**
 * Given an array of items, return all items which have the lowest status property
 * @param items
 */
const getLowStatusItems = items => items.filter(i => i.status <= getALowStatusItem(items).status)

/**
 * Given an array of items, return all of the items which have a status less than 100, but more than 0
 * @param items
 */
const getBrokenItems = items => items.filter(i => i.status < 100 && i.status > 0)

/**
 * Return all of the players which have broken ships.
 * @param players
 */
const getBrokenShipsPlayers = players => players.filter(p => getBrokenItems(p.shipFleet).length)

/**
 * Return the number of damaged ship parts. Performs math on the number of parts vs the damaged status.
 * @param total
 * @param status
 */
const numDamangedParts = (total, status) => total - Math.ceil(((status / 100) * total))

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
    let unit = ship()
    let cur = start
    for (let i = 0; i < length; ++i) {
        unit.parts.push(setShip(matrix, cur, view))
        cur = nextCell(cur, dir)
    }
    return unit
}

/**
 * Get a qualifying start and direction point for a ship of specified length
 * @param matrix
 * @param shipLength
 * @param lengths
 * @param useZ
 * @returns {{start: *, dir}}
 */
const generateStartDir = (matrix, shipLength, lengths, useZ) => {
    // randomly select ship direction
    let dir = randDirection(useZ)
    // generate start and end coordinates based on direction and ensuring start is far enough from edge of matrix
    let start = point(randCoords(lengths.x, shipLength, dir.x), randCoords(lengths.y, shipLength, dir.y), randCoords(lengths.z, shipLength, dir.z))
    let end = point(start.x + dir.x * (shipLength - 1), start.y + dir.y * (shipLength - 1), start.z + dir.z * (shipLength - 1))
    return checkInBetween(start, end, matrix, checkIfShipCell) ? generateStartDir(matrix, shipLength, lengths, useZ) :
        {
            start: start,
            dir: dir
        }
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
    let shipFleet = [] // Create array to store generated ships
    let lengths = getAxisLengths(matrix) // store the length of each dimension
    // Loop through all of the provided lengths to create a ship for each
    for (let size in shipLengths) {
        let start = point(0, 0, 0) // default initial ship coordinates
        let end = point(0, 0, 0) // default final ship coordinates
        let useZ = shipLengths[size] <= lengths.z ? 1 : 0 // check if a ship will fit on the z axis
        // generate and test ship coordinates, if the test fails re-generate and test again till success
        let startDir = generateStartDir(matrix, shipLengths[size], lengths, useZ)
        shipFleet.push(buildShip(shipLengths[size], startDir.start, startDir.dir, matrix, view)) // once coordinates pass test, generate the ship and pass to the Fleet
    }
    return shipFleet
}
// shortcut for generating random fleet with the above function
const randomFleet = curry(generateRandomFleet)