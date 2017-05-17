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
    hasShip: false,
    isHit: false,
    point: {},
    styles: {
        border: '1px solid #333',
        width: '35px',
        height: '35px',
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
    element: {},
} );

const lineContent = buildArray(tile());
const rectMatrix = (x, y) => buildArray(lineContent(x), y);
const rect3d = (x, y, z) => buildArray(rectMatrix(x, y), z);
const squareMatrix = (size) => rectMatrix(size, size);
const cube3d = (size) => rect3d(size, size, size);

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