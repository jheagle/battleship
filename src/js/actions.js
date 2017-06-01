// Functions used for live updating
/**
 *
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
 *
 * @param elem
 * @param styles
 */
const addElementStyles = (elem, styles) => (Object.keys(styles).length && elem.style) ? Object.keys(styles).forEach((styleName) => elem.style[styleName] = styles[styleName]) : elem;

/**
 *
 * @param elemAttr
 * @returns {Element}
 */
const generateElement = (elemAttr) => {
    let elem = document.createElement(elemAttr.type);
    Object.keys(elemAttr).map((attr) => {
        if (attr !== 'type' && attr !== 'styles') {
            elem.setAttribute(attr, elemAttr[attr]);
        }
    });
    if (elemAttr.styles) {
        addElementStyles(elem, elemAttr.styles);
    }
    return elem;
}

/**
 *
 * @param types
 * @param matrix
 * @param depth
 * @param layer
 * @returns {*}
 */
const recurseHtml = (types, matrix, depth = 0, layer = 0) => {
    let nextDepth = (i) => nextIndex(types, i);
    if (depth === 0) {
        let elems = [];
        if (Array.isArray(types[depth])) {
            elems = types[depth].map(generateElement);
        }
        matrix.forEach((a) => elems[elems.length - 1].appendChild(recurseHtml(types, a, nextDepth(depth), layer++)));
        let prevElem = false;
        elems.forEach((elem) => {
            if (prevElem) {
                prevElem.appendChild(elem);
            }
            prevElem = elem;
        });
        return elems[0];
    }
    if (depth === 1 && types.length > 2) {
        types[depth].styles.zIndex = layer;
    }
    if (Array.isArray(matrix)) {
        let el = generateElement(types[depth]);
        matrix.forEach((a) => el.appendChild(recurseHtml(types, a, nextDepth(depth), layer)));
        return el;
    }
    let el = generateElement(types[depth]);
    if (matrix instanceof Object) {
        matrix = configureHtml(mergeObjects(matrix, {element: el,}));
    }
    return el;
}

/**
 *
 * @param types
 * @param matrix
 * @param parent
 */
const processHtml = (types, matrix, parent = document.body) => parent.appendChild(recurseHtml(types, matrix));
const generateHtml = curry(processHtml);
const createTable = generateHtml(boardHTML());

/**
 *
 * @param config
 * @param matrix
 * @param x
 * @param y
 * @param z
 * @returns {*}
 */
const update3dCell = (config, matrix, x, y, z) => {
    return configureHtml(mergeObjects(matrix[z][y][x], config));
}
const alter3dCell = curry(update3dCell);
const setViewShip = alter3dCell(mergeObjects(shipTile(), {styles: {backgroundColor: '#777',},}));
const setHiddenShip = alter3dCell(shipTile());

/**
 *
 * @param matrix
 * @param point
 * @param view
 */
const setShip = (matrix, point, view) => view ? setViewShip(matrix, point.x, point.y, point.z) : setHiddenShip(matrix, point.x, point.y, point.z);
const setHit = alter3dCell(hitTile());

/**
 *
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
 *
 * @param winner
 * @returns {[*]}
 */
const endGame = (winner) => {
    return [winner];
}

/**
 *
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
 *
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
 *
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