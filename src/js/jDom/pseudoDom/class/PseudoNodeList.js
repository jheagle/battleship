/**
 * @file Substitute for the NodeList interface.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
'use strict'

module.exports.nodeListFactory = innerList => {
  class PseudoNodeList {
    get length () {
      return innerList.length
    }

    get entries () {
      return Array.from(this)
    }

    get keys () {
      return Array.from(innerList).keys
    }

    get values () {
      return Array.from(innerList).map(item => item.data).values
    }

    item (index) {
      return innerList.item(index)
    }

    forEach (callback) {
      return Array.from(innerList).map(item => item.data).forEach(callback)
    }

    [Symbol.iterator] () {
      let current = innerList.first
      return {
        next: () => {
          const result = { value: (current ? current.data : null), done: !current }
          current = (current ? current.next : null)
          return result
        }
      }
    }
  }
  module.exports.PseudoNodeList = PseudoNodeList
  return new PseudoNodeList()
}
