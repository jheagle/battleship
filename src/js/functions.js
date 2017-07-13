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
 *
 * @param pnt
 */
const filterAdjacentPoints = pnt => ((pnt.z % 2 === 0 && ((pnt.x % 2 === 0 && pnt.y % 2 === 0) || (pnt.x % 2 !== 0 && pnt.y % 2 !== 0))) || (pnt.z % 2 !== 0 && ((pnt.x % 2 !== 0 && pnt.y % 2 === 0) || (pnt.x % 2 === 0 && pnt.y % 2 !== 0))))

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

/**
 * Create players and associated properties.
 * Takes an integer for the number of players to generate.
 * Returns an array of players.
 * @param humans
 * @param robots
 * @param parent
 * @param players
 * @returns {Array}
 */
const buildPlayers = (humans, robots = 0, parent = documentItem, players = []) => {
    if (humans < 1 && robots < 1) {
        return players
    }
    // 1. generate matrix for player board
    // 2. bind point data to each item in matrix
    // 3. bind HTML element data to each item in matrix
    // 4. bind event listeners to each board tile
    // 5. append the elements as HTML
    let player = bindElements(bindPointData(mergeObjects(playerSet(`Player ${players.length + 1}`), {isRobot: humans <= 0}, square(waterTile(), 10))), parent)
    player.shipFleet = defaultFleet(player, false) // generate fleet of ships
    player = bindListeners(player, player, players)
    players.push(player)
    return buildPlayers(--humans, humans < 0 ? --robots : robots, parent, players)
}

/**
 * Logic for setting up and starting a new round
 * (selects random start player and calls computer attack if it is AI starting)
 * @param e
 * @param mainForm
 * @param parent
 * @returns {boolean}
 */
const beginRound = (e, mainForm, parent = documentItem) => {
    e.preventDefault()
    let humans = parseInt(getChildrenFromAttribute('name', 'human-players', mainForm)[0].element.value)
    let robots = parseInt(getChildrenFromAttribute('name', 'robot-players', mainForm)[0].element.value)
    if (humans < 0 || humans > 100 || robots < 0 || robots > 100) {
        return false
    }
    let firstGoesFirst = getChildrenFromAttribute('name', 'first-go-first', mainForm)[0].element.checked
    humans = humans < 0 ? 0 : humans
    if (humans === 0) {
        robots = robots < 2 ? 2 : robots
    }
    if (humans === 1) {
        robots = robots < 1 ? 1 : robots
    }
    removeChild(getChildrenFromAttribute('class', 'main-menu', parent.body)[0], parent.body)
    let players = buildPlayers(humans, robots, parent)
    appendHTML(players, appendHTML(bindElements(boards()), parent.body)) // create div for storing players
    let firstAttacker = updatePlayer(firstGoesFirst ? players[0] : players[Math.floor(Math.random() * players.length)])
    if (firstAttacker.isRobot) {
        computerAttack(firstAttacker, players, false)
    }
    return false
}

/**
 * The entry function
 * @param parent
 */
const main = (parent = documentItem) => {
    for (let i = parent.body.children.length - 1; i >= 0; --i) {
        removeChild(parent.body.children[i], parent.body)
    }
    bindListeners(mergeObjects(getChildrenFromAttribute('class', 'main-menu-form', appendHTML(bindElements(mainMenu(), parent.body), parent.body))[0], {eventListeners: {submit: beginRound}}), parent)
    return parent
}

const restart = (e, button, parent) => main(parent)