/**
 * @file doubly linked tree item.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
'use strict'

const Linker = require('./Linker')

class TreeLinker extends Linker {
  constructor (LinkerParams = {}, {children = null, parent = null} = {}) {
    super(LinkerParams)
    this.parent = parent
    this.children = children
      ? children.map(child => new TreeLinker(Object.assign({}, child, {parent: this})))
      : null
  }
}

module.exports = TreeLinker
