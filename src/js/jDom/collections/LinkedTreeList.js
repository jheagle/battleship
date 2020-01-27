/**
 * @file doubly linked tree list.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
'use strict'

const LinkedList = require('./LinkedList')
const TreeLinker = require('./TreeLinker')

class LinkedTreeList extends LinkedList {
  constructor (LinkerClass = TreeLinker, ListClass = LinkedTreeList) {
    super(LinkerClass, ListClass)
  }

  get parent () {
    return this.first.parent
  }

  set parent (parent = null) {
    let current = this.first
    while (current !== null) {
      current.parent = parent
      current = current.next
    }
    if (parent) {
      parent.children = this
    }
  }
}

/**
 *
 * @param values
 * @param LinkerClass
 * @param ListClass
 * @returns {LinkedList}
 */
LinkedTreeList.fromArray = (values = [], LinkerClass = TreeLinker, ListClass = LinkedTreeList) => {
  const list = new ListClass(LinkerClass)
  list.innerList = list.LinkerClass.fromArray(values, LinkerClass)
  return list
}

module.exports = LinkedTreeList
