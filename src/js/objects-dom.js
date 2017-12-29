'use strict'
// Core DOM Objects
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this

  /**
   * Store reference to any pre-existing module of the same name
   * @type {jDomObjects|*}
   */
  const previous_jDomObjects = root.jDomObjects

  /**
   * @typedef {Object} jDomObjects
   * @property {jDomObjects} jDomObjects
   * @property {Object} PseudoHTMLElement
   * @property {Object} PseudoHTMLDocument
   * @property {function} DOMItem
   * @property {function} documentDOMItem
   * @property {function} documentItem
   */

  /**
   * A reference to all functions to be used globally / exported
   * @type {jDomObjects}
   */
  const exportFunctions = {
    noConflict: () => {
      root.jDomObjects = previous_jDomObjects
      return exportFunctions
    }
  }

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
      console.error('objects-dom.js requires jDomCore')
    }
  }

  /**
   * Define mergeObjectsMutable as retrieved from jDomCore
   * @type {Function}
   */
  const mergeObjectsMutable = jDomCore.mergeObjectsMutable

  /**
   * Define mapObject as retrieved from jDomCore
   * @type {Function}
   */
  const mapObject = jDomCore.mapObject

  /**
   *
   */
  class PseudoHTMLElement {
    /**
     *
     * @param tagName
     * @param attributes
     * @param children
     * @returns {PseudoHTMLElement}
     */
    constructor ({tagName = 'div', attributes = [], children = []} = {}) {
      this.tagName = tagName
      this.attributes = []
      this.children = children
      this.style = {}
      for (let {name: n, value: v} of attributes) {
        this[n] = v
        this.attributes.push({name: n, value: v})
      }
      return this
    }

    /**
     *
     * @param tagName
     * @param attributes
     * @param children
     * @returns {PseudoHTMLElement}
     */
    static generate ({tagName = '', attributes = [], children = []} = {}) {
      return new PseudoHTMLElement({tagName: tagName, attributes: attributes, children: children})
    }

    /**
     *
     * @param childElement
     * @returns {*}
     */
    appendChild (childElement) {
      this.children.push(childElement)
      return childElement
    }

    /**
     *
     * @param childElement
     * @returns {T}
     */
    removeChild (childElement) {
      return this.children.splice(this.children.indexOf(childElement), 1)[0]
    }

    /**
     *
     * @param attributeName
     * @returns {boolean}
     */
    hasAttribute (attributeName) {
      return this.attributes.find((attribute) => attribute.name = attributeName) !== 'undefined'
    }

    /**
     *
     * @param attributeName
     * @param attributeValue
     * @returns {undefined}
     */
    setAttribute (attributeName, attributeValue) {
      if (this.hasAttribute(attributeName) || this[attributeName] === 'undefined') {
        this[attributeName] = attributeValue
        this.attributes.push({name: attributeName, value: attributeValue})
      }
      return undefined
    }

    /**
     *
     * @param attributeName
     * @returns {*}
     */
    getAttribute (attributeName) {
      return this.attributes.find((attribute) => attribute.name = attributeName)
    }

    /**
     *
     * @param attributeName
     */
    removeAttribute (attributeName) {
      if (this.hasAttribute(attributeName)) {
        delete this[attributeName]
        delete this.attributes.find((attribute) => attribute.name = attributeName)
      }
    }
  }

  exportFunctions.PseudoHTMLElement = PseudoHTMLElement

  /**
   *
   * @type {HTMLElement|PseudoHTMLElement}
   */
  const HTMLElement = this.HTMLElement || new PseudoHTMLElement()

  /**
   *
   */
  class PseudoHTMLDocument extends PseudoHTMLElement {
    /**
     *
     * @param tagName
     * @param attributes
     * @param children
     */
    constructor ({tagName = '', attributes = [], children = []} = {}) {
      super({tagName: tagName, attributes: attributes, children: children})
      const head = new PseudoHTMLElement({tagName: 'head'})
      const body = new PseudoHTMLElement({tagName: 'body'})
      this.head = head
      this.body = body
      this.children = [new PseudoHTMLElement({
        tagName: 'html',
        children: [head, body]
      })]
    }

    /**
     *
     * @param tagName
     * @returns {PseudoHTMLElement}
     */
    createElement (tagName = 'div') {
      return new PseudoHTMLElement({tagName: tagName})
    }
  }

  exportFunctions.PseudoHTMLDocument = PseudoHTMLDocument

  /**
   *
   * @type {Document|PseudoHTMLDocument}
   */
  const document = this.document || new PseudoHTMLDocument()

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
   * @property {Object.<string, string|Object>} attributes - All potential HTML element attributes can be defined here (including the defaulted style object)
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
      style: {}
    },
    element: {},
    eventListeners: {},
    parentItem: {},
    children: []
  }, ...attributes)
  exportFunctions.DOMItem = DOMItem

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
    })
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
    eventListeners: listeners.reduce((initial, listener) => mergeObjectsMutable(initial, {[`${listener.name}`]: listener}), {}),
    children: children,
    head: children[0],
    body: children[1]
  })

  /**
   * Return a DOMItem style reference to the document. The rootItem argument is a
   * system function and not necessary to implement.
   * @param {Array.<listenerFunction>} listeners - An array of all event listeners to be registered in the DOM
   * @param {Object} [rootItem=DOMItemRoot] - This is a reference to DOMItemRoot which will be defaulted with {@link initRoot}
   * @returns {DOMItemRoot}
   */
  const documentDOMItem = (listeners = [], rootItem = initRoot(initChildren(), listeners)) => {
    rootItem.children = rootItem.children.map(child => DOMItem(child, {parentItem: rootItem}))
    rootItem.head = rootItem.children[0]
    rootItem.body = rootItem.children[1]
    return DOMItem(rootItem)
  }
  exportFunctions.documentDOMItem = documentDOMItem

  /**
   * Create reference for storing document changes
   * @type {DOMItem}
   */
  exportFunctions.documentItem = documentDOMItem()

  /**
   * For each exported function, store a reference to similarly named functions from the global scope
   * @type {Object}
   */
  const previousExports = Object.keys(exportFunctions).reduce((start, next) => {
    start[next] = root[next]
    return start
  }, {})

  /**
   * Ensure each exported function has an a noConflict associated
   */
  mapObject(exportFunctions, (prop, key) => prop.noConflict = () => {
    root[key] = previousExports[key]
    return prop
  })

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = exportFunctions
    }
    exports = mergeObjectsMutable(exports, exportFunctions)
  } else {
    exportFunctions.jDomObjects = exportFunctions
    root = mergeObjectsMutable(root, exportFunctions)
  }
}).call(this) // Use the external context to assign this, which will be Window if rendered via browser
