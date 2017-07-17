// Functions used for live updating
/**
 * Update view based on actions performed
 * @param config
 * @param isRobot
 * @returns {*}
 */
const configureHtml = (config, isRobot) => {
    // Update cell colour once it has been hit
    if (config.isHit) {
        config.attributes.styles.backgroundColor = config.hasShip ? 'red' : 'white'
    }
    // Add any other style changes to the cell
    if (isRobot) {
        attackFleet.isLocked = true
        queueTimeout(() => {
            config.element = addElementStyles(config.element, config.attributes.styles)
            attackFleet.isLocked = false
            return config
        }, 0)
    } else {
        config.element = addElementStyles(config.element, config.attributes.styles)
    }
    return config
}

/**
 * Given a cell and new config data, update the data of the cell
 * @param config
 * @param matrix
 * @param x
 * @param y
 * @param z
 * @param isRobot
 */
const update3dCell = (config, matrix, x, y, z, isRobot = false) => configureHtml(mergeObjects(matrix.children[z].children[y].children[x], config), isRobot)
const alter3dCell = curry(update3dCell)
const setViewShip = alter3dCell(mergeObjects(shipTile(), {attributes: {styles: {backgroundColor: '#777',},},}))
const setHiddenShip = alter3dCell(shipTile())

/**
 * Set a specified point to be part of a ship
 * @param matrix
 * @param point
 * @param view
 */
const setShip = (matrix, point, view) => view ? setViewShip(matrix, point.x, point.y, point.z) : setHiddenShip(matrix, point.x, point.y, point.z)
const setHit = alter3dCell(hitTile())

/**
 * Track player stats such as attacks and turns
 * @param player
 * @param playAgain
 * @param sunkShip
 */
const updatePlayer = (player, playAgain, sunkShip = 0) => {
    if (player.attacker) {
        if (playAgain) {
            ++player.attacks.hit
        } else {
            ++player.attacks.miss
        }
        if (sunkShip) {
            ++player.attacks.sunk
        }
    }
    if (!playAgain) {
        player.attacker = !player.attacker
        attackFleet.isLocked = true
        if (player.attacker) {
            queueTimeout(() => {
                player.board.element = addElementStyles(player.board.element, {fontSize: '0.5rem'})
                player.board.children.map(l => l.children.map(r => r.children.map(c => addElementStyles(c.element, {
                    width: '17.5px',
                    height: '17.5px'
                }))))
                attackFleet.isLocked = false
            }, 400)
            ++player.turnCnt
        } else {
            player.board.element = addElementStyles(player.board.element, {fontSize: '1rem'})
            queueTimeout(() => {
                player.board.children.map(l => l.children.map(r => r.children.map(c => addElementStyles(c.element, {
                    width: '35px',
                    height: '35px'
                }))))
                attackFleet.isLocked = false
            }, 0)
        }
    }
    return player
}

/**
 * Final state once a game is won (only one player remains)
 * @param winner
 * @returns {[*]}
 */
const endGame = (winner) => {
    let parent = getTopParentItem(winner)
    bindListeners(appendHTML(bindElements(finalScore(getChildrenFromAttribute('class', 'boards', parent)[0].children), parent.body), parent.body), parent)
    return [winner]
}

/**
 *
 * @param attacker
 * @param players
 * @param attackerIndex
 * @returns {*}
 */
const findNextAttacker = (attacker, players, attackerIndex) => {
    let nextAttacker = (players.length > 1 && attackerIndex >= players.length - 1) ? players[0] : players[++attackerIndex]
    return nextAttacker.status > 0 ? nextAttacker : findNextAttacker(attacker, players, attackerIndex) // Only use players with a positive status
}

/**
 * Based on the current attacker and list of players, return the next attacker.
 * @param attacker
 * @param players
 * @param playAgain
 * @returns {*}
 */
const getNextAttacker = (attacker, players, playAgain) => {
    let attackerIndex = players.indexOf(attacker)
    // Get next player index, overflow to 0 if the current attacker is the last player.
    let nextAttacker = findNextAttacker(attacker, players, attackerIndex)
    return playAgain ? attacker : updatePlayer(nextAttacker, playAgain) // If attacker has playAgain, then just return current attacker
}

/**
 * Update all game stats after each player round
 * @param player
 * @param hitShip
 * @param sunkShip
 * @param players
 * @param target
 * @returns {*}
 */
const updateScore = (player, hitShip, sunkShip, players, target) => {
    players = players.filter((p) => p.status > 0)
    let attacker = players.reduce((p1, p2) => p1.attacker ? p1 : p2)
    attacker = updatePlayer(attacker, hitShip, sunkShip)
    if (players.length < 2) {
        return queueTimeout(() => endGame(players[0]), 400)
    }
    let nextAttacker = getNextAttacker(attacker, players, hitShip)
    if (nextAttacker.isRobot) {
        queueTimeout(computerAttack, 0, nextAttacker, players, hitShip ? target : false)
    }
    return players
}

/**
 * Perform attack on an enemy board / cell
 * @param target
 * @param player
 * @param players
 * @returns {*}
 */
const attackFleet = (target, player, players) => {
    attackFleet.isLocked = attackFleet.isLocked || false
    // Player cannot attack themselves (current attacker) or if they have bad status
    if (player.status <= 0 || player.attacker || attackFleet.isLocked) {
        return players
    }
    // Update cell to hit
    let hitCell = setHit(player.board, target.x, target.y, target.z, players.reduce((p1, p2) => p1.attacker ? p1 : p2).isRobot)
    let hitShip = false
    let sunkShip = 0
    if (hitCell.hasShip) {
        let status = 0
        // Update all ship status and player status by checking all ships / parts
        player.shipFleet.map((ship) => {
            // Get all healthy ships
            let healthy = ship.parts.filter((part) => {
                if (checkEqualPoints(part.point, target)) {
                    hitShip = ship
                }
                return !part.isHit
            })
            // Create percentage health status
            ship.status = healthy.length / ship.parts.length * 100
            // Create sum of ship status
            status += ship.status
            return ship
        })
        // Divide sum of ship statuses by number of ships to get player status
        player.status = status / player.shipFleet.length
    }
    if (hitShip) {
        player.playerStats = mergeObjects(player.playerStats, playerStats(player))
        updateElements(player.playerStats)
        // Check if the hit ship was sunk
        sunkShip = hitShip.status <= 0 ? hitShip.parts.length : 0
    }
    return updateScore(player, hitCell.hasShip, sunkShip, players, target)
}

const launchAttack = curry(attackFleet)
const attackListener = (e, target, ...extra) => attackFleet(target.point, ...extra)
