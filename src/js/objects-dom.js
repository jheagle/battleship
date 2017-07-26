// Core DOM Objects
/**
 * This is the basic Object for representing the DOM in a virtual perspective
 * @param attributes
 * @constructor
 */
const DOMItem = (...attributes) => mergeObjectsMutable({
    attributes: {
        element: 'div',
        styles: {}
    },
    elementProperties: {},
    element: {},
    eventListeners: {},
    parentItem: {},
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
    let rootItem = DOMItem({
        attributes: {
            element: 'html'
        },
        element: document,
        children: children,
        head: children[0],
        body: children[1],
    })
    return DOMItem(rootItem, {
        children: rootItem.children.map(child => DOMItem(child, {parentItem: rootItem}))
    })
}

/**
 * Create reference for storing document changes
 */
let documentItem = documentDOMItem()