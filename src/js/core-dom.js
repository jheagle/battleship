'use strict'
// Core DOM management functions
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this || {}

  /**
   * Verify availability of document
   * @type {HTMLDocument|module:jDomPseudoDom.PseudoHTMLDocument}
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
   * @type {module|*}
   */
  const previousJDomCoreDom = root.jDomCoreDom || {}

  /**
   * A reference to all functions to be used globally / exported
   * @module jDomCoreDom
   */
  const jDomCoreDom = {}
  root.jDomCoreDom = jDomCoreDom

  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {module:jDomCoreDom}
   */
  jDomCoreDom.noConflict = () => {
    root.jDomCoreDom = previousJDomCoreDom
    return jDomCoreDom
  }

  /**
   * Verify availability of jDomCore
   * @type {*|module:jDomCore}
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
   * @type {*|module:jDomObjects}
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
   * @function elementHasAttribute
   * @param {HTMLElement|module:jDomPseudoDom.PseudoHTMLElement} element
   * @param {string} key
   * @param {string} attr
   * @returns {boolean|Object.<string, number>}
   */
  jDomCoreDom.elementHasAttribute = (element, key, attr) => {
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

  /**
   * Given a jDomObjects.DOMItem as config, this function will return the changes to be applied
   * to the stored element property.
   * @function elementChanges
   * @param {Object} config
   * @returns {Object}
   */
  jDomCoreDom.elementChanges = config => {
    if (config.element.tagName.toLowerCase() !== config.tagName.toLowerCase()) {
      return jDomCoreDom.generateElement(config)
    }
    config.attributes = jDomCore.filterObject(config.attributes, (attr1, key1) => jDomCore.filterObject(jDomCore.mapObject(config.attributes, (attr2, key2) => (typeof attr2 === 'object' || key2 === 'className') ? jDomCore.filterObject(jDomCoreDom.elementHasAttribute(config.element, key2, attr2), (attr3) => attr3 === 1) : !jDomCoreDom.elementHasAttribute(config.element, key2, attr2)), (attr4) => !!attr4)[key1])
    return config
  }

  /**
   * Update a single jDomObjects.DOMItem element with the provided attributes / style / elementProperties
   * @function updateElement
   * @param config
   * @returns {*}
   */
  jDomCoreDom.updateElement = (config) => {
    if (config.element.style) {
      config.attributes = jDomCore.mapObject(jDomCoreDom.elementChanges(config).attributes, (attr, key) => {
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

  /**
   * Generate HTML element data for each object in the matrix
   * WARNING: This is a recursive function.
   * @function updateElements
   * @param config
   * @returns {*}
   */
  jDomCoreDom.updateElements = (config) => {
    config = jDomCoreDom.updateElement(config)
    config.children.map(child => jDomCoreDom.updateElements(child))
    return config
  }

  /**
   * Create an HTML element based on the provided attributes and return the element as an Object.
   * @function generateElement
   * @param config
   */
  jDomCoreDom.generateElement = (config) => {
    config.element = document.createElement(config.tagName)
    return jDomCoreDom.updateElement(config)
  }

  /**
   * Generate HTML element data for each object in the matrix
   * WARNING: This is a recursive function.
   * @function bindAllElements
   * @param item
   * @param parent
   */
  jDomCoreDom.bindAllElements = (item, parent = jDomObjects.documentItem) => {
    jDomCore.mapObject(jDomObjects.DOMItem(item), (prop) => prop, item)
    item.element = (item.element && item.element.style) ? item.element : jDomCoreDom.bindElement(item).element
    item.parentItem = parent.body || parent
    item.children.map(child => jDomCoreDom.bindAllElements(child, item))
    return item
  }

  /**
   * Generate HTML element data for each object in the matrix
   * WARNING: This is a recursive function.
   * @function bindElement
   * @param item
   */
  jDomCoreDom.bindElement = (item) => {
    if (!item.element || !item.element.style) {
      item.element = jDomCoreDom.generateElement(item).element
    }
    return item
  }

  /**
   * Append each HTML element data in a combined HTML element
   * WARNING: This is a recursive function.
   * @function buildHTML
   * @param item
   * @returns {*}
   */
  jDomCoreDom.buildHTML = (item) => {
    item.children.map(i => item.element.appendChild(jDomCoreDom.buildHTML(i).element))
    return item
  }

  /**
   * Select the parent HTML element for appending new elements
   * @function appendAllHTML
   * @param item
   * @param parent
   * @returns {*}
   */
  jDomCoreDom.appendAllHTML = (item, parent = jDomObjects.documentItem.body) => {
    let parentItem = parent.body ? parent.body : parent
    if (!jDomCore.inArray(parentItem.children, item)) {
      parentItem.children.push(item)
    }
    return jDomCoreDom.buildHTML(parentItem)
  }

  /**
   * Select the parent HTML element for appending new elements
   * @function appendHTML
   * @param item
   * @param parent
   * @returns {*}
   */
  jDomCoreDom.appendHTML = (item, parent = jDomObjects.documentItem.body) => {
    let parentItem = parent.body ? parent.body : parent
    if (!jDomCore.inArray(parentItem.children, item)) {
      parentItem.children.push(item)
    }
    if (!item.element || !item.element.style) {
      item = jDomCoreDom.bindElement(item)
    }
    parentItem.element.appendChild(item.element)
    return item
  }

  /**
   * Reverse of appendHTML, remove an element
   * @function removeChild
   * @param item
   * @param parent
   * @returns {Array.<HTMLElement|PseudoHTMLElement>}
   */
  jDomCoreDom.removeChild = (item, parent = jDomObjects.documentItem.body) => {
    parent.element.removeChild(item.element)
    return parent.children.splice(parent.children.indexOf(item), 1)
  }

  /**
   * Register a single listener function as part of the root jDomObjects.DOMItem.
   * @function registerListener
   * @param {function} listener
   * @param {string} [name]
   * @param {Object} [parent]
   * @returns {function}
   */
  jDomCoreDom.registerListener = (listener, name = listener.name, parent = jDomObjects.documentItem) => Object.assign(parent.eventListeners, {name: listener})

  /**
   * Register multiple listeners from an array of functions.
   * @function registerListeners
   * @param {Array.<function>} listeners
   * @param {Object} [parent]
   * @returns {Object}
   */
  jDomCoreDom.registerListeners = (listeners, parent = jDomObjects.documentItem) => jDomCore.mergeObjects(parent, {eventListeners: listeners}, parent.eventListeners)

  /**
   * Based on the provided function / listener name, retrieve the associated function from the root jDomObjects.DOMItem
   * @function retrieveListener
   * @param listenerName
   * @param parent
   * @returns {{}}
   */
  jDomCoreDom.retrieveListener = (listenerName, parent = jDomObjects.documentItem) => jDomCore.inArray(Object.keys(parent.eventListeners), listenerName) ? parent.eventListeners[listenerName] : {}

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
   * @function assignListener
   * @param trigger
   * @param elem
   * @param fn
   * @param options
   * @returns {*}
   */
  jDomCoreDom.assignListener = (trigger, elem, fn, options) => {
    elem.addEventListener ? elem.addEventListener(trigger, fn, listenerOptions(options)) : elem.attachEvent ? elem.attachEvent(`on${trigger}`, fn) : elem[`on${trigger}`] = fn
    return fn
  }

  /**
   * When there may be extra data needed for the event listener function
   * call this function may be used as a helper to pass the additional data.
   * Also, if it is desirable to add event listeners during run-time, this
   * function can be used to achieve this.
   * WARNING: This is a recursive function.
   * @function appendListeners
   * @param item
   * @param event
   * @param listener
   * @param args
   * @param options
   * @returns {*}
   */
  jDomCoreDom.appendListeners = (item, event, listener, args = {}, options = false) => {
    item.children = item.children || []
    if (item.eventListeners && item.eventListeners[event]) {
      item.eventListeners[event] = {listenerFunc: listener, listenerArgs: args, listenerOptions: options}
    }
    item.children.map(i => jDomCoreDom.appendListeners(i, event, listener, args, options))
    return item
  }

  /**
   * Based on the eventListeners property of the provided item, bind the
   * listeners to the associated element property for each item in the jDomObjects.DOMItem structure.
   * WARNING: This is a recursive function.
   * @function bindAllListeners
   * @param item
   * @returns {*}
   */
  jDomCoreDom.bindAllListeners = (item) => {
    if (item.eventListeners && Object.keys(item.eventListeners).length && item.element.style) {
      jDomCore.mapObject(item.eventListeners, (attr, key) => jDomCoreDom.assignListener(key, item.element, (e) => attr.listenerFunc(e, item, attr.listenerArgs), attr.listenerOptions))
    }
    item.children = item.children.map(i => jDomCoreDom.bindAllListeners(i))
    return item
  }

  /**
   * Based on the eventListeners property of the provided item, bind the
   * listeners to the associated element property for the provided jDomObjects.DOMItem.
   * @function bindListeners
   * @param item
   * @returns {*}
   */
  jDomCoreDom.bindListeners = (item) => {
    if (item.eventListeners && Object.keys(item.eventListeners).length && item.element.style) {
      jDomCore.mapObject(item.eventListeners, (attr, event) => jDomCoreDom.assignListener(event, item.element, (e) => attr.listenerFunc(e, item, attr.listenerArgs), attr.listenerOptions))
    }
    return item
  }

  /**
   * A selector function for retrieving existing child jDomObjects.DOMItems from the given parent item.
   * This function will check all the children starting from item, and scan the attributes
   * property for matches. The return array contains children matching from all levels.
   * WARNING: This is a recursive function.
   * @function getChildrenFromAttribute
   * @param attr
   * @param value
   * @param item
   * @returns {Array}
   */
  jDomCoreDom.getChildrenFromAttribute = (attr, value, item = jDomObjects.documentItem.body) =>
    (item.attributes[attr] && item.attributes[attr] === value) ? item.children.reduce((a, b) => a.concat(jDomCoreDom.getChildrenFromAttribute(attr, value, b)), []).concat([item]) : item.children.reduce((a, b) => a.concat(jDomCoreDom.getChildrenFromAttribute(attr, value, b)), [])

  /**
   * Helper for getting all jDomObjects.DOMItems starting at parent and having specified className attribute
   * @function getChildrenByClass
   * @returns {Array}
   */
  jDomCoreDom.getChildrenByClass = jDomCore.curry(jDomCoreDom.getChildrenFromAttribute)('className')

  /**
   * Helper for getting all jDomObjects.DOMItems starting at parent and having specified name attribute
   * @function getChildrenByName
   * @returns {Array}
   */
  jDomCoreDom.getChildrenByName = jDomCore.curry(jDomCoreDom.getChildrenFromAttribute)('name')

  /**
   * A selector function for retrieving existing child jDomObjects.DOMItems from the given parent item.
   * This function will check all the children starting from item, and scan the attributes
   * property for matches. The return array contains children matching from all levels.
   * WARNING: This is a recursive function.
   * @function getParentsFromAttribute
   * @param attr
   * @param value
   * @param item
   * @returns {Array}
   */
  jDomCoreDom.getParentsFromAttribute = (attr, value, item = jDomObjects.documentItem.body) => Object.keys(item.parentItem).length
    ? (item.attributes[attr] || item[attr] || false) === value
      ? jDomCoreDom.getParentsFromAttribute(attr, value, item.parentItem).concat([item])
      : jDomCoreDom.getParentsFromAttribute(attr, value, item.parentItem)
    : []

  /**
   * Helper for getting all jDomObjects.DOMItems starting at child and having specified className attribute
   * @function getParentsByClass
   * @returns {Array}
   */
  jDomCoreDom.getParentsByClass = jDomCore.curry(jDomCoreDom.getParentsFromAttribute)('className')

  /**
   * Helper for getting all jDomObjects.DOMItems starting at child and having specified name attribute
   * @function getParentsByName
   * @returns {Array}
   */
  jDomCoreDom.getParentsByName = jDomCore.curry(jDomCoreDom.getParentsFromAttribute)('name')

  /**
   * Helper for getting all jDomObjects.DOMItems starting at child and having specified tagName
   * @function getParentsByTagName
   * @returns {Array}
   */
  jDomCoreDom.getParentsByTagName = jDomCore.curry(jDomCoreDom.getParentsFromAttribute)('tagName')

  /**
   * Get the upper parentItem for the provided child. (usually this is a jDomObjects.documentItem reference)
   * WARNING: This is a recursive function.
   * @function getTopParentItem
   * @param item
   */
  jDomCoreDom.getTopParentItem = item => Object.keys(item.parentItem).length
    ? jDomCoreDom.getTopParentItem(item.parentItem)
    : item

  /**
   * This is a shortcut for building the specified HTML elements and appending them to the DOM
   * with associated listeners.
   * The final argument is specific for adding event listeners with options.
   * @function renderHTML
   * @param item
   * @param parent
   * @returns {*}
   */
  jDomCoreDom.renderHTML = (item, parent = jDomObjects.documentItem) => {
    jDomCore.mapObject(jDomObjects.DOMItem(item), (prop) => prop, item)
    item.element = (item.element && item.element.style) ? item.element : jDomCoreDom.bindElement(item).element
    item.eventListeners = jDomCore.mapObject(item.eventListeners, prop => jDomCore.mergeObjects(prop, {listenerFunc: jDomCoreDom.retrieveListener(prop.listenerFunc, jDomCoreDom.getTopParentItem(parent))}))
    item.parentItem = parent.body || parent
    item = jDomCoreDom.bindListeners(jDomCoreDom.appendHTML(item, parent))
    item.children.map(child => jDomCoreDom.renderHTML(child, item))
    return item
  }

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = jDomCoreDom
    }
    exports = Object.assign(exports, jDomCoreDom)
  }
}).call(this || window || base || {}) // Use the external context to assign this, which will be Window if rendered via browser
