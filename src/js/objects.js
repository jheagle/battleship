// Utility Objects
const point = (x, y, z = 0) => ( {
    x: x,
    y: y,
    z: z,
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