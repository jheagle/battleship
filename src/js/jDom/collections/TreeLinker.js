/**
 * @file doubly linked tree item.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
'use strict'

const Linker = require('./Linker')

class TreeLinker extends Linker {
  /**
   *
   * @param data
   * @param prev
   * @param next
   * @param children
   * @param parent
   * @param LinkerClass
   */
  constructor ({ data = null, prev = null, next = null, children = null, parent = null } = {}, LinkerClass = TreeLinker) {
    super({ data, prev, next }, LinkerClass)
    this.parent = parent
    this.children = this.childrenFromArray(children, LinkerClass)
  }

  childrenFromArray (children = null, LinkerClass = TreeLinker) {
    return children !== null
      ? Linker.fromArray.apply(this, [
        children.map(child => Object.assign({}, child, { parent: this })),
        LinkerClass
      ])
      : null
  }
}

module.exports = TreeLinker
