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
const buildShip = (shipInfo, start, dir, matrix, view = false) => {
    let unit = ship(shipInfo.name)
    let cur = start
    for (let i = 0; i < shipInfo.size; ++i) {
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
 * @param useCoords
 * @returns {{start: *, dir}}
 */
const generateStartDir = (matrix, shipLength, lengths, useCoords) => {
    // randomly select ship direction
    let dir = randDirection(useCoords)
    // generate start and end coordinates based on direction and ensuring start is far enough from edge of matrix
    let start = point(randCoords(lengths.x, shipLength, dir.x), randCoords(lengths.y, shipLength, dir.y), randCoords(lengths.z, shipLength, dir.z))
    let end = point(start.x + dir.x * (shipLength - 1), start.y + dir.y * (shipLength - 1), start.z + dir.z * (shipLength - 1))
    return checkInBetween(start, end, matrix, checkIfShipCell) ? generateStartDir(matrix, shipLength, lengths, useCoords) :
        {
            start: start,
            dir: dir
        }
}

/**
 * Create a series of randomly placed ships based on the provided shipLengths.
 * The optional parameter view will set the visibility of the ships.
 * @param ships
 * @param matrix
 * @param view
 * @returns {Array}
 */
const generateRandomFleet = (ships, matrix, view = false) => {
    let shipFleet = [] // Create array to store generated ships
    let lengths = getAxisLengths(matrix) // store the length of each dimension
    // Loop through all of the provided lengths to create a ship for each
    for (let ship in ships) {
        let start = point(0, 0, 0) // default initial ship coordinates
        let end = point(0, 0, 0) // default final ship coordinates
        let useCoords = []
        if (ships[ship].size <= lengths.x) {
            useCoords.push(point(1, 0, 0))
        }
        if (ships[ship].size <= lengths.y) {
            useCoords.push(point(0, 1, 0))
        }
        if (ships[ship].size <= lengths.z) {
            useCoords.push(point(0, 0, 1))
        }
        if (useCoords.length) {
            // generate and test ship coordinates, if the test fails re-generate and test again till success
            let startDir = generateStartDir(matrix, ships[ship].size, lengths, useCoords)
            shipFleet.push(buildShip(ships[ship], startDir.start, startDir.dir, matrix, view)) // once coordinates pass test, generate the ship and pass to the Fleet
        }
    }
    return shipFleet
}

/**
 * Create players and associated properties.
 * Takes an integer for the number of players to generate.
 * Returns an array of players.
 * @param humans
 * @param robots
 * @param players
 * @returns {Array}
 */
const buildPlayers = (humans, robots = 0, players = []) => {
    if (humans < 1 && robots < 1) {
        return players
    }
    let player = playerSet({}, `Player ${players.length + 1}`)
    player.isRobot = humans <= 0
    player.board = bindPointData(square(waterTile(player, players), 10))
    player.shipFleet = defaultFleet(player.board, false) // generate fleet of ships
    player.playerStats = playerStats(player, `${Math.round(player.status * 100) / 100}%`)
    player.children = [player.board, player.playerStats]
    players.push(player)
    return buildPlayers(--humans, humans < 0 ? --robots : robots, players)
}

/**
 * Logic for setting up and starting a new round
 * (selects random start player and calls computer attack if it is AI starting)
 * @param e
 * @param mainForm
 * @returns {boolean}
 */
const beginRound = (e, mainForm) => {
    e.preventDefault()
    let parent = getTopParentItem(mainForm)
    let humans = parseInt(getChildrenByName('human-players', mainForm)[0].element.value)
    let robots = parseInt(getChildrenByName('robot-players', mainForm)[0].element.value)
    if (humans < 0 || humans > 100 || robots < 0 || robots > 100) {
        return false
    }
    let firstGoesFirst = getChildrenByName('first-go-first', mainForm)[0].element.checked
    humans = humans < 0 ? 0 : humans
    if (humans === 0) {
        robots = robots < 2 ? 2 : robots
    }
    if (humans === 1) {
        robots = robots < 1 ? 1 : robots
    }
    removeChild(getChildrenByClass('main-menu', parent.body)[0], parent.body)
    let players = renderHTML(boards(buildPlayers(humans, robots)), parent).children
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
    renderHTML(mainMenu(), parent)
    return parent
}

const restart = (e, button) => main(getTopParentItem(button))
