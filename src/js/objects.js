// Utility Objects
const point = (x, y) => ( {
    x: x,
    y: y,
} );

const point3d = (point, z) => Object.assign({}, point, {
    z: z
});

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
    // events: {
    //     click: {
    //         f: attackFleet,
    //         args: [
    //             'shipFleet',
    //             'point'  dc ,
    //         ],
    //     },
    // },
    element: {},
} );

const gameTile = () => mergeObjects(tile(), {
    hasShip: false,
    isHit: false,
    styles: {
        border: '1px solid #333',
        backgroundColor: 'blue',
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

// const lineContent = buildArray(tile());
const rectMatrix = (i, x, y) => buildArray(buildArray(i, x), y);
const rect3d = (i, x, y, z) => buildArray(rectMatrix(i, x, y), z);
const squareMatrix = (i, size) => rectMatrix(i, size, size);
const cube3d = (i, size) => rect3d(i, size, size, size);

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

const playerSet = (name = '') => ({
    name: name,
    status: 100,
    board: {},
    shipFleet: [],
});

const defaultFleet = fleetBuilder([5, 4, 3, 3, 2]);