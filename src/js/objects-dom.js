// Core DOM Objects
/**
 * This is the basic Object for representing the DOM in a virtual perspective
 * @param {...Object} attributes
 * @returns {{tagName: string, attributes: {styles: {}}, element: {}, eventListeners: {}, parentItem: {}, children: Array}}
 * @constructor
 */
const DOMItem = (...attributes) => mergeObjectsMutable({
    tagName: 'div',
    attributes: {
        styles: {}
    },
    element: {},
    eventListeners: {},
    parentItem: {},
    children: []
}, ...attributes)

/**
 * Initiate the children of Root / DocumentItem. This is primary a helper for documentDOMItem.
 * @returns {[{tagName: string, attributes: {}, element: {HTMLHeadElement}, children: Array},{tagName: string, attributes: {}, element: {HTMLElement}, children: Array}]}
 */
const initChildren = () => [
    DOMItem({
        tagName: 'head',
        attributes: {},
        element: document.head,
        children: []
    }),
    DOMItem({
        tagName: 'body',
        attributes: {},
        element: document.body,
        children: []
    }),
]

/**
 * Initiate the Root for DocumentItem. This is primary a helper for documentDOMItem.
 * @param {Array} children
 * @param {Array.<function>} listeners
 * @returns {{tagName: string, attributes: {}, element: HTMLDocument, children: Array, head: {Object}, body: {Object}}}
 */
const initRoot = (children, listeners = []) => DOMItem({
    tagName: 'html',
    attributes: {},
    element: document,
    eventListeners: listeners.reduce((initial, listener) => mergeObjects(initial, {[`${listener.name}`]: listener}), {}),
    children: children,
    head: children[0],
    body: children[1],
})

/**
 * Return a DOMItem style reference to the document. The rootItem argument is a
 * system function and not necessary to implement.
 * @param {Array.<function>} listeners
 * @param {Object} [rootItem={{tagName: string, attributes: {}, element: HTMLDocument, children: Array, head: {Object}, body: {Object}}}]
 * @returns {{tagName: string, attributes: {styles: {}}, element: {}, eventListeners: {}, parentItem: {}, children: Array}}
 */
const documentDOMItem = (listeners = [], rootItem = initRoot(initChildren(), listeners)) => DOMItem(rootItem, {
    children: rootItem.children.map(child => DOMItem(child, {parentItem: rootItem}))
})

/**
 * Create reference for storing document changes
 * @type {Object}
 */
const documentItem = documentDOMItem()