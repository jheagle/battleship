'use strict'
// Pseudo DOM Helper Objects
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this || {}

  /**
   * Store reference to any pre-existing module of the same name
   * @type {jDomPseudoDom|*}
   */
  const previousJDomPseudoDom = root.jDomPseudoDom || {}

  /**
   * A reference to all functions to be used globally / exported
   * @typedef {Object} jDomPseudoDom
   * @module jDom/pseudoDom/objects
   */
  const jDomPseudoDom = {}
  root.jDomPseudoDom = jDomPseudoDom

  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {jDomPseudoDom}
   */
  jDomPseudoDom.noConflict = () => {
    root.jDomPseudoDom = previousJDomPseudoDom
    return jDomPseudoDom
  }

  /**
   * Verify availability of jDomCore
   * @typedef {*|module:jDom/core/core} jDomCore
   */
  let jDomCore = root.jDomCore

  /**
   * If gameUtils remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomCore === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomCore = require('../core/core.js')
    } else {
      console.error('pseudoDom/objects.js requires jDom/core/core')
    }
  }

  /**
   * A selector function for retrieving existing child jDomObjects.DOMItems from the given parent item.
   * This function will check all the children starting from item, and scan the attributes
   * property for matches. The return array contains children matching from all levels.
   * WARNING: This is a recursive function.
   * @param attr
   * @param value
   * @param node
   * @returns {Array}
   */
  const getParentNodesFromAttribute = (attr, value, node) =>
    !Object.keys(node.parent).length
      ? []
      : (node[attr] || false) === value
      ? getParentNodesFromAttribute(attr, value, node.parent).concat([node])
      : getParentNodesFromAttribute(attr, value, node.parent)

  /**
   * A helper selector function for retrieving existing child jDomObjects.DOMItems from the given parent item.
   * @param node
   * @returns {Array}
   */
  const getParentNodes = jDomCore.curry(getParentNodesFromAttribute)('', false)

  class IterableList {
    constructor (values = []){
      this.innerArray = values
    }
    [Symbol.iterator](){
      return this.innerArray.values()
    }
  }

  /**
   * @class
   * @property {boolean} bubbles - A Boolean indicating whether the event bubbles up through the DOM or not.
   * @property {boolean} cancelable - A Boolean indicating whether the event is cancelable.
   * @property {boolean} composed - A Boolean value indicating whether or not the event can bubble across the boundary
   * between the shadow DOM and the regular DOM.
   * @property {function|PseudoEventTarget} currentTarget - A reference to the currently registered target for the event. This
   * is the object to which the event is currently slated to be sent; it's possible this has been changed along the way
   * through re-targeting.
   * @property {boolean} defaultPrevented - Indicates whether or not event.preventDefault() has been called on the event.
   * @property {string} eventPhase - Indicates which phase of the event flow is being processed.
   * @property {EventTarget|PseudoEventTarget} target - A reference to the target to which the event was originally
   * dispatched.
   * @property {int} timeStamp - The time at which the event was created (in milliseconds). By specification, this
   * value is time since epoch, but in reality browsers' definitions vary; in addition, work is underway to change this
   * to be a DOMHighResTimeStamp instead.
   * @property {string} type - The name of the event (case-insensitive).
   * @property {boolean} isTrusted - Indicates whether or not the event was initiated by the browser (after a user
   * click for instance) or by a script (using an event creation method, like event.initEvent)
   * @property {function} createEvent - Creates a new event, which must then be initialized by calling its initEvent()
   * method.
   * @property {function} initEvent - Initializes the value of an Event created. If the event has already being
   * dispatched, this method does nothing.
   * @property {function} preventDefault - Cancels the event (if it is cancelable).
   * @property {function} stopImmediatePropagation - For this particular event, no other listener will be called.
   * Neither those attached on the same element, nor those attached on elements which will be traversed later (in
   * capture phase, for instance)
   * @property {function} stopPropagation - Stops the propagation of events further along in the DOM.
   */
  class PseudoEvent {
    /**
     *
     * @param typeArg
     * @param bubbles
     * @param cancelable
     * @param composed
     * @returns {PseudoEvent}
     * @constructor
     */
    constructor (typeArg, {bubbles = false, cancelable = false, composed = false} = {}) {
      this.bubbles = bubbles
      this.cancelable = cancelable
      this.composed = composed
      this.currentTarget = () => undefined
      this.defaultPrevented = false
      this.eventPhase = ''
      this.target = new PseudoEventTarget
      this.timeStamp = Math.floor(Date.now() / 1000)
      this.type = typeArg
      this.isTrusted = true
    }

    // noinspection JSUnusedGlobalSymbols
    createEvent (type = '') {
      return new this(type)
    }

    // noinspection JSUnusedGlobalSymbols
    initEvent (type, bubbles, cancelable) {
      this.type = type
      this.bubbles = bubbles
      this.cancelable = cancelable
      this.isTrusted = false
      return this
    }

    preventDefault () {
      this.defaultPrevented = true
      return null
    }

    // noinspection JSUnusedGlobalSymbols
    stopImmediatePropagation () {
      this.bubbles = false
      this.defaultPrevented = true
      return null
    }

    // noinspection JSUnusedGlobalSymbols
    stopPropagation () {
      this.bubbles = false
      return null
    }

    dispatch (options) {
      const bubbleGroup = getParentNodes(this.target)
      this.eventPhase = 'capture'
      const captureGroup = bubbleGroup.slice().reverse()
      captureGroup.forEach((target) => this.currentTarget = target)
      if (!options.capture) {
        this.eventPhase = 'bubble'
        bubbleGroup.forEach((target) => this.currentTarget = target)
      }
      this.target.dispatchEvent(this)
    }

  }

  jDomPseudoDom.PseudoEvent = PseudoEvent

  /**
   * @class
   * @property {Object} listeners
   * @property {function} addEventListener
   * @property {function} removeEventListener
   * @property {function} dispatchEvent
   */
  class PseudoEventTarget {
    /**
     * @constructor
     */
    constructor () {
      this.listeners = []
    }

    /**
     *
     * @param {string} type
     * @param {function} callback
     * @param {boolean|Object} [useCapture=false]
     */
    addEventListener (type, callback, useCapture = false) {
      let options = {capture: false, once: false, passive: false}
      if (typeof useCapture === 'object') {
        options = Object.keys(useCapture).reduce((opts, opt) => {
          opts[opt] = useCapture[opt]
          return opts
        }, options)
      } else {
        options.capture = useCapture
      }
      if (!(type in this.listeners)) {
        this[type] = () => {
          const event = new PseudoEvent(type)
          event.target = this
          event.currentTarget = this
          return event.dispatch(options)
        }
        this.listeners[type] = []
      }
      this.listeners[type].push(callback.bind(this))
    }

    /**
     *
     * @param {string} type
     * @param {function} callback
     */
    removeEventListener (type, callback) {
      if (!(type in this.listeners)) {
        return
      }
      const stack = this.listeners[type]
      for (let i = 0, l = stack.length; i < l; i++) {
        if (stack[i] === callback) {
          stack.splice(i, 1)
          return
        }
      }
    }

    /**
     *
     * @param {Event|PseudoEvent} event
     * @returns {boolean}
     */
    dispatchEvent (event) {
      if (!(event.type in this.listeners)) {
        return true
      }
      const stack = this.listeners[event.type]

      for (let i = 0, l = stack.length; i < l; i++) {
        stack[i].call(this, event)
      }
      return !event.defaultPrevented
    }
  }

  jDomPseudoDom.PseudoEventTarget = PseudoEventTarget

  /**
   * @class
   * @augments PseudoEventTarget
   * @property {string} name
   * @property {Object} parent
   * @property {Array} children
   * @property {function} appendChild
   * @property {function} removeChild
   */
  class PseudoNode extends PseudoEventTarget {
    /**
     *
     * @param {PseudoNode|Object} [parent={}]
     * @param {Array} [children=[]]
     * @constructor
     */
    constructor ({parent = {}, children = []} = {}) {
      super()
      this.parent = parent
      this.children = children
    }

    /**
     *
     * @param {PseudoNode|PseudoElement|PseudoEvent} childElement
     * @returns {PseudoNode}
     */
    appendChild (childElement) {
      childElement.parent = this
      this.children = this.children.concat([childElement])
      if (/^(button|input)$/i.test(childElement.tagName) && (childElement.type || '').toLowerCase() === 'submit') {
        const forms = getParentNodesFromAttribute('tagName', 'form', childElement)
        childElement.addEventListener('click', () => forms[0].submit())
      }
      return childElement
    }

    /**
     *
     * @param {PseudoNode} childElement
     * @returns {PseudoNode}
     */
    removeChild (childElement) {
      return this.children.splice(this.children.indexOf(childElement), 1)[0]
    }
  }

  jDomPseudoDom.PseudoNode = PseudoNode

  /**
   * @class
   * @augments PseudoNode
   * @property {string} tagName
   * @property {string} className
   * @property {string} id
   * @property {string} innerHtml
   * @property {Array} attributes
   * @property {function} hasAttribute
   * @property {function} setAttribute
   * @property {function} getAttribute
   * @property {function} removeAttribute
   */
  class PseudoElement extends PseudoNode {
    /**
     * Simulate the Element object when the DOM is not available
     * @param {string} [tagName=''] - The
     * @param {array} [attributes=[]]
     * @param {PseudoNode|Object} [parent={}]
     * @param {Array} [children=[]]
     * @constructor
     */
    constructor ({tagName = '', attributes = [], parent = {}, children = []} = {}) {
      super({parent, children})
      this.tagName = tagName
      this.attributes = attributes.concat([
        {name: 'className', value: ''},
        {name: 'id', value: ''},
        {name: 'innerHTML', value: ''}
      ])

      /**
       * Map all incoming attributes to the attributes array and attach each as a property of this element
       */
      this.attributes.map(({name, value}) => {
        this[name] = value
        return {name, value}
      })

      this.classList = new DOMSettableTokenList(this.className)
    }

    /**
     * Check if an attribute is assigned to this element.
     * @param {string} attributeName - The attribute name to check
     * @returns {boolean}
     */
    hasAttribute (attributeName) {
      return this.getAttribute(attributeName) !== 'undefined'
    }

    /**
     * Assign a new attribute or overwrite an assigned attribute with name and value.
     * @param {string} attributeName - The name key of the attribute to append
     * @param {string|Object} attributeValue - The value of the attribute to append
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
     * Retrieve the value of the specified attribute from the Element
     * @param {string} attributeName - A string representing the name of the attribute to be retrieved
     * @returns {string|Object}
     */
    getAttribute (attributeName) {
      return this.attributes.find(attribute => attribute.name === attributeName)
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Remove an assigned attribute from the Element
     * @param {string} attributeName - The string name of the attribute to be removed
     * @returns {null}
     */
    removeAttribute (attributeName) {
      if (this.hasAttribute(attributeName)) {
        delete this[attributeName]
        delete this.getAttribute(attributeName)
      }
      return null
    }
  }

  jDomPseudoDom.PseudoElement = PseudoElement

  /**
   * Simulate a HTMLElement when the DOM is unavailable
   * @class
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
  class PseudoHTMLElement extends PseudoElement {
    /**
     * Simulate the HTMLELement object when the DOM is not available
     * @param {string} [tagName=''] - The
     * @param {PseudoNode|Object} [parent={}]
     * @param {Array} [children=[]]
     * @returns {PseudoHTMLElement}
     * @constructor
     */
    constructor ({tagName = '', parent = {}, children = []} = {}) {
      super({
        tagName,
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
        parent,
        children
      })
    }
  }

  jDomPseudoDom.PseudoHTMLElement = PseudoHTMLElement

  /**
   * A representation of HTMLElement object when it is not available.
   * @class
   * @augments PseudoHTMLElement
   * @property {PseudoHTMLElement} head - A reference to the Head child element
   * @property {PseudoHTMLElement} body - A reference to the Body child element
   * @property {function} createElement - Generate a new PseudoHTMLElement with parent of document
   */
  class PseudoHTMLDocument extends PseudoHTMLElement {
    /**
     * The root HTML element is acts as the parent to all HTML elements in the document.
     * @returns {PseudoHTMLDocument}
     * @constructor
     */
    constructor () {
      super()

      const html = new PseudoHTMLElement({tagName: 'html', parent: this})
      /**
       * Create document head element
       * @type {PseudoHTMLElement}
       */
      this.head = new PseudoHTMLElement({tagName: 'head', parent: html})

      /**
       * Create document body element
       * @type {PseudoHTMLElement}
       */
      this.body = new PseudoHTMLElement({tagName: 'body', parent: html})

      html.children = [this.head, this.body]

      /**
       * Create document child element
       * @type {PseudoHTMLElement[]}
       */
      this.children = [html]
    }

    /**
     * Create and return a PseudoHTMLElement
     * @param {string} tagName - Tag Name is a string representing the type of DOM element this represents
     * @returns {PseudoHTMLElement}
     */
    createElement (tagName = 'div') {
      const returnElement = new PseudoHTMLElement({tagName})
      returnElement.parent = this
      return returnElement
    }
  }

  jDomPseudoDom.PseudoHTMLDocument = PseudoHTMLDocument

  /**
   * Construct the Pseudo DOM to provide access to DOM objects which are otherwise not available outside of the browser
   * context.
   * @function generate
   * @param {Object} context
   * @returns {Window|PseudoEventTarget}
   */
  jDomPseudoDom.generate = (context = {}) => {
    /**
     *
     * @type {Window|PseudoEventTarget}
     */
    const window = typeof root.document === 'undefined' ? root : new PseudoEventTarget()

    /**
     * @type {Node|PseudoNode}
     */
    const Node = root.Node || new PseudoNode()
    if (typeof window.Node === 'undefined') {
      window['Node'] = Node
    }

    /**
     *
     * @type {Element|PseudoElement}
     */
    const Element = root.Element || new PseudoElement()
    if (typeof window.Element === 'undefined') {
      window['Element'] = Element
    }

    /**
     * Create an instance of HTMLElement if not available
     * @type {HTMLElement|PseudoHTMLElement}
     */
    const HTMLElement = root.HTMLElement || new PseudoHTMLElement()
    if (typeof window.HTMLElement === 'undefined') {
      window['HTMLElement'] = HTMLElement
    }

    /**
     * Define document when not available
     * @type {Document|PseudoHTMLDocument}
     */
    const document = root.document || new PseudoHTMLDocument()
    if (typeof window.document === 'undefined') {
      window.document = document
    }

    return context ? Object.assign(context, jDomPseudoDom, window) : Object.assign(root, window)
  }

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = jDomPseudoDom
    }
    exports = Object.assign(exports, jDomPseudoDom)
  }
}).call(this || window || base || {}) // Use the external context to assign this, which will be Window if rendered via browser