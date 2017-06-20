// Game specific objects
/**
 * Default properties for a tile in the battleship game.
 */
const gameTile = () => ( {
    hasShip: false,
    isHit: false,
    styles: {},
});

/**
 * Set the style for tiles representing water.
 */
const waterTile = () => mergeObjects(tile(), gameTile(), {
    styles: {},
});

/**
 * Set status and custom properties for tiles that have a ship
 */
const shipTile = () => ( {
    hasShip: true,
} );

/**
 * Store properties of a ship which includes an array of all associated ship tiles.
 */
const ship = () => ( {
    status: 100,
    parts: [],
} );

/**
 * Set the status of the tile to hit.
 */
const hitTile = () => ( {
    isHit: true,
} );

/**
 * Create 3D game board styles
 */
const boardHTML = () => ( {
    base: [{
        type: 'div',
        class: 'matrix',
        styles: {},
    }],
    z: {
        type: 'div',
        class: 'layer',
        styles: {},
    },
    y: {
        type: 'div',
        class: 'row',
        styles: {},
    },
    x: {
        type: 'div',
        class: 'column',
        styles: {},
    },
});

/**
 * Store the player attributes.
 * @param name
 */
const playerSet = (name = '') => ({
    name: name,
    isRobot: false,
    status: 100,
    turnCnt: 0,
    attacker: false,
    attacks: {hit: 0, miss: 0, sunk: 0},
    board: {},
    shipFleet: [],
});

/**
 * Create a default fleet using the standard battleship lengths.
 */
const defaultFleet = randomFleet([5, 4, 3, 3, 2]);
