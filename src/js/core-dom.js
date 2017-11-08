// Core DOM management functions
/**
 * Check if the provided HTMLElement has the provided attributes.
 * Returns a boolean, or an array of 1 / 0 / -1 based on the comparison status.
 * @param {HTMLElement} element
 * @param {string} key
 * @param {string} attr
 * @returns {boolean|Object.<string, number>}
 */
const elementHasAttribute = (element, key, attr) => {
    // if element is not a valid element then return false
    if (!(element instanceof HTMLElement))
        return false

    // check the key is a property of the element
    // compare current to new one
    if (key in element) {
        // For attributes which are objects or multi-part strings
        // -1 = remove attribute, 0 = no change, 1 = add attribute
        if (/^(style|className)$/.test(key)) {
            return compareArrays(typeof attr === 'string' ? element[key].split(' ') : Object.keys(element[key]), typeof attr === 'string' ? attr.split(' ') : Object.keys(attr))
        }
        return element[key] === attr
    }
    return (element.hasAttribute(key) && element.getAttribute(key) === attr)
}

/**
 * Given a DOMItem as config, this function will return the changes to be applied
 * to the stored element property.
 * @param {Object} config
 * @returns {Object}
 */
const elementChanges = config => {
    if (config.element.tagName.toLowerCase() !== config.tagName.toLowerCase()) {
        return generateElement(config)
    }
    config.attributes = filterObject(config.attributes, (attr1, key1) => filterObject(mapObject(config.attributes, (attr2, key2) => (typeof attr2 === 'object' || key2 === 'className') ? filterObject(elementHasAttribute(config.element, key2, attr2), (attr3) => attr3 === 1) : !elementHasAttribute(config.element, key2, attr2)), (attr4) => !!attr4)[key1])
    return config
}

/**
 * Update a single DOMItem element with the provided attributes / style / elementProperties
 * @param config
 * @returns {*}
 */
const updateElement = (config) => {
    if (config.element instanceof HTMLElement) {
        config.attributes = mapObject(elementChanges(config).attributes, (attr, key) => {
            if (key in config.element) {
                if (notEmptyObjectOrArray(attr)) {
                    return config.attributes[key] = mapObject(attr, (param, k) => config.element.style[k] = param, config.element.style)
                }
                return config.element[key] = attr
            }
            config.element.setAttribute(key, attr)
            return attr
        })
    }
    return config
}

/**
 * Generate HTML element data for each object in the matrix
 * WARNING: This is a recursive function.
 * @param config
 * @returns {*}
 */
const updateElements = (config) => {
    config = updateElement(config)
    config.children.map(child => updateElements(child))
    return config
}

/**
 * Create an HTML element based on the provided attributes and return the element as an Object.
 * @param config
 */
const generateElement = (config) => {
    config.element = document.createElement(config.tagName)
    return updateElement(config)
}

/**
 * Generate HTML element data for each object in the matrix
 * WARNING: This is a recursive function.
 * @param item
 * @param parent
 */
const bindAllElements = (item, parent = documentItem) => {
    mapObject(DOMItem(item), (prop) => prop, item)
    item.element = (item.element && item.element instanceof HTMLElement) ? item.element : bindElement(item).element
    item.parentItem = parent.body || parent
    item.children.map(child => bindAllElements(child, item))
    return item
}

/**
 * Generate HTML element data for each object in the matrix
 * WARNING: This is a recursive function.
 * @param item
 */
const bindElement = (item) => {
    if (!item.element || !(item.element instanceof HTMLElement)) {
        item.element = generateElement(item).element
    }
    return item
}

/**
 * Append each HTML element data in a combined HTML element
 * WARNING: This is a recursive function.
 * @param item
 * @returns {*}
 */
const buildHTML = (item) => {
    item.children.map(i => item.element.appendChild(buildHTML(i).element))
    return item
}

/**
 * Select the parent HTML element for appending new elements
 * @param item
 * @param parent
 * @returns {*}
 */
const appendAllHTML = (item, parent = documentItem.body) => {
    let parentItem = parent.body ? parent.body : parent
    if (!inArray(parentItem.children, item)) {
        parentItem.children.push(item)
    }
    return buildHTML(parentItem)
}

/**
 * Select the parent HTML element for appending new elements
 * @param item
 * @param parent
 * @returns {*}
 */
const appendHTML = (item, parent = documentItem.body) => {
    let parentItem = parent.body ? parent.body : parent
    if (!inArray(parentItem.children, item)) {
        parentItem.children.push(item)
    }
    if (!item.element || !(item.element instanceof HTMLElement)) {
        item = bindElement(item)
    }
    parentItem.element.appendChild(item.element)
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
 * Register a single listener function as part of the root DOMItem.
 * @param {function} listener
 * @param {Object} [parent]
 * @returns {function}
 */
const registerListener = (listener, parent = documentItem) => parent.eventListeners[listener.name] = parent.head.parentItem.eventListeners[listener.name] = parent.body.parentItem.eventListeners[listener.name] = listener

/**
 * Register multiple listeners from an array of functions.
 * @param {Array.<function>} listeners
 * @param {Object} [parent]
 * @returns {Object}
 */
const registerListeners = (listeners, parent = documentItem) => mergeObjects(parent, {eventListeners: listeners.reduce((initial, listener) => mergeObjects(initial, {[`${listener.name}`]: registerListener(listener, parent)}), parent.eventListeners)})

/**
 * Based on the provided function / listener name, retrieve the associated function from the root DOMItem
 * @param listenerName
 * @param parent
 * @returns {{}}
 */
const retrieveListener = (listenerName, parent = documentItem) => inArray(Object.keys(parent.eventListeners), listenerName) ? parent.eventListeners[listenerName] : {}

/**
 * Provide compatibility for using the options parameter of addEventListener
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
 * Provide compatibility for assigning listeners.
 * @param trigger
 * @param elem
 * @param fn
 * @param options
 * @returns {*}
 */
const assignListener = (trigger, elem, fn, options) => {
    elem.addEventListener ? elem.addEventListener(trigger, fn, listenerOptions(options)) :
        elem.attachEvent ? elem.attachEvent(`on${trigger}`, fn) :
            elem[`on${trigger}`] = fn
    return fn
}

/**
 * When there may be extra data needed for the event listener function
 * call this function may be used as a helper to pass the additional data.
 * Also, if it is desirable to add event listeners during run-time, this
 * function can be used to achieve this.
 * WARNING: This is a recursive function.
 * @param item
 * @param event
 * @param listener
 * @param args
 * @param options
 * @returns {*}
 */
const appendListeners = (item, event, listener, args = {}, options = false) => {
    item.children = item.children || []
    if (item.eventListeners && item.eventListeners[event]) {
        item.eventListeners[event] = {listenerFunc: listener, listenerArgs: args, listenerOptions: options}
    }
    item.children.map(i => appendListeners(i, event, listener, args, options))
    return item
}

/**
 * Based on the eventListeners property of the provided item, bind the
 * listeners to the associated element property for each item in the DOMItem structure.
 * WARNING: This is a recursive function.
 * @param item
 * @returns {*}
 */
const bindAllListeners = (item) => {
    if (item.eventListeners && Object.keys(item.eventListeners).length && item.element instanceof HTMLElement) {
        mapObject(item.eventListeners, (attr, key) => assignListener(key, item.element, (e) => attr.listenerFunc(e, item, attr.listenerArgs), attr.listenerOptions))
    }
    item.children = item.children.map(i => bindAllListeners(i))
    return item
}

/**
 * Based on the eventListeners property of the provided item, bind the
 * listeners to the associated element property for the provided DOMItem.
 * @param item
 * @returns {*}
 */
const bindListeners = (item) => {
    if (item.eventListeners && Object.keys(item.eventListeners).length && item.element instanceof HTMLElement)
        mapObject(item.eventListeners, (attr, event) => assignListener(event, item.element, (e) => attr.listenerFunc(e, item, attr.listenerArgs), attr.listenerOptions))
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
const getChildrenFromAttribute = (attr, value, item = documentItem.body) =>
    (item.attributes[attr] && item.attributes[attr] === value) ?
        item.children.reduce((a, b) => a.concat(getChildrenFromAttribute(attr, value, b)), []).concat([item]) :
        item.children.reduce((a, b) => a.concat(getChildrenFromAttribute(attr, value, b)), [])

/**
 * Helper for getting all DOMItems starting at parent and having specified className attribute
 */
const getChildrenByClass = curry(getChildrenFromAttribute)('className')

/**
 * Helper for getting all DOMItems starting at parent and having specified name attribute
 */
const getChildrenByName = curry(getChildrenFromAttribute)('name')

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
const getParentsFromAttribute = (attr, value, item = documentItem.body) =>
    Object.keys(item.parentItem).length ?
        (item.attributes[attr] && item.attributes[attr] === value) ?
            getParentsFromAttribute(attr, value, item.parentItem).concat([item]) :
            getParentsFromAttribute(attr, value, item.parentItem) :
        []

/**
 * Helper for getting all DOMItems starting at child and having specified className attribute
 */
const getParentsByClass = curry(getParentsFromAttribute)('className')

/**
 * Helper for getting all DOMItems starting at child and having specified name attribute
 */
const getParentsByName = curry(getParentsFromAttribute)('name')

/**
 * Get the upper parentItem for the provided child. (usually this is a documentItem reference)
 * WARNING: This is a recursive function.
 * @param item
 */
const getTopParentItem = item =>
    Object.keys(item.parentItem).length ?
        getTopParentItem(item.parentItem) :
        item


/**
 * This is a shortcut for building the specified HTML elements and appending them to the DOM
 * with associated listeners.
 * The final argument is specific for adding event listeners with options.
 * @param item
 * @param parent
 * @returns {*}
 */
const renderHTML = (item, parent = documentItem) => {
    mapObject(DOMItem(item), (prop) => prop, item)
    item.element = (item.element && item.element instanceof HTMLElement) ? item.element : bindElement(item).element
    item.eventListeners = mapObject(item.eventListeners, prop => mergeObjects(prop, {listenerFunc: retrieveListener(prop.listenerFunc, getTopParentItem(parent))}))
    item.parentItem = parent.body || parent
    item = bindListeners(appendHTML(item, parent))
    item.children.map(child => renderHTML(child, item))
    return item
}
