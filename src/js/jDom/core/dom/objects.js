/**
 * @file Core objects for representing the DOM in JSON.
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
   * Verify availability of document
   * @type {HTMLDocument|PseudoHTMLDocument}
   */
  let document = root.document

  /**
   * If document remains undefined, attempt to retrieve it as a module
   */
  if (!Object.keys(root).length) {
    if (typeof require !== 'undefined') {
      // noinspection JSUnresolvedFunction
      root = require('../../pseudoDom/objects.js').generate(root)
      document = root.document
    } else {
      console.error('objects.js requires jDomPseudoDom')
    }
  }

  /**
   * Store reference to any pre-existing module of the same name
   * @type {jDomObjects|*}
   */
  const previousJDomObjects = root.jDomObjects || {}

  /**
   * All methods exported from this module are encapsulated within jDomObjects
   * @author Joshua Heagle <contact@joshuaheagle.com>
   * @typedef {Object} jDomObjects
   * @module jDom/core/dom/objects
   */
  const jDomObjects = {}
  root.jDomObjects = jDomObjects

  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {jDomObjects}
   */
  jDomObjects.noConflict = () => {
    root.jDomObjects = previousJDomObjects
    return jDomObjects
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
      console.error('objects.js requires jDomCore')
    }
  }

  /**
   * This is the standard definition of a listenerFunction to be used
   * @callback jDomObjects.listenerFunction
   * @callback listenerFunction
   * @param {Event} e - The event object passed to the listener
   * @param {module:jDom/core/dom/objects.DOMItem} target - The element which triggered the event
   * @param {...*} [args] - Optional args as required by the listener
   */

  /**
   * A Boolean indicating whether events of this type will be dispatched to the registered listerFunction before being dispatched to any EventTarget beneath it in the DOM tree.
   * @typedef {boolean} module:jDom/core/dom/objects.UseCapture
   */

  /**
   * OptionsObject defines the structure for the options to be passed to addEventListener
   * @typedef {Object} module:jDom/core/dom/objects.OptionsObject
   * @property {boolean} capture - Indicate that events of this type will be dispatched to the registered listenerFunction before being dispatched to any EventTarget beneath it in the DOM tree.
   * @property {boolean} once - Indicate that the listenerFunction should be invoked at most once after being added. If 'true', the listenerFunction would be automatically removed when invoked.
   * @property {boolean} passive - Indicate that, if 'true', indicates that the listenerFunction will never call preventDefault(). If preventDefault() is called, the user agent will do nothing with it.
   */

  /**
   * EventListenerOptions is either a boolean as UseCapture or an Object as OptionsObject
   * @typedef {module:jDom/core/dom/objects.OptionsObject|module:jDom/core/dom/objects.UseCapture} module:jDom/core/dom/objects.EventListenerOptions
   */

  /**
   * An EventListener Object to be appended to the element within the DOMItem
   * @typedef {Object} jDomObjects.EventListener
   * @typedef {Object} EventListener
   * @property {string} listenerFunc - A string function name matching an existing {@link module:jDom/core/dom/objects~listenerFunction}.
   * @property {Object} listenerArgs - Additional args required for the listener function
   * @property {module:jDom/core/dom/objects.EventListenerOptions} listenerOptions - Provides support for options parameter of addEventListener, or false for default
   */

  /**
   * DOMItem defines the structure for a single element in the DOM
   * @typedef {Object} module:jDom/core/dom/objects.DOMItem
   * @property {string} tagName - This is any valid HTMLElement tagName
   * @property {Object.<string, string|Object>} attributes - All potential HTML element attributes can be defined here (including the defaulted style object)
   * @property {(Object|HTMLElement)} element - A reference to an existing HTML element will be stored here (default empty object)
   * @property {Object.<Event, module:jDom/core/dom/objects~EventListener>} eventListeners - An object holding all events to be registered for the associated element
   * @property {module:jDom/core/dom/objects.DOMItem} parentItem - A reference to the parent of this object
   * @property {Array.<module:jDom/core/dom/objects.DOMItem>} children - A reference to an array of child objects
   */

  /**
   * This is the basic Object for representing the DOM in a virtual perspective. All incoming attributes will be merged to the specified format.
   * @function createDOMItem
   * @param {...Object} attributes - DOMItem-like object(s) to be merged as a DOMItem
   * @returns {module:jDom/core/dom/objects.DOMItem}
   */
  jDomObjects.createDOMItem = (...attributes) => jDomCore.mergeObjectsMutable({
    tagName: 'div',
    attributes: {
      style: {}
    },
    element: {},
    eventListeners: {},
    parentItem: {},
    children: []
  }, ...attributes)

  /**
   * DOMItemHead defines the structure for a single element in the DOM
   * @typedef {module:jDom/core/dom/objects.DOMItem} jDomObjects.DOMItemHead
   * @typedef {module:jDom/core/dom/objects.DOMItem} DOMItemHead
   * @property {string} [tagName=head] - This is set to the string head referring to the HTML element of the same name
   * @property {Object.<string, string|Object>} attributes - All potential HTML element attributes can be defined here
   * @property {HTMLHeadElement} element - A reference to the HTML head element
   * @property {Array.<module:jDom/core/dom/objects.DOMItem>} children - A reference to an array of child objects
   */

  /**
   * DOMItemBody defines the structure for a single element in the DOM
   * @typedef {module:jDom/core/dom/objects.DOMItem} jDomObjects.DOMItemBody
   * @typedef {module:jDom/core/dom/objects.DOMItem} DOMItemBody
   * @property {string} [tagName=body] - This is set to the string body referring to the HTML element of the same name
   * @property {Object.<string, string|Object>} attributes - All potential HTML element attributes can be defined here
   * @property {HTMLElement} element - A reference to the HTML body element
   * @property {Array.<module:jDom/core/dom/objects.DOMItem>} children - A reference to an array of child objects
   */

  /**
   * Initiate the children of Root / DocumentItem. This is a helper for {@link documentDOMItem}.
   * @returns {Array.<module:jDom/core/dom/objects~DOMItemHead|module:jDom/core/dom/objects~DOMItemBody>}
   */
  const initChildren = () => [
    jDomObjects.createDOMItem({
      tagName: 'head',
      attributes: {},
      element: document.head,
      children: []
    }),
    jDomObjects.createDOMItem({
      tagName: 'body',
      attributes: {},
      element: document.body,
      children: []
    })
  ]

  /**
   * DOMItemRoot defines the structure for a single element in the DOM
   * @typedef {module:jDom/core/dom/objects.DOMItem} jDomObjects.DOMItemRoot
   * @typedef {module:jDom/core/dom/objects.DOMItem} DOMItemRoot
   * @property {string} [tagName=html] - This is set to the string html referring to the HTML element of the same name
   * @property {Object} attributes - Empty object as attributes placeholder
   * @property {HTMLDocument} element - A reference to the entire Document
   * @property {Object.<string, module:jDom/core/dom/objects~listenerFunction>} eventListeners - all registered listeners stored as listener name and function pairs
   * @property {Array.<module:jDom/core/dom/objects~DOMItemHead|module:jDom/core/dom/objects~DOMItemBody>} children - Two references: for head and body
   * @property {module:jDom/core/dom/objects~DOMItemHead} head - A specific reference to head item
   * @property {module:jDom/core/dom/objects~DOMItemBody} body - A specific reference to body item
   */

  /**
   * Initiate the Root for DocumentItem. This is primary a helper for {@link documentDOMItem}.
   * @param {Array.<module:jDom/core/dom/objects~DOMItemHead|module:jDom/core/dom/objects~DOMItemBody>} children - Provide an array of Head and Body (usually via {@link initChildren})
   * @param {Object.<string, module:jDom/core/dom/objects~listenerFunction>} listeners - An object of all event listeners to be registered in the DOM
   * @returns {module:jDom/core/dom/objects~DOMItemRoot|module:jDom/core/dom/objects.DOMItem}
   */
  const initRoot = (children, listeners = {}) => jDomObjects.createDOMItem({
    tagName: 'html',
    attributes: {},
    element: document,
    eventListeners: listeners,
    children: children,
    head: children[0],
    body: children[1]
  })

  /**
   * Return a DOMItem reference to the document. The rootItem argument is a system variable and not necessary to
   * implement.
   * @function documentDOMItem
   * @param {Object.<string, module:jDom/core/dom/objects~listenerFunction>} listeners - An object of all event listeners to be registered in the DOM
   * @param {module:jDom/core/dom/objects~DOMItemRoot|module:jDom/core/dom/objects.DOMItem} [rootItem] - This is a reference to DOMItemRoot which will be defaulted with {@link initRoot}
   * @returns {module:jDom/core/dom/objects~DOMItemRoot|module:jDom/core/dom/objects.DOMItem}
   */
  jDomObjects.documentDOMItem = (listeners = [], rootItem = initRoot(initChildren(), listeners)) => {
    rootItem.children = rootItem.children.map(child => jDomObjects.createDOMItem(child, {parentItem: rootItem}))
    // noinspection JSUndefinedPropertyAssignment
    rootItem.head = rootItem.children[0]
    // noinspection JSUndefinedPropertyAssignment
    rootItem.body = rootItem.children[1]
    return jDomObjects.createDOMItem(rootItem)
  }

  /**
   * Create reference for storing document changes
   * @member documentItem
   * @type {module:jDom/core/dom/objects~DOMItemRoot}
   */
  jDomObjects.documentItem = jDomObjects.documentDOMItem()

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = jDomObjects
    }
    exports = Object.assign(exports, jDomObjects)
  }
}).call(this || window || base || {}) // Use the external context to assign this, which will be Window if rendered via browser
