// Utility Objects
/**
 * Store the point data for an x, y, z matrix.
 * @param x
 * @param y
 * @param z
 */
const point = (x, y, z = 0) => ( {
    x: x,
    y: y,
    z: z,
} );

/**
 * A default tile in the matrix
 */
const tile = () => ( {
    point: {},
    styles: {
        width: '35px',
        height: '35px',
        backgroundColor: 'transparent',
    },
    element: {},
} );

/**
 * Create a 3d matrix of i with x by y by z size
 * @param i
 * @param x
 * @param y
 * @param z
 */
const matrix = (i, x, y, z = 1) => buildArray(buildArray(buildArray(i, x), y), z);

const coordinate = (axisName) => ({
    axis: axisName,
    element: {}
});

/**
 *
 */
const newMatrix = (i, x, y, z = 1, i2 = {}) => ({
    z: buildArray(mergeObjects(coordinate('z'), {
        y: buildArray(mergeObjects(coordinate('y'), {
            x: buildArray(mergeObjects(coordinate('x'), i, i2), x)
        }, i2), y)
    }, i2), z)
});


/**
 * Return a single layer matrix where x and y are equal
 * @param i
 * @param size
 */
const square = (i, size) => newMatrix(i, size, size);

/**
 * Return a matrix where x, y, and z are equal
 * @param i
 * @param size
 */
const cube = (i, size) => newMatrix(i, size, size, size);

/**
 * Basic HTML configuration for displaying a 2 dimensional matrix as a table
 */
const tableHTML = () => ( [
    [
        {
            type: 'table',
            class: 'matrix'
        },
        {
            type: 'tbody',
        }
    ],
    {
        type: 'tr',
        class: 'row',
    },
    {
        type: 'td',
        class: 'column',
    },
])