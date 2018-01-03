'use strict'
// Pseudo DOM Helper Objects
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this

  /**
   * Store reference to any pre-existing module of the same name
   * @type {jDomPseudoDom|*}
   */
  const previous_jDomPseudoDom = root.jDomPseudoDom

  /**
   * All methods exported from this module are encapsulated within jDomPseudoDom.
   * @typedef {Object} jDomPseudoDom
   * @property {jDomPseudoDom} jDomPseudoDom
   * @property {function} generate
   * @property {function} noConflict
   * @property {function} pseudoElement
   * @property {function} pseudoEventTarget
   * @property {function} pseudoHTMLDocument
   * @property {function} pseudoHTMLElement
   * @property {function} pseudoNode
   */

  /**
   * A reference to all functions to be used globally / exported
   * @type {jDomObjects}
   */
  const exportFunctions = {
    noConflict: () => {
      root.jDomPseudoDom = previous_jDomPseudoDom
      return exportFunctions
    }
  }

  /**
   * @typedef {Object} PseudoEventTarget
   * @property {Object} listeners
   * @property {function} addEventListener
   * @property {function} removeEventListener
   * @property {function} dispatchEvent
   */

  /**
   *
   * @returns {PseudoEventTarget}
   * @constructor
   */
  const pseudoEventTarget = () => {
    /**
     *
     * @type {PseudoEventTarget}
     */
    const returnEventTarget = Object.assign({}, {
      listeners: {}
    })

    /**
     *
     * @param {string} type
     * @param {function} callback
     * @param {...} [options]
     */
    returnEventTarget.addEventListener = (type, callback, ...options) => {
      if (!(type in returnEventTarget.listeners)) {
        returnEventTarget.listeners[type] = []
      }
      returnEventTarget.listeners[type].push(callback)
    }

    /**
     *
     * @param {string} type
     * @param {function} callback
     */
    returnEventTarget.removeEventListener = (type, callback) => {
      if (!(type in returnEventTarget.listeners)) {
        return
      }
      const stack = returnEventTarget.listeners[type]
      for (let i = 0, l = stack.length; i < l; i++) {
        if (stack[i] === callback) {
          stack.splice(i, 1)
          return
        }
      }
    }

    /**
     *
     * @param {Object} event
     * @returns {boolean}
     */
    returnEventTarget.dispatchEvent = (event) => {
      if (!(event.type in returnEventTarget.listeners)) {
        return true
      }
      const stack = returnEventTarget.listeners[event.type]

      for (let i = 0, l = stack.length; i < l; i++) {
        stack[i].call(returnEventTarget, event)
      }
      return !event.defaultPrevented
    }
    return returnEventTarget
  }
  exportFunctions.pseudoEventTarget = pseudoEventTarget

  /**
   * @typedef {Object} PseudoNode
   * @property {string} name
   * @property {Object} parent
   * @property {Array} children
   * @property {function} appendChild
   * @property {function} removeChild
   */

  /**
   *
   * @param {PseudoNode} [parent=null]
   * @param {Array} [children=[]]
   * @returns {PseudoNode}
   * @constructor
   */
  const pseudoNode = ({parent = null, children = []} = {}) => {
    /**
     *
     * @type {PseudoNode}
     */
    const returnNode = Object.assign({}, {
      name: 'Node',
      parent: parent,
      children: children
    })

    /**
     *
     * @param {PseudoNode} childElement
     * @returns {PseudoNode}
     */
    returnNode.appendChild = (childElement) => {
      childElement.parent = returnNode
      returnNode.children = returnNode.children.concat([childElement])
      return childElement
    }

    /**
     *
     * @param {PseudoNode} childElement
     * @returns {PseudoNode}
     */
    returnNode.removeChild = (childElement) => returnNode.children.splice(returnNode.children.indexOf(childElement), 1)[0]
    return returnNode
  }
  exportFunctions.pseudoNode = pseudoNode

  /**
   * @typedef {PseudoNode} PseudoElement
   * @augments PseudoEventTarget
   * @augments PseudoNode
   * @property {string} tagName
   * @property {Array} attributes
   * @property {function} hasAttribute
   * @property {function} setAttribute
   * @property {function} getAttribute
   * @property {function} removeAttribute
   */

  /**
   * Simulate the Element object when the DOM is not available
   * @param {string} [tagName=''] - The
   * @param {array} [attributes=[]]
   * @param {array} [children=[]]
   * @returns {PseudoElement}
   * @constructor
   */
  const pseudoElement = ({tagName = '', attributes = [], children = []} = {}) => {
    /**
     * Create the element to be returned
     * @type {PseudoElement}
     */
    const returnElement = Object.assign(
      {},
      pseudoEventTarget(),
      pseudoNode({children: children}),
      {
        name: 'Element',
        tagName: tagName,
        attributes: attributes.concat([
          {name: 'className', value: ''},
          {name: 'id', value: ''},
          {name: 'innerHTML', value: ''}
        ])
      }
    )

    /**
     * Map all incoming attributes to the attributes array and attach each as a property of this element
     */
    returnElement.attributes.map(({name: n, value: v}) => {
      returnElement[n] = v
      return {name: n, value: v}
    })

    /**
     * Check if an attribute is assigned to this element.
     * @param {string} attributeName - The attribute name to check
     * @returns {boolean}
     */
    returnElement.hasAttribute = (attributeName) => returnElement.attributes.find((attribute) => attribute.name = attributeName) !== 'undefined'

    /**
     * Assign a new attribute or overwrite an assigned attribute with name and value.
     * @param {string} attributeName - The name key of the attribute to append
     * @param {string|Object} attributeValue - The value of the attribute to append
     * @returns {undefined}
     */
    returnElement.setAttribute = (attributeName, attributeValue) => {
      if (returnElement.hasAttribute(attributeName) || returnElement[attributeName] === 'undefined') {
        returnElement[attributeName] = attributeValue
        returnElement.attributes.push({name: attributeName, value: attributeValue})
      }
      return undefined
    }

    /**
     * Retrieve the value of the specified attribute from the Element
     * @param {string} attributeName - A string representing the name of the attribute to be retrieved
     * @returns {string|Object}
     */
    returnElement.getAttribute = (attributeName) => returnElement.attributes.find((attribute) => attribute.name = attributeName)

    /**
     * Remove an assigned attribute from the Element
     * @param {string} attributeName - The string name of the attribute to be removed
     * @returns {null}
     */
    returnElement.removeAttribute = (attributeName) => {
      if (returnElement.hasAttribute(attributeName)) {
        delete returnElement[attributeName]
        delete returnElement.attributes.find((attribute) => attribute.name = attributeName)
      }
      return null
    }
    return returnElement
  }
  exportFunctions.pseudoElement = pseudoElement

  /**
   * Simulate a HTMLElement when the DOM is unavailable
   * @typedef {PseudoElement} PseudoHTMLElement
   * @augments PseudoElement
   * @property {boolean} hidden - State of whether element is visible
   * @property {number} offsetHeight - The height of the element as offset by the parent element
   * @property {number} offsetLeft - The position of the left side of the element based on the parent element
   * @property {PseudoHTMLElement} offsetParent - A reference to the closest positioned parent element
   * @property {number} offsetTop - The position of the top side of the element based on the parent element
   * @property {number} offsetWidth - The width of the element as offset by the parent element
   * @property {Object} style - A container to define all applied inline-styles
   * @property {string} title - The title attribute which affects the text visible on hover
   */

  /**
   *
   * @param {string} [tagName=div]
   * @returns {PseudoHTMLElement}
   * @constructor
   */
  const pseudoHTMLElement = (tagName = 'div') => Object.assign(
    {},
    pseudoElement({
      tagName: tagName,
      attributes: [
        {name: 'hidden', value: false},
        {name: 'offsetHeight', value: 0},
        {name: 'offsetLeft', value: 0},
        {name: 'offsetParent', value: null},
        {name: 'offsetTop', value: 0},
        {name: 'offsetWidth', value: 0},
        {name: 'style', value: {}},
        {name: 'title', value: ''}
      ],
      children: []
    }),
    {name: 'HTMLElement'}
  )
  exportFunctions.pseudoHTMLElement = pseudoHTMLElement

  /**
   * A representation of HTMLElement object when it is not available.
   * @typedef {PseudoHTMLElement} PseudoHTMLDocument
   * @augments PseudoHTMLElement
   * @property {PseudoHTMLElement} head - A reference to the Head child element
   * @property {PseudoHTMLElement} body - A reference to the Body child element
   * @property {function} createElement - Generate a new PseudoHTMLElement with parent of document
   */

  /**
   * The root HTML element is acts as the parent to all HTML elements in the document.
   * @returns {PseudoHTMLDocument}
   * @constructor
   */
  const pseudoHTMLDocument = () => {
    /**
     * Create document head element
     * @type {PseudoHTMLElement}
     */
    const head = pseudoHTMLElement('head')

    /**
     * Create document body element
     * @type {PseudoHTMLElement}
     */
    const body = pseudoHTMLElement('body')

    /**
     * Create document child element
     * @type {PseudoHTMLElement}
     */
    const html = pseudoHTMLElement('html')
    html.children = [head, body]

    /**
     * Define the Object to be returned
     * @type {PseudoHTMLDocument}
     */
    const returnHTMLDocument = Object.assign(
      {},
      pseudoHTMLElement(),
      {
        name: 'HTMLDocument',
        head: head,
        body: body,
        children: [html]
      }
    )

    /**
     * Create and return a PseudoHTMLElement
     * @param {string} tagName - Tag Name is a string representing the type of DOM element this represents
     * @returns {PseudoHTMLElement}
     */
    returnHTMLDocument.createElement = (tagName = 'div') => {
      const returnElement = pseudoHTMLElement(tagName)
      returnElement.parent = returnHTMLDocument
      return returnElement
    }
    html.parent = returnHTMLDocument
    head.parent = body.parent = html
    return returnHTMLDocument
  }
  exportFunctions.pseudoHTMLDocument = pseudoHTMLDocument

  /**
   *
   * @param {Object} context
   * @returns {Window|PseudoEventTarget}
   */
  exportFunctions.generate = (context = {}) => {
    /**
     *
     * @type {Window|PseudoEventTarget}
     */
    const window = typeof root.document === 'undefined' ? root : pseudoEventTarget()

    /**
     * @type {Node|PseudoNode}
     */
    const Node = root.Node ? root.Node : pseudoNode()
    if (typeof window.Node === 'undefined') {
      window.Node = Node
    }

    /**
     *
     * @type {Element|PseudoElement}
     */
    const Element = root.Element = root.Element || pseudoElement()
    if (typeof window.Element === 'undefined') {
      window.Element = Element
    }

    /**
     * Create an instance of HTMLElement if not available
     * @type {HTMLElement|PseudoHTMLElement}
     */
    const HTMLElement = root.HTMLElement || pseudoHTMLElement()
    if (typeof window.HTMLElement === 'undefined') {
      window.HTMLElement = HTMLElement
    }

    /**
     * Define document when not available
     * @type {Document|PseudoHTMLDocument}
     */
    const document = root.document || pseudoHTMLDocument()
    if (typeof window.document === 'undefined') {
      window.document = document
    }

    return Object.assign(root, window)
  }

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
  Object.keys(exportFunctions).map((key) => exportFunctions[key].noConflict = () => {
    root[key] = previousExports[key]
    return exportFunctions[key]
  })

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = exportFunctions
    }
    exports = Object.assign(exports, exportFunctions)
  } else {
    exportFunctions.jDomPseudoDom = exportFunctions
    root = Object.assign(root, exportFunctions)
  }
}).call(this) // Use the external context to assign this, which will be Window if rendered via browser
