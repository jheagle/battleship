// Game specific objects
/**
 * Default properties for a tile in the battleship game.
 */
const gameTile = () => ( {
    hasShip: false,
    isHit: false,
    eventListeners: {
        click: attackListener
    },
});

/**
 * Set the style for tiles representing water.
 */
const waterTile = () => mergeObjects(gameTile(), tile());

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