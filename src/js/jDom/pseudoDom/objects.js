/**
 * @file All of the Pseudo Dom Helper Objects functions for simulating parts of the DOM when running scripts in NodeJs.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
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
  const previousJDomPseudoDom = root.jDomPseudoDom || {}

  /**
   * All methods exported from this module are encapsulated within jDomPseudoDom.
   * @author Joshua Heagle <joshuaheagle@gmail.com>
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

  class IterableList {
    constructor (values = []) {
      this.innerArray = values
    }

    get length () {
      return this.innerArray.length
    }

    forEach (callback) {
      for (let item of this.innerArray) {
        callback(item)
      }
      // return this.innerArray.forEach(callback)
    }

    [Symbol.iterator] () {
      let index = -1
      let inner = this.innerArray

      return {
        next: () => ({value: inner[++index], done: !(index in inner)})
      }
    }
  }

  let someList = new IterableList(['one', 'two', 'three', 'four'])
  console.log(someList)
  for (let item of someList) {
    console.log('iterating items', item)
  }
  someList.forEach(item => {
    console.log('iterating items', item)
  })
  console.log(someList.length)
  console.log(Array.from(someList))

  /**
   * @type {PseudoEvent}
   */
  jDomPseudoDom.PseudoEvent = require('./class/PseudoEvent')
  /**
   * @type {PseudoEventTarget}
   */
  jDomPseudoDom.PseudoEventTarget = require('./class/PseudoEventTarget')
  /**
   * @type {PseudoNode}
   */
  jDomPseudoDom.PseudoNode = require('./class/PseudoNode')
  /**
   * @type {PseudoElement}
   */
  jDomPseudoDom.PseudoElement = require('./class/PseudoElement')
  /**
   * @type {PseudoHTMLElement}
   */
  jDomPseudoDom.PseudoHTMLElement = require('./class/PseudoHTMLElement')
  /**
   * @type {PseudoHTMLDocument}
   */
  jDomPseudoDom.PseudoHTMLDocument = require('./class/PseudoHTMLDocument')

  /**
   * Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside of the browser
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
    const window = typeof root.document === 'undefined' ? root : new jDomPseudoDom.PseudoEventTarget()

    /**
     * @type {Node|PseudoNode}
     */
    const Node = root.Node || new jDomPseudoDom.PseudoNode()
    if (typeof window.Node === 'undefined') {
      window['Node'] = Node
    }

    /**
     *
     * @type {Element|PseudoElement}
     */
    const Element = root.Element || new jDomPseudoDom.PseudoElement()
    if (typeof window.Element === 'undefined') {
      window['Element'] = Element
    }

    /**
     * Create an instance of HTMLElement if not available
     * @type {HTMLElement|PseudoHTMLElement}
     */
    const HTMLElement = root.HTMLElement || new jDomPseudoDom.PseudoHTMLElement()
    if (typeof window.HTMLElement === 'undefined') {
      window['HTMLElement'] = HTMLElement
    }

    /**
     * Define document when not available
     * @type {Document|PseudoHTMLDocument}
     */
    const document = root.document || new jDomPseudoDom.PseudoHTMLDocument()
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
