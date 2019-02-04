/**
 * @file Core DOM management functions
 * @author Joshua Heagle <contact@joshuaheagle.com>
 * @version 1.0.0
 */
'use strict'
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this || {}

  /**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */
  const previousJDomCoreDom = root.jDomCoreDom || {}

  /**
   * A reference to all functions to be used globally / exported
   * @author Joshua Heagle <contact@joshuaheagle.com>
   * @typedef {Object} jDomCoreDom
   * @module jDom/core/dom/core
   */
  const jDomCoreDom = {}
  root.jDomCoreDom = jDomCoreDom

  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {jDomCoreDom}
   */
  jDomCoreDom.noConflict = () => {
    root.jDomCoreDom = previousJDomCoreDom
    return jDomCoreDom
  }

  /**
   * Verify availability of document
   * @typedef {HTMLDocument|module:jDom/pseudoDom/objects.PseudoHTMLDocument} document
   */
  let document = root.document

  /**
   * If document remains undefined, attempt to retrieve it as a module
   */
  if (typeof document === 'undefined') {
    if (typeof require !== 'undefined') {
      // noinspection JSUnresolvedFunction
      /**
       * @see module:jDom/pseudoDom/objects.generate
       * @typedef {Window|module:jDom/pseudoDom/objects.PseudoEventTarget} root
       */
      root = require('../../pseudoDom/objects.js').generate(root)
      document = root.document
    } else {
      console.error('objects.js requires jDomPseudoDom')
    }
  }

  /**
   * Verify availability of jDomCore
   * @typedef {*|module:jDom/core/core} jDomCore
   */
  let jDomCore = root.jDomCore

  /**
   * If jDomCore remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomCore === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomCore = require('../core.js')
    } else {
      console.error('core.js requires jDomCore')
    }
  }

  /**
   * Verify availability of jDomCore
   * @typedef {*|module:jDom/core/dom/objects} jDomObjects
   */
  let jDomObjects = root.jDomObjects

  /**
   * If jDomObjects remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomObjects === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomObjects = require('./objects.js')
    } else {
      console.error('core.js requires jDomObjects')
    }
  }

  /**
   * Check if the provided Element has the provided attributes.
   * Returns a boolean, or an array of 1 / 0 / -1 based on the comparison status.
   * @function elementHasAttribute
   * @param {HTMLElement|module:jDom/pseudoDom/objects.PseudoHTMLElement} element - Receive the element to be assessed
   * @param {string} key - The attribute name to search for
   * @param {string|Object} attr - The expected value of the attribute to compare against
   * @returns {boolean|Object.<string, number>}
   */
  jDomCoreDom.elementHasAttribute = (element, key, attr) => {
    if (!element.style) {
      // if element is not a valid element then return false
      return false
    }
    if (/^(style|className)$/.test(key)) {
      // For attributes which are objects or multi-part strings
      // -1 = remove attribute, 0 = no change, 1 = add attribute
      return jDomCore.compareArrays(
        typeof attr === 'string' ? attr.split(' ') : Object.keys(attr),
        typeof attr === 'string' ? element[key].split(' ') : Object.keys(element[key])
      )
    }
    // Check that the key is a property of the element
    // Compare current to new one
    return (element.hasAttribute(key) && element.getAttribute(key) === attr)
  }

  /**
   * Check if a class exists on the element, return object with keys for each class and a -1, 0, 1 difference indicator.
   * @param {HTMLElement|module:jDom/pseudoDom/objects.PseudoHTMLElement} element - Provide an element to check classes on.
   * @param {string} classes - A string of classes (like the content of the 'class' attribute) to be compared
   * @returns {Object<string, number>|*}
   */
  jDomCoreDom.elementCompareClassList = (element, classes) => jDomCore.compareArrays(classes.split(' '), [].from(element.classList))

  /**
   * Given a jDomObjects.DOMItem as config, this function will return the changes to be applied
   * to the stored element property.
   * @function elementChanges
   * @param {module:jDom/core/dom/objects.DOMItem} config - The DOMItem having config changes to be applied to its element
   * @returns {module:jDom/core/dom/objects.DOMItem}
   */
  jDomCoreDom.elementChanges = config => (config.element.tagName.toLowerCase() !== config.tagName.toLowerCase())
    // Generate a new element since the tag has changed
    ? jDomCoreDom.generateElement(config)
    // Remove all the similarities
    : jDomCore.setValue(
      config,
      'attributes',
      jDomCore.filterObject(
        config.attributes,
        // For each attribute, check if it becomes true / false based on the comparison results
        (attr1, key1) =>
          jDomCore.filterObject(
            // Get attributes as object of truthy and falsey values
            jDomCore.mapObject(
              config.attributes,
              (attr2, key2) => (typeof attr2 === 'object' || key2 === 'className')
                // Apply custom logic for class and styles, only keep the updates
                ? jDomCore.filterObject(jDomCoreDom.elementHasAttribute(config.element, key2, attr2), attr3 => attr3 === 1)
                // True when the element does not already have the attribute
                : !jDomCoreDom.elementHasAttribute(config.element, key2, attr2)
            ),
            // Remove when the attr4 value is 0 or false, or not empty object
            attr4 => !!attr4
          )[key1]
      )
    )

  /**
   * Set an attribute on the element within a DOMItem, then return the config data.
   * @function setAttribute
   * @param {module:jDom/core/dom/objects.DOMItem} config - The DOMItem having config changes to be applied to its element
   * @param {string} name - The attribute name to be updated
   * @param {string} value - The new value to be applied to the attribute
   * @returns {module:jDom/core/dom/objects.DOMItem}
   */
  jDomCoreDom.setAttribute = (config, name, value) => {
    config.element.setAttribute(name, value)
    return config
  }

  /**
   * Set an attribute on the element within a DOMItem, then return the attribute.
   * @function setAndReturnAttribute
   * @param {module:jDom/core/dom/objects.DOMItem} config - The DOMItem having config changes to be applied to its element
   * @param {string} name - The attribute name to be updated
   * @param {string} value - The new value to be applied to the attribute
   * @returns {string}
   */
  jDomCoreDom.setAndReturnAttribute = (config, name, value) => {
    config.element.setAttribute(name, value)
    return value
  }

  /**
   * Update a single jDomObjects.DOMItem element with the provided attributes / style / elementProperties
   * @function updateElement
   * @param {module:jDom/core/dom/objects.DOMItem} config - The DOMItem having config changes to be applied to its element
   * @returns {module:jDom/core/dom/objects.DOMItem}
   */
  jDomCoreDom.updateElement = config => !config.element.style
    // if element is not a valid element then return the config without changes
    ? config
    // Set the the current attributes to contain all the changes
    : jDomCore.setValue(config, 'attributes', jDomCore.mapObject(
      // Retrieve only the changes to be applied from the attributes
      jDomCoreDom.elementChanges(config).attributes,
      (attr, key) => (jDomCore.notEmptyObjectOrArray(attr))
        ? jDomCore.mapObject(
          jDomCore.filterObject(
            // Remove attributes which have a numeric key (these are unwanted styles stored on elements)
            attr,
            (param, k) => /^\D+$/.test(k)
          ),
          (p, i) => jDomCore.setAndReturnValue(config.element.style, i, p),
          config.element.style
        )
        : (key in config.element)
          ? jDomCore.setAndReturnValue(config.element, key, attr)
          : jDomCoreDom.setAndReturnAttribute(config, key, attr)
      )
    )

  /**
   * Generate HTML element data for each object in the matrix
   * WARNING: This is a recursive function.
   * @function updateElements
   * @param {module:jDom/core/dom/objects.DOMItem} config - The DOMItem having child DOMItems with config changes to be applied
   * @returns {module:jDom/core/dom/objects.DOMItem}
   */
  jDomCoreDom.updateElements = config => jDomCore.mapProperty(jDomCoreDom.updateElement(config), 'children', child => jDomCoreDom.updateElements(child))

  /**
   * Create an HTML element based on the provided attributes and return the element as an Object.
   * @function generateElement
   * @param {module:jDom/core/dom/objects.DOMItem} config - The DOMItem requiring matching HTML element property
   * @return {module:jDom/core/dom/objects.DOMItem}
   */
  jDomCoreDom.generateElement = config => jDomCoreDom.updateElement(
    jDomCore.setValue(config, 'element', document.createElement(config.tagName))
  )

  /**
   * Generate HTML element data for a provided DOMItem
   * @function bindElement
   * @param {module:jDom/core/dom/objects.DOMItem} item - The DOMItem needing element to be generated
   * @return {module:jDom/core/dom/objects.DOMItem}
   */
  jDomCoreDom.bindElement = item => jDomCore.setValue(item, 'element', (!item.element || !item.element.style)
    ? jDomCoreDom.generateElement(item).element
    : item.element)

  /**
   * Simplify detecting the parent item which can be appended to, whether root, or just a parent at any part of the tree
   * @param {module:jDom/core/dom/objects.DOMItem} parent - A parent DOMItem which may or may not have a body
   * @returns {module:jDom/core/dom/objects.DOMItemBody|module:jDom/core/dom/objects.DOMItem}
   */
  const retrieveParentItem = parent => parent.body ? parent.body : parent

  /**
   * Having an array and a potential new array element, check if the element is in the array, if not append to array.
   * @param {module:jDom/core/dom/objects.DOMItem|*} item - An potential array element, possibly a DOMItem
   * @param {Array} array - An array where an element may be appended.
   * @returns {Array|Buffer|*|T[]|string}
   */
  const addUniqueToArray = (item, array) => !jDomCore.inArray(array, item) ? array.concat([item]) : array

  /**
   * Provide a DOMItem to be appended to a parent item, return the DOMItem.
   * @param {module:jDom/core/dom/objects.DOMItem} child - A DOMItem to be appended
   * @param {module:jDom/core/dom/objects.DOMItem} parent - A parent item to have a new child appended
   * @returns {module:jDom/core/dom/objects.DOMItem}
   */
  const appendAndReturnChild = (child, parent = jDomObjects.documentItem.body) => {
    retrieveParentItem(parent).element.appendChild(child.element)
    return child
  }

  /**
   * Append a new DOMItem which has the element generated.
   * @function appendHTML
   * @param {module:jDom/core/dom/objects.DOMItem} item - A new DOMItem to append
   * @param {module:jDom/core/dom/objects.DOMItem} parent - The parent to have DOMItems appended
   * @returns {module:jDom/core/dom/objects.DOMItem}
   */
  jDomCoreDom.appendHTML = (item, parent = jDomObjects.documentItem.body) => appendAndReturnChild(
    jDomCoreDom.bindElement(item),
    jDomCore.setValue(
      retrieveParentItem(parent),
      'children',
      addUniqueToArray(item, retrieveParentItem(parent).children)
    )
  )

  /**
   * Reverse of appendHTML, remove a DOMItem and have the associated element removed.
   * @function removeChild
   * @param {module:jDom/core/dom/objects.DOMItem} item - The DOMItem with HTMLElement to be removed
   * @param {module:jDom/core/dom/objects.DOMItem} parent - The parent of the items
   * @returns {Array.<HTMLElement|PseudoHTMLElement>}
   */
  jDomCoreDom.removeChild = (item, parent = jDomObjects.documentItem.body) => {
    parent.element.removeChild(item.element)
    return parent.children.splice(parent.children.indexOf(item), 1)
  }

  /**
   * Register a single listener function as part of the root jDomObjects.DOMItem.
   * @function registerListener
   * @param {module:jDom/core/dom/objects~listenerFunction|function} listener - Provide a function which will be called when a DOM event is triggered.
   * @param {string} [name] - The name of the listener to be used.
   * @param {module:jDom/core/dom/objects.DOMItemRoot|Object} [parent] - The parent DOMItem which is DOMItemRoot which stores has eventListeners property.
   * @returns {Object.<string, module:jDom/core/dom/objects~listenerFunction>}
   */
  jDomCoreDom.registerListener = (listener, name = listener.name, parent = jDomObjects.documentItem) => Object.assign(parent.eventListeners, {[name]: listener})

  /**
   * Register multiple listeners from an array of functions.
   * @function registerListeners
   * @param {Array.<module:jDom/core/dom/objects~listenerFunction|function>} listeners - An array of functions to be used as the registered event listeners.
   * @param {module:jDom/core/dom/objects.DOMItemRoot|Object} [parent] - The parent DOMItem which is DOMItemRoot which stores has eventListeners property.
   * @returns {module:jDom/core/dom/objects.DOMItemRoot|Object}
   */
  jDomCoreDom.registerListeners = (listeners, parent = jDomObjects.documentItem) => jDomCore.mergeObjects(parent, {eventListeners: parent.eventListeners}, {eventListeners: listeners})

  /**
   * Based on the provided function / listener name, retrieve the associated function from the root jDomObjects.DOMItem
   * @function retrieveListener
   * @param {string} listenerName - The name of one of the registered listener functions.
   * @param {module:jDom/core/dom/objects.DOMItemRoot|Object} [parent] - The parent DOMItem which is DOMItemRoot which stores has eventListeners property.
   * @returns {module:jDom/core/dom/objects~listenerFunction|function}
   */
  jDomCoreDom.retrieveListener = (listenerName, parent = jDomObjects.documentItem) => jDomCore.inArray(Object.keys(parent.eventListeners), listenerName) ? parent.eventListeners[listenerName] : {}

  /**
   * Provide compatibility for using the options parameter of addEventListener
   * @param {module:jDom/core/dom/objects.EventListenerOptions} options - An object or boolean with the listener options
   * @returns {boolean}
   */
  const listenerOptions = options => {
    if (typeof listenerOptions.supportsOptions === 'undefined') {
      // Check if supportsOptions has been defined. This is a compatibility checking flag.
      listenerOptions.supportsOptions = true
      try {
        // If it is possible to use OptionsObject, then set our flag to true
        window.addEventListener('test', null, {capture: false, once: false, passive: false})
      } catch (err) {
        // When using an OptionsObjects fails, it is only possible to pass the boolean UseCapture as the option
        listenerOptions.supportsOptions = false
      }
    }
    return (typeof options === 'object' && listenerOptions.supportsOptions) ? options : false
  }

  /**
   * Provide compatibility for assigning listeners.
   * @function assignListener
   * @param {string} trigger - The name of the event which will trigger the listenerFunction on the element.
   * @param {HTMLElement|module:jDom/pseudoDom/objects~PseudoHTMLElement} elem - An element to append the listener onto
   * @param {module:jDom/core/dom/objects~listenerFunction|function} fn - The function which will be invoked when the event is triggered
   * @param {module:jDom/core/dom/objects.EventListenerOptions} options - Additional options to how the event will be fired
   * @returns {module:jDom/core/dom/objects~listenerFunction|function}
   */
  jDomCoreDom.assignListener = (trigger, elem, fn, options) => {
    elem.addEventListener
      ? elem.addEventListener(trigger, fn, listenerOptions(options))
      : elem['attachEvent'] ? elem['attachEvent'](`on${trigger}`, fn) : elem[`on${trigger}`] = fn
    return fn
  }

  /**
   * When there may be extra data needed for the event listener function
   * call this function may be used as a helper to pass the additional data.
   * Also, if it is desirable to add event listeners during run-time, this
   * function can be used to achieve this.
   * WARNING: This is a recursive function.
   * @function appendListeners
   * @param {module:jDom/core/dom/objects.DOMItem} item
   * @param {string} event
   * @param {string} listener
   * @param {Object} args
   * @param {module:jDom/core/dom/objects.EventListenerOptions} options
   * @returns {module:jDom/core/dom/objects.DOMItem}
   */
  jDomCoreDom.appendListeners = (item, event, listener, args = {}, options = false) => {
    // Default the item's children to empty array if it is unset
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
   * @param {module:jDom/core/dom/objects.DOMItem} item
   * @returns {module:jDom/core/dom/objects.DOMItem}
   */
  jDomCoreDom.bindAllListeners = item => jDomCore.mapProperty(
    (item.eventListeners && Object.keys(item.eventListeners).length && item.element.style)
      ? jDomCore.mapProperty(item.eventListeners, 'eventListeners', (attr, key) => jDomCoreDom.assignListener(key, item.element, e => attr.listenerFunc(e, item, attr.listenerArgs), attr.listenerOptions))
      : item,
    'children',
    i => jDomCoreDom.bindAllListeners(i)
  )

  /**
   * Based on the eventListeners property of the provided item, bind the
   * listeners to the associated element property for the provided jDomObjects.DOMItem.
   * @function bindListeners
   * @param {module:jDom/core/dom/objects.DOMItem} item
   * @returns {module:jDom/core/dom/objects.DOMItem}
   */
  jDomCoreDom.bindListeners = item => (item.eventListeners && Object.keys(item.eventListeners).length && item.element.style)
    ? jDomCore.mapProperty(item, 'eventListeners', (attr, event) => jDomCoreDom.assignListener(event, item.element, e => attr.listenerFunc(e, item, attr.listenerArgs), attr.listenerOptions))
    : item

  /**
   * A selector function for retrieving existing child jDomObjects.DOMItems from the given parent item.
   * This function will check all the children starting from item, and scan the attributes
   * property for matches. The return array contains children matching from all levels.
   * WARNING: This is a recursive function.
   * @function getChildrenFromAttribute
   * @param attr
   * @param value
   * @param {module:jDom/core/dom/objects.DOMItem} item
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
   * @param {module:jDom/core/dom/objects.DOMItem} item
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
   * @param {module:jDom/core/dom/objects.DOMItem} item
   * @param parent
   * @returns {module:jDom/core/dom/objects.DOMItem}
   */
  jDomCoreDom.renderHTML = (item, parent = jDomObjects.documentItem) => {
    jDomCore.mapObject(jDomObjects.createDOMItem(item), prop => prop, item)
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