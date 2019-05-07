/**
 * @file Substitute for the DOM Node Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
'use strict'

class NodeList {
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

/**
 * Simulate the behaviour of the Node Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoEventTarget
 * @property {string} name
 * @property {Object} parent
 * @property {Array} children
 * @property {function} appendChild
 * @property {function} removeChild
 */
class PseudoNode extends require('./PseudoEventTarget') {
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
    this.nodeValue = ''
    this.textContext = ''
  }

  get baseURI () {
    return window.location || '/'
  }

  get childNodes () {
    return this.children || [] // NodeList
  }

  get firstChild () {
    return this.children[0] || null
  }

  get isConnected () {
    return Object.keys(this.parent).length > 0
  }

  get lastChild () {
    return this.children[this.children.length - 1] || null
  }

  get nextSibling () {
    const siblings = this.parent.children
    return siblings[siblings.indexOf(this) + 1] || null
  }

  get nodeName () {
    return this.name || ''
  }

  get nodeType () {
    let typeName = 'DEFAULT_NODE'
    const nodeTypes = [
      'DEFAULT_NODE',
      'ELEMENT_NODE',
      'ATTRIBUTE_NODE',
      'TEXT_NODE',
      'CDATA_SECTION_NODE',
      'ENTITY_REFERENCE_NODE',
      'ENTITY_NODE',
      'PROCESSING_INSTRUCTION_NODE',
      'COMMENT_NODE',
      'DOCUMENT_NODE',
      'DOCUMENT_TYPE_NODE',
      'DOCUMENT_FRAGMENT_NODE',
      'NOTATION_NODE'
    ]
    return nodeTypes.indexOf(typeName)
  }

  get ownerDocument () {
    const allParents = getParentNodes(this) || []
    return allParents[allParents.length - 1]
  }

  get parentNode () {
    return this.parent
  }

  get parentElement () {
    return this.parent.nodeType === 1 ? this.parent : null
  }

  get previousSibling () {
    const siblings = this.parent.children
    return siblings[siblings.indexOf(this) - 1] || null
  }

  /**
   *
   * @param {PseudoNode} childNode
   * @returns {PseudoNode}
   */
  appendChild (childNode) {
    childNode.parent = this
    this.children = this.children.concat([childNode])
    return childNode
  }

  cloneNode () {}

  compareDocumentPosition () {}

  contains () {}

  getRootNode () {}

  hasChildNodes () {}

  insertBefore () {}

  isDefaultNamespace () {}

  isEqualNode () {}

  isSameNode () {}

  lookupPrefix () {}

  lookupNamespaceURI () {}

  normalize () {}

  /**
   *
   * @param {PseudoNode} childElement
   * @returns {PseudoNode}
   */
  removeChild (childElement) {
    return this.children.splice(this.children.indexOf(childElement), 1)[0]
  }

  replaceChild () {}
}

module.exports = PseudoNode
