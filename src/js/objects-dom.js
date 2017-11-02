// Core DOM Objects
/**
 * This is the standard definition of a listenerFunction to be used
 * @callback listenerFunction
 * @param {Event} e - The event object passed to the listener
 * @param {DOMItem} target - The element which triggered the event
 * @param {...*} [args] - Optional args as required by the listener
 */

/**
 * An EventListener Object to be appended to the element within the DOMItem
 * @typedef {Object} EventListener
 * @property {string} listenerFunc - A string function name matching an existing {@link listenerFunction}.
 * @property {Object} listenerArgs - Additional args required for the listener function
 * @property {(boolean|Object)} listenerOptions - Provides support for options parameter of addEventListener, or false for default
 */

/**
 * DOMItem defines the structure for a single element in the DOM
 * @typedef {Object} DOMItem
 * @property {string} tagName - This is any valid HTMLElement tagName
 * @property {Object.<string, string|Object>} attributes - All potential HTML element attributes can be defined here (including the defaulted styles object)
 * @property {(Object|HTMLElement)} element - A reference to an existing HTML element will be stored here (default empty object)
 * @property {Object.<Event, EventListener>} eventListeners - An object holding all events to be registered for the associated element
 * @property {DOMItem} parentItem - A reference to the parent of this object
 * @property {Array.<DOMItem>} children - A reference to an array of child objects
 */

/**
 * This is the basic Object for representing the DOM in a virtual perspective. All incoming attributes will be merged to the specified format.
 * @param {...Object} attributes - DOMItem-like object(s) to be merged as a DOMItem
 * @returns {DOMItem}
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
 * DOMItemHead defines the structure for a single element in the DOM
 * @typedef {DOMItem} DOMItemHead
 * @property {string} [tagName=head] - This is set to the string head referring to the HTML element of the same name
 * @property {Object.<string, string|Object>} attributes - All potential HTML element attributes can be defined here
 * @property {HTMLHeadElement} element - A reference to the HTML head element
 * @property {Array.<DOMItem>} children - A reference to an array of child objects
 * @augments DOMItem
 */

/**
 * DOMItemBody defines the structure for a single element in the DOM
 * @typedef {DOMItem} DOMItemBody
 * @property {string} [tagName=body] - This is set to the string body referring to the HTML element of the same name
 * @property {Object.<string, string|Object>} attributes - All potential HTML element attributes can be defined here
 * @property {HTMLElement} element - A reference to the HTML body element
 * @property {Array.<DOMItem>} children - A reference to an array of child objects
 * @augments DOMItem
 */

/**
 * Initiate the children of Root / DocumentItem. This is a helper for {@link documentDOMItem}.
 * @returns {Array.<DOMItemHead|DOMItemBody>}
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
 * DOMItemRoot defines the structure for a single element in the DOM
 * @typedef {DOMItem} DOMItemRoot
 * @property {string} [tagName=html] - This is set to the string html referring to the HTML element of the same name
 * @property {Object} attributes - Empty object as attributes placeholder
 * @property {HTMLDocument} element - A reference to the entire Document
 * @property {Object.<string, listenerFunction>} EventListeners - all registered listeners stored as listener name and function pairs
 * @property {Array.<DOMItemHead|DOMItemBody>} children - Two references: for head and body
 * @property {DOMItemHead} head - A specific reference to head item
 * @property {DOMItemBody} body - A specific reference to body item
 * @augments DOMItem
 */

/**
 * Initiate the Root for DocumentItem. This is primary a helper for {@link documentDOMItem}.
 * @param {Array.<DOMItemHead|DOMItemBody>} children - Provide an array of Head and Body (usually via {@link initChildren})
 * @param {Array.<listenerFunction>} listeners - An array of all event listeners to be registered in the DOM
 * @returns {DOMItemRoot}
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
 * @param {Array.<listenerFunction>} listeners - An array of all event listeners to be registered in the DOM
 * @param {Object} [rootItem=DOMItemRoot] - This is a reference to DOMItemRoot which will be defaulted with {@link initRoot}
 * @returns {DOMItemRoot}
 */
const documentDOMItem = (listeners = [], rootItem = initRoot(initChildren(), listeners)) => DOMItem(rootItem, {
    children: rootItem.children.map(child => DOMItem(child, {parentItem: rootItem}))
})

/**
 * Create reference for storing document changes
 * @type {DOMItem}
 */
const documentItem = documentDOMItem()
