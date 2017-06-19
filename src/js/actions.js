// Functions used for live updating
/**
 * Update view based on actions performed
 * @param config
 * @returns {*}
 */
const configureHtml = (config) => {
    // Update cell colour once it has been hit
    if (config.isHit) {
        config.styles.backgroundColor = config.hasShip ? 'red' : 'white';
    }
    // Add any other style changes to the cell
    addElementStyles(config.element, config.styles);
    return config;
}

/**
 * Given a cell and new config data, update the data of the cell
 * @param config
 * @param matrix
 * @param x
 * @param y
 * @param z
 * @returns {*}
 */
const update3dCell = (config, matrix, x, y, z) => {
    return configureHtml(mergeObjects(matrix.z[z].y[y].x[x], config));
}
const alter3dCell = curry(update3dCell);
const setViewShip = alter3dCell(mergeObjects(shipTile(), {styles: {backgroundColor: '#777',},}));
const setHiddenShip = alter3dCell(shipTile());

/**
 * Set a specified point to be part of a ship
 * @param matrix
 * @param point
 * @param view
 */
const setShip = (matrix, point, view) => view ? setViewShip(matrix, point.x, point.y, point.z) : setHiddenShip(matrix, point.x, point.y, point.z);
const setHit = alter3dCell(hitTile());

/**
 * Track player stats such as attacks and turns
 * @param player
 * @param playAgain
 * @param sunkShip
 */
const updatePlayer = (player, playAgain, sunkShip = 0) => {
    if (player.attacker) {
        if (playAgain) {
            ++player.attacks.hit;
        } else {
            ++player.attacks.miss;
        }
        if (sunkShip) {
            ++player.attacks.sunk;
        }
    }
    if (!playAgain) {
        player.attacker = !player.attacker
        if (player.attacker) {
            ++player.turnCnt;
        }
    }
    return player;
}

/**
 * Final state once a game is won (only one player remains)
 * @param winner
 * @returns {[*]}
 */
const endGame = (winner) => {
    return [winner];
}

/**
 *
 * @param attacker
 * @param players
 * @param playAgain
 * @returns {*}
 */
const getNextAttacker = (attacker, players, playAgain) => {
    let attackerIndex = players.indexOf(attacker);
    let nextAttacker = {};
    do {
        nextAttacker = (players.length > 1 && attackerIndex >= players.length - 1) ? players[0] : players[++attackerIndex];
    } while (nextAttacker.status <= 0);
    return playAgain ? attacker : updatePlayer(nextAttacker, playAgain);
}

/**
 * Update all game stats after each player round
 * @param player
 * @param hitShip
 * @param sunkShip
 * @param players
 * @param playersLost
 * @returns {*}
 */
const updateScore = (player, hitShip, sunkShip, players, playersLost, target) => {
    if (player.status <= 0) {
        playersLost.push(player);
    }
    players = players.filter((p) => p.status > 0);
    let attacker = players.reduce((p1, p2) => p1.attacker ? p1 : p2);
    attacker = updatePlayer(attacker, hitShip, sunkShip);
    if (players.length < 2) {
        return endGame(players[0]);
    }
    let nextAttacker = getNextAttacker(attacker, players, hitShip);
    if (nextAttacker.isRobot) {
        computerAttack(nextAttacker, players, playersLost, hitShip ? target : false);
    }
    return players;
}

/**
 * Perform attack on an enemy board / cell
 * @param matrix
 * @param target
 * @param player
 * @param players
 * @param playersLost
 * @returns {*}
 */
const attackFleet = (target, matrix, player, players, playersLost) => {
    if (player.status <= 0 || player.attacker) {
        return players;
    }
    let hitCell = setHit(matrix, target.x, target.y, target.z);
    let hitShip = {};
    if (hitCell.hasShip) {
        let status = 0;
        player.shipFleet.map((ship) => {
            if (ship.hasOwnProperty('parts')) {
                let healthy = ship.parts.filter((part) => {
                    if (part.point === target) {
                        hitShip = ship;
                    }
                    return !part.isHit;
                });
                ship.status = healthy.length / ship.parts.length * 100;
            }
            status += ship.status;
            return ship;
        });
        player.status = status / player.shipFleet.length;
    }
    let sunkShip = hitShip.status <= 0 ? hitShip.parts.length : 0;
    return updateScore(player, hitCell.hasShip, sunkShip, players, playersLost, target);
}

const launchAttack = curry(attackFleet);