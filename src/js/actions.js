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
            config = updateElement(config)
            attackFleet.isLocked = false
            return config
        }, 0)
    } else {
        config = updateElement(config)
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
const update3dCell = (config, matrix, x, y, z, isRobot = false) => configureHtml(mergeObjectsMutable(matrix.children[z].children[y].children[x], config), isRobot)

/**
 *
 */
const setViewShip = curry(update3dCell)(mergeObjects(shipTile(), {attributes: {styles: {backgroundColor: '#777',},},}))

/**
 *
 */
const setHiddenShip = curry(update3dCell)(shipTile())

/**
 *
 */
const setHit = curry(update3dCell)(hitTile())

/**
 * Set a specified point to be part of a ship
 * @param matrix
 * @param point
 * @param view
 */
const setShip = (matrix, point, view) => view ? setViewShip(matrix, point.x, point.y, point.z) : setHiddenShip(matrix, point.x, point.y, point.z)

/**
 *
 * @param player
 * @param status
 * @returns {*}
 */
const updatePlayerStats = (player, status = `${Math.round(player.status * 100) / 100}%`) => {
    player.playerStats = mergeObjects(player.playerStats, playerStats(player, status))
    updateElements(player.playerStats)
    return player
}

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
    let result = {}
    if (!playAgain) {
        player.attacker = !player.attacker
        attackFleet.isLocked = true
        if (player.attacker) {
            result = queueTimeout(() => {
                attackFleet.isLocked = false
                return player.board.children.map(l => l.children.map(r => r.children.map(c => updateElement(mergeObjects(c, {
                    attributes: {
                        styles: {
                            width: '17px',
                            height: '17px'
                        }
                    }
                })))))
            }, 400)
            ++player.turnCnt
        } else {
            result = queueTimeout(() => {
                attackFleet.isLocked = false
                return player.board.children.map(l => l.children.map(r => r.children.map(c => updateElement(mergeObjects(c, {
                    attributes: {
                        styles: {
                            width: '35px',
                            height: '35px'
                        }
                    }
                })))))
            }, 0)
        }
    }
    result = queueTimeout(() => updatePlayerStats(player, player.attacker ? 'ATTACKER' : `${Math.round(player.status * 100) / 100}%`), 0)
    return result.result || player
}

/**
 * Final state once a game is won (only one player remains)
 * @param winner
 * @returns {[*]}
 */
const endGame = (winner) => {
    let parent = getTopParentItem(winner)
    let players = winner.parentItem.children
    players.map(player => updatePlayerStats(player))
    winner = updatePlayerStats(winner, 'WINNER')
    bindListeners(appendHTML(bindElements(finalScore(players), parent.body), parent.body), parent)
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
const getNextAttacker = (attacker, players, playAgain) => playAgain ? attacker : updatePlayer(findNextAttacker(attacker, players, players.indexOf(attacker)), playAgain)

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
        player = updatePlayerStats(player, `${Math.round(player.status * 100) / 100}%`)
        // Check if the hit ship was sunk
        sunkShip = hitShip.status <= 0 ? hitShip.parts.length : 0
    }
    return updateScore(player, hitCell.hasShip, sunkShip, players, target)
}

const attackListener = (e, target, ...extra) => attackFleet(target.point, ...extra)
