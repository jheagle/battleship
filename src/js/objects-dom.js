// Core DOM Objects
/**
 * This is the basic Object for representing the DOM in a virtual perspective
 * @param attributes
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
 * Return a DOMItem style reference to the document
 */
const documentDOMItem = () => {
    let children = [
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
    let rootItem = DOMItem({
        tagName: 'html',
        attributes: {},
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