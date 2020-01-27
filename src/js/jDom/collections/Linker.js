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
   * @param LinkerClass
   */
  constructor ({ data = null, prev = null, next = null } = {}, LinkerClass = Linker) {
    this.LinkerClass = LinkerClass
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
    if (!node.LinkerClass) {
      if (typeof node !== 'object') {
        node = { data: node }
      }
      node = new this.LinkerClass(node)
    }
    node.next = this.next
    node.prev = this
    this.next = node
    if (node.next) {
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
    if (!node.LinkerClass) {
      if (typeof node !== 'object') {
        node = { data: node }
      }
      node = new this.LinkerClass(node)
    }
    node.prev = this.prev
    node.next = this
    this.prev = node
    if (node.prev) {
      node.prev.next = node
    }
    return node
  }
}

/**
 *
 * @param values
 * @param LinkerClass
 * @returns {Linker}
 */
Linker.fromArray = (values = [], LinkerClass = Linker) => values.reduce(
  (list, element) => {
    if (list === null) {
      if (typeof element !== 'object') {
        element = { data: element }
      }
      return new LinkerClass(Object.assign({}, element, { prev: list }))
    }
    return Linker.prototype.after.apply(list, [element])
  },
  null
)

module.exports = Linker
