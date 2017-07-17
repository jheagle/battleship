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
})

/**
 * Set the style for tiles representing water.
 */
const waterTile = () => mergeObjects(gameTile(), tile())

/**
 * Set status and custom properties for tiles that have a ship
 */
const shipTile = () => ( {
    hasShip: true,
} )

/**
 * Store properties of a ship which includes an array of all associated ship tiles.
 * @param name
 */
const ship = (name = '') => ( {
    name: name,
    status: 100,
    parts: [],
} )

/**
 * Set the status of the tile to hit.
 */
const hitTile = () => ( {
    isHit: true,
} )

/**
 * Store the player attributes.
 * @param board
 * @param name
 */
const playerSet = (board = {}, name = '') => ({
    name: name,
    isRobot: false,
    status: 100,
    turnCnt: 0,
    attacker: false,
    attacks: {hit: 0, miss: 0, sunk: 0},
    board: board,
    shipFleet: [],
    playerStats: {},
    attributes: {
        element: 'div',
        class: 'player'
    },
    children: [
        board
    ]
})

/**
 *
 * @param player
 */
const playerStats = (player = {}) => ({
    attributes: {
        element: 'div'
    },
    children: [
        {
            attributes: {
                element: 'ul'
            },
            children: player.shipFleet.map(ship => ({
                attributes: {
                    element: 'li',
                },
                elementProperties: {
                    innerHTML: `<strong>${ship.name} (${ship.parts.length}):</strong> ${Math.round(ship.status * 100) / 100}%`
                }
            }))
        }
    ]
})

/**
 * Create a default fleet using the standard battleship lengths.
 */
const defaultFleet = randomFleet([{name: 'Aircraft Carrier', size: 5}, {
    name: 'Battleship',
    size: 4
}, {name: 'Submarine', size: 3}, {name: 'Cruiser', size: 3}, {name: 'Destroyer', size: 2}])
