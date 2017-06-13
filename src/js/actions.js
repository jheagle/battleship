// Functions used for live updating
/**
 * Update view based on actions performed
 * @param config
 * @returns {*}
 */
const configureHtml = (config) => {
    if (config.isHit) {
        config.styles.backgroundColor = config.hasShip ? 'red' : 'white';
    }
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
const updatePlayer = (player, playAgain, sunkShip) => {
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
    }
}

/**
 * Final stat once a game is one (only one player remains)
 * @param winner
 * @returns {[*]}
 */
const endGame = (winner) => {
    return [winner];
}

/**
 * Control function for retrieving the next player to play
 * @param player
 * @param players
 * @param i
 * @param foundAttacker
 * @param hitShip
 * @param sunkShip
 * @returns {*}
 */
const nextAttacker = (player, players, i, foundAttacker, hitShip, sunkShip) => {
    if (foundAttacker && player.status > 0) {
        updatePlayer(player, hitShip, sunkShip);
        return !foundAttacker;
    }
    if (player.attacker) {
        updatePlayer(player, hitShip, sunkShip);
        if (players.length > 1 && i >= players.length - 1) {
            updatePlayer(players[0], hitShip, sunkShip);
            return foundAttacker;
        }
        return !foundAttacker;
    }
    return foundAttacker;
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
const updateScore = (player, hitShip, sunkShip, players, playersLost) => {
    if (player.status <= 0) {
        playersLost.push(player);
    }
    players = players.filter((p) => p.status > 0);
    let foundAttacker = false;
    return players.map((p, i) => {
        foundAttacker = nextAttacker(p, players, i, foundAttacker, hitShip, sunkShip);
        if (players.length < 2) {
            return endGame(players[0]);
        }
        return p;
    });
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
    return updateScore(player, hitCell.hasShip, sunkShip, players, playersLost);
}

const launchAttack = curry(attackFleet);