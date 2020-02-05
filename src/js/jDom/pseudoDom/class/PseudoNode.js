/**
 * @file Substitute for the DOM Node Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
'use strict'

const TreeLinker = require('../../collections/TreeLinker')
const PseudoEventTarget = require('./PseudoEventTarget')

class NodeFactory extends TreeLinker {}
module.exports.generateNode = () => {
  NodeFactory.fromArray = (values = [], LinkerClass = NodeFactory) => values.reduce(
    (list, element) => {
      if (typeof element !== 'object') {
        element = { data: element }
      }
      let newList = false
      if (list === null) {
        newList = true
        list = new LinkerClass(Object.assign({}, element, { prev: list }))
      }
      /**
       * Simulate the behaviour of the Node Class when there is no DOM available.
       * @author Joshua Heagle <joshuaheagle@gmail.com>
       * @class
       * @augments PseudoEventTarget
       * @property {string} name
       * @property {function} appendChild
       * @property {function} removeChild
       */
      class PseudoNode extends PseudoEventTarget {
        /**
         *
         * @constructor
         */
        constructor () {
          super()
          this.nodeValue = element.data
          this.textContext = ''
        }

        get baseURI () {
          return window.location || '/'
        }

        get childNodes () {
          return list.children
        }

        get firstChild () {
          return list.children.first.data
        }

        get isConnected () {
          return list.parent !== null
        }

        get lastChild () {
          return list.children.last.data
        }

        get nextSibling () {
          return list.next.data
        }

        get nodeName () {
          return this.name || ''
        }

        get nodeType () {
          const typeName = 'DEFAULT_NODE'
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
          return list.rootParent
        }

        get parentNode () {
          return list.parent
        }

        get parentElement () {
          return list.parent.nodeType === 1 ? list.parent : null
        }

        get previousSibling () {
          return list.prev
        }

        /**
         *
         * @param {PseudoNode} childNode
         * @returns {PseudoNode}
         */
        appendChild (childNode) {
          list.after(list, [childNode])
          return childNode
        }

        cloneNode () {}

        compareDocumentPosition () {}

        contains () {}

        getRootNode () {
          return list.rootParent
        }

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
      module.exports.PseudoNode = PseudoNode
      if (newList) {
        list.data = new PseudoNode()
        return list
      }
      element.data = new PseudoNode()
      return TreeLinker.prototype.after.apply(list, [element])
    },
    null
  )
  return NodeFactory
}
module.exports.NodeFactory = NodeFactory
