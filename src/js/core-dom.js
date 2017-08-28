// Core DOM management functions
/**
 *
 * @param element
 * @param key
 * @param attr
 * @returns {*}
 */
const elementHasAttribute = (element, key, attr) => {
    // if element is not a valid element then return false
    if (!(element instanceof HTMLElement))
        return false

    // check the key is a property of the element
    if (key in element) {
        return element[key] === attr // compare current to new one
    } else if (key === 'styles') { // compare each style and return
        // 0 = add style; 1 = no change; -1 = remove style
        return Object.keys(attr).filter(cl => (!inArray(Object.keys(element.style), cl) || attr[cl] !== element.style[cl])).concat(Object.keys(element.style)).reduce((returnObj, b) => {
            returnObj[b] = inArray(Object.keys(attr), b) ?
                inArray(Object.keys(element.style), b) ?
                    1 : 0 :
                -1
            return returnObj
        }, {})
    } else if (key === 'class') { // compare each class and return
        // 0 = add class; 1 = no change; -1 = remove class
        return attr.split(' ').filter(cl => !inArray(element.className.split(' '), cl)).concat(element.className.split(' ')).filter(cl => !!cl.length).reduce((returnObj, b) => {
            returnObj[b] = inArray(attr.split(' '), b) ?
                inArray(element.className.split(' '), b) ?
                    1 : 0 :
                -1
            return returnObj
        }, {})
    }

    return (element.hasAttribute(key) && element.getAttribute(key) === attr)
}

/**
 *
 * @param config
 * @returns {*}
 */
const elementChanges = config => {
    if (config.element.tagName.toLowerCase() !== config.tagName.toLowerCase()) {
        return generateElement(config)
    }
    config.attributes = filterObject(config.attributes, (attr1, key1) => filterObject(mapObject(config.attributes, (attr2, key2) => (typeof attr2 === 'object' || key2 === 'class') ? filterObject(elementHasAttribute(config.element, key2, attr2), (attr3) => !attr3) : !elementHasAttribute(config.element, key2, attr2)), (attr4) => (typeof attr4 === 'object' && !Object.keys(attr4).length) ? false : attr4)[key1])
    return config
}

/**
 * Update a single DOMItem element with the provided attributes / styles / elementProperties
 * @param config
 * @returns {*}
 */
const updateElement = (config) => {
    if (config.element instanceof HTMLElement) {
        config.attributes = mapObject(elementChanges(config).attributes, (attr, key) => {
            if (key in config.element) {
                config.element[key] = attr
                return attr
            } else if (key === 'styles') {
                config.attributes.styles = mapObject(attr, (param, k) => config.element.style[k] = param, config.element.style)
                return attr
            } else if (key === 'class') {
                config.element.className = attr
                return attr
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
    return updateElement(config)
}

/**
 * Generate HTML element data for each object in the matrix
 * WARNING: This is a recursive function.
 * @param item
 * @param parent
 */
const bindAllElements = (item, parent = documentItem) => DOMItem(item, {
    tagName: item.tagName || 'div',
    attributes: item.attributes || {styles: {}},
    element: (item.element && item.element instanceof HTMLElement) ? item.element : generateElement(item).element,
    eventListeners: item.eventListeners || {},
    parentItem: parent,
    children: item.children ? item.children.map(child => bindElements(child, item)) : []
})

/**
 * Generate HTML element data for each object in the matrix
 * WARNING: This is a recursive function.
 * @param item
 */
const bindElement = (item) => {
    if (!item.element || !(item.element instanceof HTMLElement)) {
        item.element = generateElement(item)
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
    item.children.map(i => item.element.appendChild(buildHTML(i)))
    return item.element
}

/**
 * Select the parent HTML element for appending new elements
 * @param item
 * @param parent
 * @returns {*}
 */
const appendAllHTML = (item, parent = documentItem.body) => {
    if (Array.isArray(item)) {
        item.map(i => parent.children.push(i))
    } else {
        parent.children.push(item)
    }
    buildHTML(parent)
    return item
}

/**
 * Select the parent HTML element for appending new elements
 * @param item
 * @param parent
 * @returns {*}
 */
const appendHTML = (item, parent = documentItem.body) => {
    parentItem = parent.body ? parent.body : parent
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
 * Attach an event listener to each cell in the matrix.
 * Accepts an unlimited number of additional arguments to be passed to the action function.
 * WARNING: This is a recursive function.
 * @param item
 * @param options
 * @returns {*}
 */
const bindAllListeners = (item, options = false) => {
    if (item.eventListeners && Object.keys(item.eventListeners).length && item.element instanceof HTMLElement) {
        let results = mapObject(item.eventListeners, (attr, key) => {
            return assignListener(key, item.element, (e) => attr.listenerFunc(e, item, attr.listenerArgs), options)
        })
    }
    item.children = item.children.map(i => bindAllListeners(i, options))
    return item
}

/**
 * Attach an event listener to each cell in the matrix.
 * Accepts an unlimited number of additional arguments to be passed to the action function.
 * WARNING: This is a recursive function.
 * @param item
 * @param options
 * @returns {*}
 */
const bindListeners = (item, options = false) => {
    if (item.eventListeners && Object.keys(item.eventListeners).length && item.element instanceof HTMLElement) {
        mapObject(item.eventListeners, (attr, key) => assignListener(key, item.element, (e) => attr.listenerFunc(e, item, attr.listenerArgs), options))
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
const getChildrenFromAttribute = (attr, value, item = documentItem.body) => {
    return (item.attributes[attr] && item.attributes[attr] === value) ? item.children.reduce((a, b) => a.concat(getChildrenFromAttribute(attr, value, b)), []).concat([item]) : item.children.reduce((a, b) => a.concat(getChildrenFromAttribute(attr, value, b)), [])
}

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
 * The final argument is specific for adding event listeners with options.
 * @param item
 * @param parent
 * @param options
 * @returns {*}
 */
const renderHTML = (item, parent = documentItem, options = false) => {
    item.tagName = item.tagName || 'div'
    item.attributes = item.attributes || {styles: {}}
    item.element = (item.element && item.element instanceof HTMLElement) ? item.element : generateElement(item).element
    item.parentItem = parent.body || parent
    item.children = item.children || []
    item = bindListeners(appendHTML(item, parent), options)
    item.children.map(child => renderHTML(child, item))
    item.attributes.styles = item.attributes.styles || {}
    item.eventListeners = item.eventListeners || {}
    return item
}