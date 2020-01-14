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
   * @param linkerClass
   * @param listClass
   */
  constructor (linkerClass = Linker, listClass = LinkedList) {
    this.linkerClass = linkerClass
    this.listClass = listClass
    this.innerList = new this.linkerClass()
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
    let calculatedIndex = this.length + index
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
    let next = current.next
    if (current) {
      callback(current.data)
    }
    while (next !== null) {
      current = next
      next = current.next
      callback(current.data)
    }
  }

  /**
   *
   * @returns {{next: (function(): {value: (*|null), done: boolean})}}
   */
  [Symbol.iterator] () {
    let inner = this.first
    return {
      next: () => {
        let result = {value: (inner ? inner.data : null), done: !inner}
        inner = (inner ? inner.next : null)
        return result
      }
    }
  }
}

/**
 *
 * @param values
 * @param linkerClass
 * @param listClass
 * @returns {LinkedList}
 */
LinkedList.fromArray = (values = [], linkerClass = Linker, listClass = LinkedList) => {
  const list = new listClass(linkerClass)
  list.innerList = list.linkerClass.fromArray(values, linkerClass)
  return list
}

module.exports = LinkedList