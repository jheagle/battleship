// Core DOM Objects
/**
 * This is the basic Object for representing the DOM in a virtual perspective
 * @param attributes
 * @returns {*}
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
 * @returns {[*,*]}
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
 * @param children
 * @returns {*}
 */
const initRoot = children => DOMItem({
    tagName: 'html',
    attributes: {},
    element: document,
    children: children,
    head: children[0],
    body: children[1],
})

/**
 * Return a DOMItem style reference to the document. The rootItem argument is a
 * system function and not necessary to implement.
 * @param rootItem
 * @returns {*}
 */
const documentDOMItem = (rootItem = initRoot(initChildren())) => DOMItem(rootItem, {
    children: rootItem.children.map(child => DOMItem(child, {parentItem: rootItem}))
})

/**
 * Create reference for storing document changes
 */
const documentItem = documentDOMItem()