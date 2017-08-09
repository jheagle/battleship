// Core DOM management functions
/**
 * Update a single DOMItem element with the provided attributes / styles / elementProperties
 * @param config
 * @returns {*}
 */
const updateElement = (config) => {
    if (!(config.element instanceof HTMLElement)) {
        return config
    }
    config.attributes = mapObject(config.attributes, (attr, key) => {
        if (key in config.element) {
            config.element[key] = attr
            return attr
        } else if (key === 'styles') {
            mapObject(attr, (param, k) => config.element.style[k] = param, config.element.style)
            return attr
        } else if (key === 'class') {
            config.element.className += config.element.className ? ` ${attr}` : attr
            return attr
        }
        config.element.setAttribute(key, attr)
        return attr
    })
    return config
}

/**
 * Generate HTML element data for each object in the matrix
 * WARNING: This is a recursive function.
 * @param config
 */
const updateElements = (config) => {
    config = updateElement(config)
    config.children.map(child => updateElements(child))
}

/**
 * Create an HTML element based on the provided attributes and return the element as an Object.
 * @param config
 */
const generateElement = (config) => {
    config.element = document.createElement(config.tagName)
    return updateElement(config).element
}

/**
 * Generate HTML element data for each object in the matrix
 * WARNING: This is a recursive function.
 * @param item
 * @param parent
 */
const bindElements = (item, parent = documentItem) => DOMItem(item, {
    tagName: item.tagName || 'div',
    attributes: item.attributes || {styles: {}},
    element: generateElement(item) || HTMLElement,
    parentItem: parent,
    children: item.children ? item.children.map(child => bindElements(child, item)) : []
})

/**
 * Append each HTML element data in a combined HTML element
 * WARNING: This is a recursive function.
 * @param item
 * @returns {*}
 */
const buildHTML = (item) => {
    item.children.map(i => item.element.appendChild(buildHTML(i)))
    return item.element
}

/**
 * Select the parent HTML element for appending new elements
 * @param item
 * @param parent
 * @returns {*}
 */
const appendHTML = (item, parent = documentItem.body) => {
    if (Array.isArray(item)) {
        item.map(i => parent.children.push(i))
    } else {
        parent.children.push(item)
    }
    buildHTML(parent)
    return item
}

/**
 * Reverse of appendHTML, remove an element
 * @param item
 * @param parent
 * @returns {Array.<HTMLElement>}
 */
const removeChild = (item, parent = documentItem.body) => {
    parent.element.removeChild(item.element)
    return parent.children.splice(parent.children.indexOf(item), 1)
}

/**
 *
 * @param options
 * @returns {boolean}
 */
const listenerOptions = options => {
    if (typeof listenerOptions.supportsOptions === 'undefined') {
        listenerOptions.supportsOptions = true
        try {
            window.addEventListener('test', null, {capture: false, once: false, passive: false})
        } catch (err) {
            listenerOptions.supportsOptions = false
        }
    }
    return (typeof options === 'object' && listenerOptions.supportsOptions) ? options : false
}

/**
 *
 * @param trigger
 * @param elem
 * @param fn
 * @param options
 * @returns {*}
 */
const assignListener = (trigger, elem, fn, options) =>
    elem.addEventListener ? elem.addEventListener(trigger, fn, listenerOptions(options)) :
        elem.attachEvent ? elem.attachEvent(`on${trigger}`, fn) :
            elem[`on${trigger}`] = fn

/**
 * Attach an event listener to each cell in the matrix.
 * Accepts an unlimited number of additional arguments to be passed to the action function.
 * WARNING: This is a recursive function.
 * @param item
 * @param options
 * @param extra
 * @returns {*}
 */
const bindListeners = (item, options = false, ...extra) => {
    if (item.eventListeners && Object.keys(item.eventListeners).length && item.element instanceof HTMLElement) {
        item.element = mapObject(item.eventListeners, (attr, key) => assignListener(key, item.element, (e) => attr(e, item, ...extra), options), item.element)
    } else {
        item.children.map(i => bindListeners(i, options, ...extra))
    }
    return item
}

/**
 * A selector function for retrieving existing child DOMItems from the given parent item.
 * This function will check all the children starting from item, and scan the attributes
 * property for matches. The return array contains children matching from all levels.
 * WARNING: This is a recursive function.
 * @param attr
 * @param value
 * @param item
 * @returns {Array}
 */
const getChildrenFromAttribute = (attr, value, item = documentItem.body) => (item.attributes[attr] && item.attributes[attr] === value) ? item.children.reduce((a, b) => a.concat(getChildrenFromAttribute(attr, value, b)), []).concat([item]) : item.children.reduce((a, b) => a.concat(getChildrenFromAttribute(attr, value, b)), [])

/**
 * Helper for getting all DOMItems starting at parent and having specified class attribute
 */
const getChildrenByClass = curry(getChildrenFromAttribute)('class')

/**
 * Helper for getting all DOMItems starting at parent and having specified name attribute
 */
const getChildrenByName = curry(getChildrenFromAttribute)('name')

/**
 * Get the upper parentItem for the provided child. (usually this is a documentItem reference)
 * WARNING: This is a recursive function.
 * @param item
 */
const getTopParentItem = item => Object.keys(item.parentItem).length ? getTopParentItem(item.parentItem) : item

/**
 * This is a shortcut for building the specified HTML elements and appending them to the DOM
 * with associated listeners.
 * The final two arguments are specific for adding event listeners with options and additional arguments
 * eventListeners functions.
 * @param DOMTemplate
 * @param parent
 * @param options
 * @param args
 * @returns {*}
 */
const renderHTML = (DOMTemplate, parent = documentItem, options = false, ...args) => bindListeners(appendHTML(bindElements(DOMTemplate, parent), parent.body), options, ...inArray(args, parent) ? args : [parent])