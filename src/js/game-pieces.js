// Game specific objects
/**
 * Default properties for a tile in the battleship game.
 */
const gameTile = () => ( {
    hasShip: false,
    isHit: false,
    styles: {
        border: '1px solid #333',
        backgroundColor: 'white',
        cursor: 'pointer',
    },
});

/**
 * Set the style for tiles representing water.
 */
const waterTile = () => mergeObjects(tile(), gameTile(), {
    styles: {
        backgroundColor: 'blue',
    },
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
const boardHTML = () => ( [
    [{
        type: 'div',
        class: 'matrix',
    }],
    {
        type: 'div',
        class: 'layer',
        styles: {
            display: 'inline-block',
            position: 'relative',
            margin: '0 auto',
        },
    },
    {
        type: 'div',
        class: 'row',
        styles: {
            display: 'flex',
        },
    },
    {
        type: 'div',
        class: 'column',
        styles: {
            display: 'inline-block',
        },
    },
]);

/**
 * Store the player attributes.
 * @param name
 */
const playerSet = (name = '') => ({
    name: name,
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
