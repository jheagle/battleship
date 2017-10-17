// Core Matrix Objects
/**
 * Store the point data for an x, y, z matrix.
 * @param {number} x
 * @param {number} y
 * @param {number} [z=0]
 * @returns {{x: number, y: number, z: number}}
 */
const point = (x, y, z = 0) => {
    return ({
        x: x,
        y: y,
        z: z,
    })
}

/**
 * A default tile in the matrix
 * @returns {{point: {}}}
 */
const tile = () => ({
    point: {},
})

/**
 * Add a name for coordinates (x / y / z)
 * @param {string} axisName
 * @returns {{axis: string}}
 */
const coordinate = (axisName) => ({
    axis: axisName
})

/**
 * Create a 3d matrix of i with x by y by z size,
 * add additional objects for each layer as well
 * @param {Object} i
 * @param {number} x
 * @param {number} y
 * @param {number} [z=1]
 * @param {...Object} [props]
 * @returns {{tagName: string, attributes: {styles: {}}, element: {}, eventListeners: {}, parentItem: {}, children: Array}}
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
 * @param {Object} i
 * @param {number} size
 * @returns {{tagName: string, attributes: {styles: {}}, element: {}, eventListeners: {}, parentItem: {}, children: Array}}
 */
const square = (i, size) => matrix(i, size, size)

/**
 * Return a matrix where x, y, and z are equal
 * @param {Object} i
 * @param {number} size
 * @returns {{tagName: string, attributes: {styles: {}}, element: {}, eventListeners: {}, parentItem: {}, children: Array}}
 */
const cube = (i, size) => matrix(i, size, size, size)
