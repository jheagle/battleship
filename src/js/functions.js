// Game specific functions
/**
 * Return the hasShip tile boolean at the specified point.
 * @param pnt
 * @param matrix
 * @returns {boolean}
 */
const checkIfShipCell = (pnt, matrix) => matrix.children[pnt.z].children[pnt.y].children[pnt.x].hasShip

/**
 * Return the isHit tile boolean at the specified point.
 * @param pnt
 * @param matrix
 * @returns {boolean}
 */
const checkIfHitCell = (pnt, matrix) => matrix.children[pnt.z].children[pnt.y].children[pnt.x].isHit

/**
 * Get all points which were not yet hit in the matrix.
 * @param matrix
 * @returns {Array}
 */
const getAllNonHitCells = matrix => getAllPoints(matrix).filter(p => !checkIfHitCell(p, matrix))

/**
 * Get the points surrounding a provided point which were not hit.
 * @param pnt
 * @param matrix
 * @returns {Array}
 */
const getAdjNonHitCells = (pnt, matrix) => adjacentPoints(pnt, matrix).filter(p => !checkIfHitCell(p, matrix))

/**
 * Get the points which have same edges with the provided point and are not hit.
 * @param pnt
 * @param matrix
 * @returns {Array}
 */
const getAdjEdgeNonHitCells = (pnt, matrix) => adjacentEdgePoints(pnt, matrix).filter(p => !checkIfHitCell(p, matrix))

/**
 * Given an array of items, return the item with the lowest status property (at the end of the array)
 * @param items
 * @returns {Array}
 */
const getALowStatusItem = items => items.reduce((a, b) => b.status <= a.status ? b : a)

/**
 * Given an array of items, return all items which have the lowest status property
 * @param items
 * @returns {Array}
 */
const getLowStatusItems = items => items.filter(i => i.status <= getALowStatusItem(items).status)

/**
 * Given an array of items, return all of the items which have a status less than 100, but more than 0
 * @param items
 * @returns {Array}
 */
const getBrokenItems = items => items.filter(i => i.status < 100 && i.status > 0)

/**
 * Return all of the players which have broken ships.
 * @param players
 * @returns {Array}
 */
const getBrokenShipsPlayers = players => players.filter(p => getBrokenItems(p.shipFleet).length)

/**
 * Return the number of damaged ship parts. Performs math on the number of parts vs the damaged status.
 * @param total
 * @param status
 * @returns {number}
 */
const numDamangedParts = (total, status) => total - Math.ceil(((status / 100) * total))

/**
 * Used to generate 'checkerboard' style attack by only attacking every non-edge-touching cell
 * @param pnt
 * @returns {boolean}
 */
const filterAdjacentPoints = pnt => ((pnt.z % 2 === 0 && ((pnt.x % 2 === 0 && pnt.y % 2 === 0) || (pnt.x % 2 !== 0 && pnt.y % 2 !== 0))) || (pnt.z % 2 !== 0 && ((pnt.x % 2 !== 0 && pnt.y % 2 === 0) || (pnt.x % 2 === 0 && pnt.y % 2 !== 0))))

/**
 * Generate a ship with the provided line of points.
 * The visibility of the ship on the board is determined by the view parameter.
 * @param shipInfo
 * @param line
 * @param matrix
 * @param view
 * @returns {{name: string, status: number, parts: Array}}
 */
const buildShip = (shipInfo, line, matrix, view = false) => mergeObjects(ship(shipInfo.name), {parts: line.map(p => setShip(matrix, p, view))})

/**
 *
 * @param lengths
 * @param shipLength
 */
const selectShipDirection = (lengths, shipLength) => randDirection([point(1, 0, 0), point(0, 1, 0), point(0, 0, 1)].filter(p => lengths[getAxisOfCoord(p, 1)] > shipLength))

/**
 *
 * @param lengths
 * @param shipLength
 * @param dir
 * @returns {{start: {x: number, y: number, z: number}, dir}}
 */
const randomStartDir = (lengths, shipLength, dir = selectShipDirection(lengths, shipLength)) => ({
    start: randomStart(shipLength, dir, lengths),
    dir: dir
})

/**
 * Get a qualifying start and direction point for a ship of specified length
 * WARNING: This is a recursive function.
 * @param matrix
 * @param shipLength
 * @param lengths
 * @param startDir
 * @returns {[null,null]}
 */
const generateStartEnd = (matrix, shipLength, lengths, startDir = randomStartDir(lengths, shipLength)) =>
    getHighAbsoluteCoord(startDir.dir) === 0 ?
        [point(0, 0, 0), point(0, 0, 0)] :
        checkInBetween(...[startDir.start, lineEndPoint(startDir.start, shipLength, startDir.dir)], matrix, checkIfShipCell) ?
            generateStartEnd(matrix, shipLength, lengths) :
            [startDir.start, lineEndPoint(startDir.start, shipLength, startDir.dir)]

/**
 * Create a series of randomly placed ships based on the provided shipLengths.
 * The optional parameter view will set the visibility of the ships.
 * @param {Array} ships
 * @param {Object} matrix
 * @param {boolean} [view=false]
 * @returns {Array}
 */
const generateRandomFleet = (ships, matrix, view = false) => ships.map(ship => buildShip(ship, getPointsLine(...generateStartEnd(matrix, ship.size, getAxisLengths(matrix))), matrix, view))

/**
 * Create players and associated properties.
 * Takes an integer for the number of players to generate.
 * Returns an array of players.
 * WARNING: This is a recursive function.
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
    let firstAttacker = updatePlayer(firstGoesFirst ? players[0] : players[randomInteger(players.length)])
    if (firstAttacker.isRobot) {
        computerAttack(firstAttacker, players)
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
