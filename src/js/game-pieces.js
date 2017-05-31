// Game specific objects
const shipViewTile = () => ( {
    hasShip: true,
    styles: {
        backgroundColor: '#777',
    }
} );

const gameTile = () => ( {
    hasShip: false,
    isHit: false,
    styles: {
        border: '1px solid #333',
        backgroundColor: 'white',
        cursor: 'pointer',
    },
});

const waterTile = () => mergeObjects(tile(), gameTile(), {
    styles: {
        backgroundColor: 'blue',
    },
});

const shipTile = () => ( {
    hasShip: true,
} );

const ship = () => ( {
    status: 100,
    parts: [],
} );

const hitTile = () => ( {
    isHit: true,
} );

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

const playerSet = (name = '') => ({
    name: name,
    status: 100,
    turnCnt: 0,
    attacker: false,
    attacks: {hit: 0, miss: 0, sunk: 0},
    board: {},
    shipFleet: [],
});

const defaultFleet = fleetBuilder([5, 4, 3, 3, 2]);
