/**
 * @file doubly linked tree list.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
'use strict'

const LinkedList = require('./LinkedList')
const TreeLinker = require('./TreeLinker')

class LinkedTreeList extends LinkedList {
  constructor (linkerClass = TreeLinker, listClass = LinkedTreeList) {
    super(linkerClass, listClass)
  }
}

/**
 *
 * @param values
 * @param linkerClass
 * @param listClass
 * @returns {LinkedList}
 */
LinkedTreeList.fromArray = (values = [], linkerClass = TreeLinker, listClass = LinkedTreeList) => {
  const list = new listClass(linkerClass)
  list.innerList = list.linkerClass.fromArray(values, linkerClass)
  return list
}

module.exports = LinkedTreeList
