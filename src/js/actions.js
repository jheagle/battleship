const configureHtml = (config) => {
    if (config.isHit) {
        config.styles.backgroundColor = config.hasShip ? 'red' : 'white';
    }
    addElementStyles(config.element, config.styles);
    // if ( Object.keys( config.events ).length ) {
    //   Object.keys( config.events ).forEach( ( eventName ) => {
    //     let args = Object.keys(config.events[ eventName ].args).map((arg) => arg === 'point'? config.point: config.events[ eventName ].args[ arg ]);
    //     console.log(args);
    //     return config.element.addEventListener(eventName, config.events[ eventName ].f(...args) );
    //   });
    // }
    return config;
}

const addElementStyles = (elem, styles) => (Object.keys(styles).length && elem.style) ? Object.keys(styles).forEach((styleName) => elem.style[styleName] = styles[styleName]) : elem;

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

const processHtml = (types, matrix, parent = document.body) => parent.appendChild(recurseHtml(types, matrix));
const generateHtml = curry(processHtml);
const createTable = generateHtml(boardHTML());

const updateCell = (config, matrix, x, y) => configureHtml(mergeObjects(matrix[y][x], config));
const alterCell = curry(updateCell);
const update3dCell = (config, matrix, x, y, z) => {
    return configureHtml(mergeObjects(matrix[z][y][x], config));
}
const alter3dCell = curry(update3dCell);

const setViewShip = alter3dCell(mergeObjects(shipTile(), {styles: {backgroundColor: '#777',},}));
const setHiddenShip = alter3dCell(shipTile());
const setShip = (matrix, point, view) => view ? setViewShip(matrix, point.x, point.y, point.z) : setHiddenShip(matrix, point.x, point.y, point.z);
const setHit = alter3dCell(hitTile());

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

const endGame = (winner) => {

}

const nextAttacker = (player, players, i, foundAttacker, hitShip, sunkShip) => {
    if (foundAttacker && player.status > 0) {
        updatePlayer(player, hitShip, sunkShip);
        return !foundAttacker;
    }
    if (player.attacker) {
        updatePlayer(player, hitShip, sunkShip);
        if (i >= players.length - 1) {
            updatePlayer(players[0], hitShip, sunkShip);
            return foundAttacker;
        }
        return !foundAttacker;
    }
    return foundAttacker;
}

const updateScore = (player, hitShip, sunkShip, players, playersLost) => {
    if (player.status <= 0) {
        playersLost.push(player);
    }
    players = players.filter((p) => p.status > 0);
    let foundAttacker = false;
    if (players.length < 2) {
        endGame(players[0]);
    }
    return players.map((p, i) => {
        foundAttacker = nextAttacker(p, players, i, foundAttacker, hitShip, sunkShip);
        return p;
    });
}

const attackFleet = (matrix, target, player, players, playersLost) => {
    if (player.status <= 0 || player.attacker) {
        return players;
    }
    let hitCell = setHit(matrix, target.x, target.y, target.z);
    if (hitCell.hasShip) {
        let status = 0;
        let sunkShip = 0;
        let hitShip = {};
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
        if (hitShip.status <= 0) {
            sunkShip = hitShip.parts.length;
        }
        return updateScore(player, hitCell.hasShip, sunkShip, players, playersLost);
    }
    return updateScore(player, hitCell.hasShip, false, players, playersLost);
}

const launchAttack = curry(attackFleet);