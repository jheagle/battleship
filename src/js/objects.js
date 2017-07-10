// Utility Objects
/**
 * This is the basic Object for representing the DOM in a virtual perspective
 * @param attributes
 * @constructor
 */
const DOMItem = (...attributes) => mergeObjects({
    attributes: {
        element: 'div',
        styles: {}
    },
    element: {},
    eventListeners: {},
    children: []
}, ...attributes)

/**
 * Return a DOMItem style reference to the document
 */
const documentDOMItem = () => {
    let children = [
        DOMItem({
            attributes: {
                element: 'head'
            },
            element: document.head,
            children: []
        }),
        DOMItem({
            attributes: {
                element: 'body'
            },
            element: document.body,
            children: []
        }),
    ]
    return DOMItem({
        attributes: {
            element: 'html'
        },
        element: document,
        children: children,
        head: children[0],
        body: children[1],
    })
}

/**
 * Create reference for storing document changes
 */
let documentItem = documentDOMItem()

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
 *
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
    attributes: {
        class: 'matrix'
    },
    children: buildArray(DOMItem(coordinate('z'), {
        attributes: {
            class: 'layer'
        },
        children: buildArray(DOMItem(coordinate('y'), {
            attributes: {
                class: 'row'
            },
            children: buildArray(DOMItem(coordinate('x'), {
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

/**
 * Basic HTML configuration for displaying a 2 dimensional matrix as a table
 */
const tableHTML = () => ( {
    base: [
        {
            element: 'table',
            class: 'matrix'
        },
    ],
    z: {
        element: 'tbody',
    },
    y: {
        element: 'tr',
        class: 'row',
    },
    x: {
        element: 'td',
        class: 'column',
    },
})