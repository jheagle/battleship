/**
 * @file doubly linked list.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
'use strict'

const Linker = require('./Linker')

/**
 *
 */
class LinkedList {
  /**
   *
   * @param LinkerClass
   * @param ListClass
   */
  constructor (LinkerClass = Linker, ListClass = LinkedList) {
    this.LinkerClass = LinkerClass
    this.ListClass = ListClass
    this.innerList = new this.LinkerClass()
  }

  /**
   *
   * @returns {Linker}
   */
  get first () {
    let head = this.innerList
    let prev = head.prev
    while (prev !== null) {
      head = prev
      prev = head.prev
    }
    return head
  }

  /**
   *
   * @returns {Linker}
   */
  get last () {
    let tail = this.innerList
    let next = tail.next
    while (next !== null) {
      tail = next
      next = tail.next
    }
    return tail
  }

  /**
   *
   * @returns {number}
   */
  get length () {
    let current = this.first
    let length = 0
    while (current !== null) {
      ++length
      current = current.next
    }
    return length
  }

  /**
   *
   * @param node
   */
  append (node) {
    this.last.after(node)
    return this.first
  }

  /**
   *
   * @param node
   */
  prepend (node) {
    return this.first.before(node)
  }

  /**
   *
   * @param index
   * @returns {null|*}
   */
  item (index) {
    if (index >= 0) {
      let current = this.first
      let currentIndex = -1
      while ((++currentIndex) < index && current !== null) {
        current = current.next
      }
      return currentIndex === index ? current : null
    }
    let current = this.last
    let currentIndex = this.length
    const calculatedIndex = this.length + index
    if (calculatedIndex < 0) {
      return null
    }
    while ((--currentIndex) > calculatedIndex && current !== null) {
      current = current.prev
    }
    return currentIndex === calculatedIndex ? current : null
  }

  /**
   *
   * @param callback
   */
  forEach (callback) {
    let current = this.first
    while (current !== null) {
      callback(current)
      current = current.next
    }
  }

  /**
   *
   * @returns {{next: (function(): {value: (*|null), done: boolean})}}
   */
  [Symbol.iterator] () {
    let current = this.first
    return {
      next: () => {
        const result = { value: current, done: !current }
        current = (current ? current.next : null)
        return result
      }
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
LinkedList.fromArray = (values = [], LinkerClass = Linker, ListClass = LinkedList) => {
  const list = new ListClass(LinkerClass)
  list.innerList = list.LinkerClass.fromArray(values, LinkerClass)
  return list
}

module.exports = LinkedList
