// Utility Objects
const point = (x, y, z = 0) => ( {
    x: x,
    y: y,
    z: z,
} );

const shipViewTile = () => ( {
    hasShip: true,
    styles: {
        backgroundColor: '#777',
    }
} );

const tile = () => ( {
    point: {},
    styles: {
        width: '35px',
        height: '35px',
        backgroundColor: 'transparent',
    },
    element: {},
} );

// const lineContent = buildArray(tile());
const rectMatrix = (i, x, y) => buildArray(buildArray(i, x), y);
const rect3d = (i, x, y, z = 0) => buildArray(rectMatrix(i, x, y), z);
const squareMatrix = (i, size) => rectMatrix(i, size, size);
const cube3d = (i, size) => rect3d(i, size, size, size);

const tableHTML = () => ( [
    [{
        type: 'table',
        class: 'matrix'
    },
        {
            type: 'tbody',
        }],
    {
        type: 'tr',
        class: 'row',
    },
    {
        type: 'td',
        class: 'column',
    },
])

const gameTile = () => ( {
    hasShip: false,
    isHit: false,
    styles: {
        border: '1px solid #333',
        backgroundColor: 'white',
        cursor: 'pointer',
    },
    // events: {
    //     click: {
    //         f: attackFleet,
    //         args: [
    //             'shipFleet',
    //             'point'  dc ,
    //         ],
    //     },
    // },
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
        styles: {
            display: 'inline-block',
            position: 'relative',
            width: '50%',
            margin: '0 auto',
        },
    }],
    {
        type: 'div',
        class: 'layer',
        styles: {
            display: 'block',
            position: 'absolute'
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