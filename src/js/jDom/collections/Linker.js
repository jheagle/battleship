/**
 * @file doubly linked list item.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
'use strict'

/**
 *
 */
class Linker {
  /**
   *
   * @param data
   * @param prev
   * @param next
   */
  constructor ({data = null, prev = null, next = null} = {}) {
    this.data = data
    this.prev = prev
    this.next = next
  }

  /**
   *
   * @param node
   * @returns {Linker}
   */
  after (node) {
    if (typeof node !== 'object') {
      node = new Linker({data: node})
    }
    node.next = this.next
    node.prev = this
    this.next = node
    if (node.next){
      node.next.prev = node
    }
    return node
  }

  /**
   *
   * @param node
   * @returns {Linker}
   */
  before (node) {
    if (typeof node !== 'object') {
      node = new Linker({data: node})
    }
    node.prev = this.prev
    node.next = this
    this.prev = node
    if (node.prev){
      node.prev.next = node
    }
    return node
  }
}

/**
 *
 * @param values
 * @returns {Linker}
 */
Linker.fromArray = (values = []) => values.reduce(
  (list, element) => {
    if (list === null) {
      if (typeof element !== 'object') {
        element = {data: element}
      }
      return new Linker(Object.assign({}, element, {prev: list}))
    }
    return list.after(element)
  },
  null
)

module.exports = Linker
