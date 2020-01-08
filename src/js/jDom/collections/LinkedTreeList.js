/**
 * @file doubly linked tree list.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
'use strict'

const LinkedList = require('./LinkedList')
const TreeLinker = require('./TreeLinker')

class LinkedTreeList extends LinkedList {
  constructor (values = [[]], linkerClass = TreeLinker) {
    super(values, linkerClass)
  }
}

module.exports = LinkedTreeList
