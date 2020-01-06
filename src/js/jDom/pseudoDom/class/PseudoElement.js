/**
 * @file Substitute for the DOM Element Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
'use strict'

/**
 * Simulate the behaviour of the Element Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
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
class PseudoElement extends require('./PseudoNode') {
  /**
   * Simulate the Element object when the Dom is not available
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

    // this.classList = new DOMSettableTokenList(this.className)
    this.classList = this.className
  }

  /**
   *
   * @returns {Function}
   */
  applyDefaultEvent () {
    let callback = event => undefined
    switch (this.tagName) {
      case 'form':
        this.addEventListener('submit', callback)
        break
      case 'button':
      case 'input':
        if (/^(submit|image)$/i.test(this.type || '')) {
          callback = event => {
            const forms = require('./PseudoEvent').getParentNodesFromAttribute('tagName', 'form', this)
            if (forms) {
              forms[0].submit()
            }
          }
          super.setDefaultEvent('click', callback)
        }
    }
    return callback
  }

  /**
   *
   * @param {PseudoNode|PseudoElement} childElement
   * @returns {PseudoNode}
   */
  appendChild (childElement) {
    super.appendChild(childElement)
    childElement.applyDefaultEvent()
    return childElement
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

module.exports = PseudoElement
