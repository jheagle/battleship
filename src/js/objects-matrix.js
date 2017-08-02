// Core Matrix Objects
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
} )

/**
 * A default tile in the matrix
 */
const tile = () => ( {
    point: {},
} )

/**
 * Add a name for coordinates (x / y / z)
 * @param axisName
 */
const coordinate = (axisName) => ({
    axis: axisName
})

/**
 * Create a 3d matrix of i with x by y by z size,
 * add additional objects for each layer as well
 * @param i
 * @param x
 * @param y
 * @param z
 * @param props
 */
const matrix = (i, x, y, z = 1, ...props) => DOMItem({
    tagName: 'div',
    attributes: {
        class: 'matrix'
    },
    children: buildArray(DOMItem(coordinate('z'), {
        tagName: 'div',
        attributes: {
            class: 'layer'
        },
        children: buildArray(DOMItem(coordinate('y'), {
            tagName: 'div',
            attributes: {
                class: 'row'
            },
            children: buildArray(DOMItem(coordinate('x'), {
                tagName: 'div',
                attributes: {
                    class: 'column'
                }
            }, ...props, i), x)
        }, ...props), y)
    }, ...props), z)
})


/**
 * Return a single layer matrix where x and y are equal
 * @param i
 * @param size
 */
const square = (i, size) => matrix(i, size, size)

/**
 * Return a matrix where x, y, and z are equal
 * @param i
 * @param size
 */
const cube = (i, size) => matrix(i, size, size, size)
