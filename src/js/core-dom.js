'use strict'
// Core DOM management functions
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this || {}

  /**
   * Verify availability of document
   * @type {HTMLDocument|PseudoHTMLDocument}
   */
  let document = root.document

  /**
   * If document remains undefined, attempt to retrieve it as a module
   */
  if (!Object.keys(root).length) {
    if (typeof require !== 'undefined') {
      const jDomPseudoDom = require('./pseudo-dom.js')
      root = jDomPseudoDom.generate()
      document = root.document
    } else {
      console.error('objects-dom.js requires jDomPseudoDom')
    }
  }

  /**
   * Store reference to any pre-existing module of the same name
   * @type {jDomCoreDom|*}
   */
  const previousJDomCoreDom = root.jDomCoreDom || {}

  /**
   * All methods exported from this module are encapsulated within jDomCoreDom.
   * @typedef {Object} jDomCoreDom
   *  - appendAllHTML
   *  - appendHTML
   *  - appendListeners
   *  - assignListener
   *  - bindAllElements
   *  - bindAllListeners
   *  - bindElement
   *  - bindListeners
   *  - buildHTML
   *  - elementChanges
   *  - elementHasAttribute
   *  - generateElement
   *  - getChildrenByClass
   *  - getChildrenByName
   *  - getChildrenFromAttribute
   *  - getParentsByClass
   *  - getParentsByName
   *  - getParentsByTagName
   *  - getTopParentItem
   *  - noConflict
   *  - registerListener
   *  - registerListeners
   *  - removeChild
   *  - renderHTML
   *  - retrieveListener
   *  - updateElement
   *  - updateElements
   */

  /**
   * A reference to all functions to be used globally / exported
   * @type {jDomCoreDom}
   */
  const exportFunctions = {
    noConflict: () => {
      root.jDomCoreDom = previousJDomCoreDom
      return exportFunctions
    }
  }
  root.jDomCoreDom = exportFunctions

  /**
   * Verify availability of jDomCore
   * @type {*|jDomCore}
   */
  let jDomCore = root.jDomCore

  /**
   * If jDomCore remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomCore === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomCore = require('./core.js')
    } else {
      console.error('core-dom.js requires jDomCore')
    }
  }

  /**
   * Verify availability of jDomCore
   * @type {*|jDomObjects}
   */
  let jDomObjects = root.jDomObjects

  /**
   * If jDomObjects remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomObjects === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomObjects = require('./objects-dom.js')
    } else {
      console.error('core-dom.js requires jDomObjects')
    }
  }

  /**
   * Check if the provided Element has the provided attributes.
   * Returns a boolean, or an array of 1 / 0 / -1 based on the comparison status.
   * @param {HTMLElement|PseudoHTMLElement} element
   * @param {string} key
   * @param {string} attr
   * @returns {boolean|Object.<string, number>}
   */
  const elementHasAttribute = (element, key, attr) => {
    // if element is not a valid element then return false
    if (!element.style) {
      return false
    }

    // check the key is a property of the element
    // compare current to new one
    if (key in element) {
      // For attributes which are objects or multi-part strings
      // -1 = remove attribute, 0 = no change, 1 = add attribute
      if (/^(style|className)$/.test(key)) {
        return jDomCore.compareArrays(typeof attr === 'string' ? element[key].split(' ') : Object.keys(element[key]), typeof attr === 'string' ? attr.split(' ') : Object.keys(attr))
      }
      return element[key] === attr
    }
    return (element.hasAttribute(key) && element.getAttribute(key) === attr)
  }
  exportFunctions.elementHasAttribute = elementHasAttribute

  /**
   * Given a jDomObjects.DOMItem as config, this function will return the changes to be applied
   * to the stored element property.
   * @param {Object} config
   * @returns {Object}
   */
  const elementChanges = config => {
    if (config.element.tagName.toLowerCase() !== config.tagName.toLowerCase()) {
      return generateElement(config)
    }
    config.attributes = jDomCore.filterObject(config.attributes, (attr1, key1) => jDomCore.filterObject(jDomCore.mapObject(config.attributes, (attr2, key2) => (typeof attr2 === 'object' || key2 === 'className') ? jDomCore.filterObject(elementHasAttribute(config.element, key2, attr2), (attr3) => attr3 === 1) : !elementHasAttribute(config.element, key2, attr2)), (attr4) => !!attr4)[key1])
    return config
  }
  exportFunctions.elementChanges = elementChanges

  /**
   * Update a single jDomObjects.DOMItem element with the provided attributes / style / elementProperties
   * @param config
   * @returns {*}
   */
  const updateElement = (config) => {
    if (config.element.style) {
      config.attributes = jDomCore.mapObject(elementChanges(config).attributes, (attr, key) => {
        if (key in config.element) {
          if (jDomCore.notEmptyObjectOrArray(attr)) {
            return jDomCore.mapObject(jDomCore.filterObject(attr, (param, k) => /^\D+$/.test(k)), (p, i) => {
              config.element.style[i] = p
              return p
            }, config.element.style)
          }
          config.element[key] = attr
          return attr
        }
        config.element.setAttribute(key, attr)
        return attr
      })
    }
    return config
  }
  exportFunctions.updateElement = updateElement

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
  exportFunctions.updateElements = updateElements

  /**
   * Create an HTML element based on the provided attributes and return the element as an Object.
   * @param config
   */
  const generateElement = (config) => {
    config.element = document.createElement(config.tagName)
    return updateElement(config)
  }
  exportFunctions.generateElement = generateElement

  /**
   * Generate HTML element data for each object in the matrix
   * WARNING: This is a recursive function.
   * @param item
   * @param parent
   */
  const bindAllElements = (item, parent = jDomObjects.documentItem) => {
    jDomCore.mapObject(jDomObjects.DOMItem(item), (prop) => prop, item)
    item.element = (item.element && item.element.style) ? item.element : bindElement(item).element
    item.parentItem = parent.body || parent
    item.children.map(child => bindAllElements(child, item))
    return item
  }
  exportFunctions.bindAllElements = bindAllElements

  /**
   * Generate HTML element data for each object in the matrix
   * WARNING: This is a recursive function.
   * @param item
   */
  const bindElement = (item) => {
    if (!item.element || !item.element.style) {
      item.element = generateElement(item).element
    }
    return item
  }
  exportFunctions.bindElement = bindElement

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
  exportFunctions.buildHTML = buildHTML

  /**
   * Select the parent HTML element for appending new elements
   * @param item
   * @param parent
   * @returns {*}
   */
  const appendAllHTML = (item, parent = jDomObjects.documentItem.body) => {
    let parentItem = parent.body ? parent.body : parent
    if (!jDomCore.inArray(parentItem.children, item)) {
      parentItem.children.push(item)
    }
    return buildHTML(parentItem)
  }
  exportFunctions.appendAllHTML = appendAllHTML

  /**
   * Select the parent HTML element for appending new elements
   * @param item
   * @param parent
   * @returns {*}
   */
  const appendHTML = (item, parent = jDomObjects.documentItem.body) => {
    let parentItem = parent.body ? parent.body : parent
    if (!jDomCore.inArray(parentItem.children, item)) {
      parentItem.children.push(item)
    }
    if (!item.element || !item.element.style) {
      item = bindElement(item)
    }
    parentItem.element.appendChild(item.element)
    return item
  }
  exportFunctions.appendHTML = appendHTML

  /**
   * Reverse of appendHTML, remove an element
   * @param item
   * @param parent
   * @returns {Array.<HTMLElement|PseudoHTMLElement>}
   */
  const removeChild = (item, parent = jDomObjects.documentItem.body) => {
    parent.element.removeChild(item.element)
    return parent.children.splice(parent.children.indexOf(item), 1)
  }
  exportFunctions.removeChild = removeChild

  /**
   * Register a single listener function as part of the root jDomObjects.DOMItem.
   * @param {function} listener
   * @param {string} [name]
   * @param {Object} [parent]
   * @returns {function}
   */
  const registerListener = (listener, name = listener.name, parent = jDomObjects.documentItem) => Object.assign(parent.eventListeners, {name: listener})
  exportFunctions.registerListener = registerListener

  /**
   * Register multiple listeners from an array of functions.
   * @param {Array.<function>} listeners
   * @param {Object} [parent]
   * @returns {Object}
   */
  const registerListeners = (listeners, parent = jDomObjects.documentItem) => jDomCore.mergeObjects(parent, {eventListeners: listeners}, parent.eventListeners)
  exportFunctions.registerListeners = registerListeners

  /**
   * Based on the provided function / listener name, retrieve the associated function from the root jDomObjects.DOMItem
   * @param listenerName
   * @param parent
   * @returns {{}}
   */
  const retrieveListener = (listenerName, parent = jDomObjects.documentItem) => jDomCore.inArray(Object.keys(parent.eventListeners), listenerName) ? parent.eventListeners[listenerName] : {}
  exportFunctions.retrieveListener = retrieveListener

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
    elem.addEventListener ? elem.addEventListener(trigger, fn, listenerOptions(options)) : elem.attachEvent ? elem.attachEvent(`on${trigger}`, fn) : elem[`on${trigger}`] = fn
    return fn
  }
  exportFunctions.assignListener = assignListener

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
  exportFunctions.appendListeners = appendListeners

  /**
   * Based on the eventListeners property of the provided item, bind the
   * listeners to the associated element property for each item in the jDomObjects.DOMItem structure.
   * WARNING: This is a recursive function.
   * @param item
   * @returns {*}
   */
  const bindAllListeners = (item) => {
    if (item.eventListeners && Object.keys(item.eventListeners).length && item.element.style) {
      jDomCore.mapObject(item.eventListeners, (attr, key) => assignListener(key, item.element, (e) => attr.listenerFunc(e, item, attr.listenerArgs), attr.listenerOptions))
    }
    item.children = item.children.map(i => bindAllListeners(i))
    return item
  }
  exportFunctions.bindAllListeners = bindAllListeners

  /**
   * Based on the eventListeners property of the provided item, bind the
   * listeners to the associated element property for the provided jDomObjects.DOMItem.
   * @param item
   * @returns {*}
   */
  const bindListeners = (item) => {
    if (item.eventListeners && Object.keys(item.eventListeners).length && item.element.style) {
      jDomCore.mapObject(item.eventListeners, (attr, event) => assignListener(event, item.element, (e) => attr.listenerFunc(e, item, attr.listenerArgs), attr.listenerOptions))
    }
    return item
  }
  exportFunctions.bindListeners = bindListeners

  /**
   * A selector function for retrieving existing child jDomObjects.DOMItems from the given parent item.
   * This function will check all the children starting from item, and scan the attributes
   * property for matches. The return array contains children matching from all levels.
   * WARNING: This is a recursive function.
   * @param attr
   * @param value
   * @param item
   * @returns {Array}
   */
  const getChildrenFromAttribute = (attr, value, item = jDomObjects.documentItem.body) =>
    (item.attributes[attr] && item.attributes[attr] === value) ? item.children.reduce((a, b) => a.concat(getChildrenFromAttribute(attr, value, b)), []).concat([item]) : item.children.reduce((a, b) => a.concat(getChildrenFromAttribute(attr, value, b)), [])
  exportFunctions.getChildrenFromAttribute = getChildrenFromAttribute

  /**
   * Helper for getting all jDomObjects.DOMItems starting at parent and having specified className attribute
   */
  const getChildrenByClass = jDomCore.curry(getChildrenFromAttribute)('className')
  exportFunctions.getChildrenByClass = getChildrenByClass

  /**
   * Helper for getting all jDomObjects.DOMItems starting at parent and having specified name attribute
   */
  const getChildrenByName = jDomCore.curry(getChildrenFromAttribute)('name')
  exportFunctions.getChildrenByName = getChildrenByName

  /**
   * A selector function for retrieving existing child jDomObjects.DOMItems from the given parent item.
   * This function will check all the children starting from item, and scan the attributes
   * property for matches. The return array contains children matching from all levels.
   * WARNING: This is a recursive function.
   * @param attr
   * @param value
   * @param item
   * @returns {Array}
   */
  const getParentsFromAttribute = (attr, value, item = jDomObjects.documentItem.body) =>
    !Object.keys(item.parentItem).length
      ? []
      : (item.attributes[attr] || item[attr] || false) === value
      ? getParentsFromAttribute(attr, value, item.parentItem).concat([item])
      : getParentsFromAttribute(attr, value, item.parentItem)

  /**
   * Helper for getting all jDomObjects.DOMItems starting at child and having specified className attribute
   */
  const getParentsByClass = jDomCore.curry(getParentsFromAttribute)('className')
  exportFunctions.getParentsByClass = getParentsByClass

  /**
   * Helper for getting all jDomObjects.DOMItems starting at child and having specified name attribute
   */
  const getParentsByName = jDomCore.curry(getParentsFromAttribute)('name')
  exportFunctions.getParentsByName = getParentsByName

  /**
   * Helper for getting all jDomObjects.DOMItems starting at child and having specified tagName
   */
  const getParentsByTagName = jDomCore.curry(getParentsFromAttribute)('tagName')
  exportFunctions.getParentsByTagName = getParentsByTagName

  /**
   * Get the upper parentItem for the provided child. (usually this is a jDomObjects.documentItem reference)
   * WARNING: This is a recursive function.
   * @param item
   */
  const getTopParentItem = item =>
    Object.keys(item.parentItem).length ? getTopParentItem(item.parentItem) : item
  exportFunctions.getTopParentItem = getTopParentItem

  /**
   * This is a shortcut for building the specified HTML elements and appending them to the DOM
   * with associated listeners.
   * The final argument is specific for adding event listeners with options.
   * @param item
   * @param parent
   * @returns {*}
   */
  const renderHTML = (item, parent = jDomObjects.documentItem) => {
    jDomCore.mapObject(jDomObjects.DOMItem(item), (prop) => prop, item)
    item.element = (item.element && item.element.style) ? item.element : bindElement(item).element
    item.eventListeners = jDomCore.mapObject(item.eventListeners, prop => jDomCore.mergeObjects(prop, {listenerFunc: retrieveListener(prop.listenerFunc, getTopParentItem(parent))}))
    item.parentItem = parent.body || parent
    item = bindListeners(appendHTML(item, parent))
    item.children.map(child => renderHTML(child, item))
    return item
  }
  exportFunctions.renderHTML = renderHTML

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = exportFunctions
    }
    exports = Object.assign(exports, exportFunctions)
  }
}).call(this || window || base || {}) // Use the external context to assign this, which will be Window if rendered via browser
