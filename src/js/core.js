'use strict'
const base = this || window || {}
// Core system functions
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this || {}

  /**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */
  const previousJDomCore = root.jDomCore || {}

  /**
   * All methods exported from this module are encapsulated within jDomCore.
   * @module jDomCore
   */
  const jDomCore = {}
  root.jDomCore = jDomCore

  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {module:jDomCore}
   */
  jDomCore.noConflict = () => {
    root.jDomCore = previousJDomCore
    return jDomCore
  }

  /**
   * Return a curried version of the passed function.
   * The returned function expects the same number of arguments minus the ones provided.
   * fn is the name of the function being curried.
   * @function curry
   * @param {function} fn - Receives a function to be curried
   * @returns {function(...[*]): function(...[*])}
   */
  jDomCore.curry = (fn) => (...args) => args.length >= fn.length ? fn(...args) : (...a) => jDomCore.curry(fn)(...[...args, ...a])

  /**
   * This was copied from a blog post on Composing Software written by Eric Elliott. The idea is to begin to make this
   * code base somewhat easier to parse and introduce point-free notation.
   * @author Eric Elliott
   * @function pipe
   * @param {...function} fns - Takes a series of functions have the same parameter, which parameter is also returned.
   * @returns {function(*=): (*|any)}
   */
  jDomCore.pipe = (...fns) => x => fns.reduce((y, f) => f(y), x)

  /**
   * Function that produces a property of the new Object, taking three arguments
   * @callback module:jDomCore.mapCallback
   * @param {*} currentProperty - The current property being processed in the object.
   * @param {string} [currentIndex] - The property name of the current property being processed in the object.
   * @param {Object|Array} [object] - The object map was called upon.
   * @returns {*}
   */

  /**
   * This function is intended to replicate behaviour of the Array.map() function but for Objects.
   * If an array is passed in instead then it will perform standard map(). It is recommended to
   * always use the standard map() function when it is known that the object is actually an array.
   * @function mapObject
   * @param {Object|Array} obj - The Object (or Array) to be mapped
   * @param {module:jDomCore.mapCallback} fn - The function to be processed for each mapped property
   * @param {Object|Array} [thisArg] - Optional. Value to use as this when executing callback.
   * @returns {Object|Array}
   */
  jDomCore.mapObject = (obj, fn, thisArg = undefined) => Array.isArray(obj) ? obj.map(fn, thisArg) : Object.keys(obj).reduce((newObj, curr) => {
    newObj[curr] = fn(...[obj[curr], curr, obj].slice(0, fn.length || 2))
    return newObj
  }, thisArg || {})

  /**
   * Function is a predicate, to test each property value of the object. Return true to keep the element, false otherwise, taking three arguments:
   * @callback module:jDomCore.filterCallback
   * @param {*} currentProperty - The current property being processed in the object.
   * @param {string} [currentIndex] - The property name of the current property being processed in the object.
   * @param {Object|Array} [object] - The object filter was called upon.
   * @returns {boolean}
   */

  /**
   * This function is intended to replicate behaviour of the Array.filter() function but for Objects.
   * If an array is passed in instead then it will perform standard filter(). It is recommended to
   * always use the standard filter() function when it is known that the object is actually an array.
   * @function filterObject
   * @param {Object|Array} obj - The Object (or Array) to be filtered
   * @param {module:jDomCore.filterCallback} fn - The function to be processed for each filtered property
   * @param {Object|Array} [thisArg] - Optional. Value to use as this when executing callback.
   * @returns {Object|Array}
   */
  jDomCore.filterObject = (obj, fn, thisArg = undefined) => Array.isArray(obj) ? obj.filter(fn, thisArg) : Object.keys(obj).reduce((newObj, curr) => {
    if (fn(...[obj[curr], curr, obj].slice(0, fn.length || 2))) {
      newObj[curr] = obj[curr]
    } else {
      delete newObj[curr]
    }
    return newObj
  }, thisArg || {})

  /**
   * Function to execute on each property in the object, taking four arguments:
   * @callback module:jDomCore.reduceCallback
   * @param {*} [accumulator={}] - The accumulator accumulates the callback's return values; it is the accumulated value previously returned in the last invocation of the callback, or initialValue, if supplied (see below).
   * @param {*} [currentProperty={}] - The current property being processed in the object.
   * @param {string} [currentIndex=0] - The index of the current element being processed in the array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
   * @param {Object|Array} [object={}] - The object reduce was called upon.
   * @returns {*}
   */

  /**
   * This function is intended to replicate behaviour of the Array.reduce() function but for Objects.
   * If an array is passed in instead then it will perform standard reduce(). It is recommended to
   * always use the standard reduce() function when it is known that the object is actually an array.
   * @function reduceObject
   * @param {Object|Array} obj - The Object (or Array) to be filtered
   * @param {module:jDomCore.reduceCallback} fn - The function to be processed for each filtered property
   * @param {Object|Array} [initialValue] - Optional. Value to use as the first argument to the first call of the callback. If no initial value is supplied, the first element in the array will be used. Calling reduce on an empty array without an initial value is an error.
   * @returns {Object|Array}
   */
  jDomCore.reduceObject = (obj, fn, initialValue = obj[Object.keys(obj)[0]] || obj[0]) => Array.isArray(obj) ? obj.reduce(fn, initialValue) : Object.keys(obj).reduce((newObj, curr) => fn(...[newObj, obj[curr], curr, obj].slice(0, fn.length || 2)), initialValue)

  /**
   * Helper function for testing if the item is an Object or Array that contains properties or elements
   * @function notEmptyObjectOrArray
   * @param {Object|Array} item - Object or Array to test
   * @returns {boolean}
   */
  jDomCore.notEmptyObjectOrArray = item => !!((typeof item === 'object' && Object.keys(item).length) || (Array.isArray(item) && item.length))

  /**
   * Re-add the Object Properties which cannot be cloned and must be directly copied to the new cloned object
   * WARNING: This is a recursive function.
   * @param {Object} cloned - A value-only copy of the original object
   * @param {Object} object - The original object that is being cloned
   * @returns {Object|Array}
   */
  const cloneCopy = (object, cloned) =>
    jDomCore.notEmptyObjectOrArray(object)
      ? jDomCore.reduceObject(object, (start, prop, key) => {
        start[key] = (cloned[key] && !/^(parentItem|listenerArgs|element)$/.test(key))
          ? cloneCopy(prop, cloned[key])
          : prop
        return start
      }, cloned)
      : cloned

  /**
   * Clone objects for manipulation without data corruption, returns a copy of the provided object.
   * @function cloneObject
   * @param {Object} object - The original object that is being cloned
   * @returns {Object}
   */
  jDomCore.cloneObject = (object) => cloneCopy(object, JSON.parse(JSON.stringify(object, (key, val) => !/^(parentItem|listenerArgs|element)$/.test(key) ? val : undefined)))

  /**
   * Merge two objects and provide clone or original on the provided function.
   * The passed function should accept a minimum of two objects to be merged.
   * If the desire is to mutate the input objects, then the function name should
   * have the word 'mutable' in the name (case-insensitive).
   * @param {function} fn
   * @param {Object} obj1
   * @param {Object} obj2
   * @param {boolean} [isMutable=false]
   * @returns {Object}
   */
  const mergeObjectsBase = (fn, obj1, obj2, isMutable = false) => jDomCore.notEmptyObjectOrArray(obj2)
    ? jDomCore.mapObject(obj2, (prop, key) => (obj1[key] && !/^(parentItem|listenerArgs|element)$/.test(key)) ? fn(obj1[key], prop) : prop, isMutable ? obj1 : jDomCore.cloneObject(obj1))
    : obj2

  /**
   * Perform a deep merge of objects. This will combine all objects and sub-objects,
   * objects having the same attributes will overwrite starting from the end of the argument
   * list and bubbling up to return a merged version of the first object.
   * WARNING: This is a recursive function.
   * @function mergeObjects
   * @param {...Object} args
   * @returns {Object}
   */
  jDomCore.mergeObjects = (...args) => args.length === 2 ? mergeObjectsBase(jDomCore.mergeObjects, args[0], args[1]) : args.length === 1 ? jDomCore.cloneObject(args[0]) : args.reduce(jDomCore.curry(mergeObjectsBase)(jDomCore.mergeObjects), {})

  /**
   * Perform a deep merge of objects. This will combine all objects and sub-objects,
   * objects having the same attributes will overwrite starting from the end of the argument
   * list and bubbling up to return the overwritten first object.
   * WARNING: This is a recursive function.
   * WARNING: This will mutate the first object passed in as input
   * @function mergeObjectsMutable
   * @param {...Object} args
   * @returns {Object}
   */
  jDomCore.mergeObjectsMutable = (...args) => args.length === 2 ? mergeObjectsBase(jDomCore.mergeObjectsMutable, args[0], args[1], true) : args.length === 1 ? args[0] : args.reduce(jDomCore.curry(mergeObjectsBase)(jDomCore.mergeObjectsMutable), {})

  /**
   * Generate an array filled with a copy of the provided item or references to the provided item.
   * The length defines how long the array should be.
   * WARNING: This is a recursive function.
   * @param {boolean} useReference
   * @param {*} item
   * @param {number} length
   * @param {Array} [arr=[]]
   * @returns {Array.<*>}
   */
  const buildArrayBase = (useReference, item, length, arr = []) => --length > 0 ? buildArrayBase(useReference, (useReference ? item : jDomCore.cloneObject(item)), length, arr.concat([item])) : arr.concat([item])

  /**
   * Leverage buildArrayBase to generate an array filled with a copy of the provided item.
   * The length defines how long the array should be.
   * @function buildArray
   * @param {*} item
   * @param {number} length
   * @param {Array} [arr=[]]
   * @returns {Array.<*>}
   */
  jDomCore.buildArray = jDomCore.curry(buildArrayBase)(false)

  /**
   * Leverage buildArrayBase to generate an array filled with references to the provided item.
   * The length defines how long the array should be.
   * @function buildArrayOfReferences
   * @param {*} item
   * @param {number} length
   * @param {Array} [arr=[]]
   * @returns {Array.<*>}
   */
  jDomCore.buildArrayOfReferences = jDomCore.curry(buildArrayBase)(true)

  /**
   * A simple function to check if an item is in an array
   * @function inArray
   * @param {Array} arr
   * @param {*} prop
   * @returns {boolean}
   */
  jDomCore.inArray = (arr, prop) => arr.indexOf(prop) >= 0

  /**
   * A simple function usable with reduce to get the max or min value
   * @function getMaxOrMin
   * @param {boolean} getMax
   * @param {number} num1
   * @param {number} num2
   * @returns {number}
   */
  jDomCore.getMaxOrMin = (getMax, num1, num2) => ((getMax && num2 > num1) || (!getMax && num2 < num1)) ? num2 : num1

  /**
   * Helper for returning max value
   * @function getMax
   * @param {number} num1
   * @param {number} num2
   * @returns {number}
   */
  jDomCore.getMax = jDomCore.curry(jDomCore.getMaxOrMin)(true)

  /**
   * Helper for returning min value
   * @function getMin
   * @param {number} num1
   * @param {number} num2
   * @returns {number}
   */
  jDomCore.getMin = jDomCore.curry(jDomCore.getMaxOrMin)(false)

  /**
   * Create a single random number within provided range. And with optional offset,
   * The distance between the result numbers can be adjusted with interval.
   * @function randomNumber
   * @param {number} range
   * @param {number} [offset=0]
   * @param {number} [interval=1]
   * @returns {number}
   */
  jDomCore.randomNumber = (range, offset = 0, interval = 1) => (Math.random() * range + offset) * interval

  /**
   * Create a single random integer within provide range. And with optional offset,
   * The distance between the result numbers can be adjusted with interval.
   * @function randomInteger
   * @param {number} range
   * @param {number} [offset=0]
   * @param {number} [interval=1]
   * @returns {number}
   */
  jDomCore.randomInteger = (range, offset = 0, interval = 1) => (Math.floor(Math.random() * range) + offset) * interval

  /**
   * Compare two numbers and return:
   * -1 to indicate val1 is less than val2
   * 0 to indicate both values are the equal
   * 1 to indicate val1 is greater than val2
   * @function compare
   * @param {number} val1 - The first number to compare
   * @param {number} val2 - The second number to compare
   * @returns {number}
   */
  jDomCore.compare = (val1, val2) => val1 === val2 ? 0 : val1 > val2 ? 1 : -1

  /**
   * Compare two Arrays and return the Object where the value for each property is as follows:
   * -1 to indicate val1 is less than val2
   * 0 to indicate both values are the equal
   * 1 to indicate val1 is greater than val2
   * The returned Object uses the element values as the property names
   * @function compareArrays
   * @param {Array} arr1 - The first array to compare
   * @param {Array} arr2 - The second array to compare
   * @returns {Object.<string, number>}
   */
  jDomCore.compareArrays = (arr1, arr2) => arr2.filter((attr, key) => !jDomCore.inArray(arr1, attr) || arr1[key] !== attr).concat(arr1).reduce((returnObj, attr) => {
    returnObj[JSON.stringify(attr, (key, val) => !/^(parentItem|listenerArgs|element)$/.test(key) ? val : undefined)] = jDomCore.compare(arr2.filter(val => val === attr).length, arr1.filter(val => val === attr).length)
    return returnObj
  }, {})

  /**
   * This was adapted from a blog post on Composing Software written by Eric Elliott. Trace provides a way to traces
   * steps through code via the console, while maintaining the functional-style return value.
   * Returns a function which can then receive a value to output, the value will then be returned.
   * @author Eric Elliott
   * @function trace
   * @param {string} label - Pass an identifying label of the value being output.
   * @returns {function(*=)}
   */
  jDomCore.trace = label => value => {
    console.info(`${label}: `, value)
    return value
  }

  /**
   * Run Timeout functions one after the other in queue
   * WARNING: This is a recursive function.
   * @function queueTimeout
   * @param {function|object} fn
   * @param {number} time
   * @param {...*} args
   * @returns {{id: number, func: function, timeout: number, args: {Array}, result: *}}
   */
  jDomCore.queueTimeout = (fn = {}, time = 0, ...args) => {
    jDomCore.queueTimeout.queue = jDomCore.queueTimeout.queue || []
    jDomCore.queueTimeout.isRunning = jDomCore.queueTimeout.isRunning || false
    const queueItem = {id: 0, func: fn, timeout: time, args: args, result: 0}
    if (fn) {
      jDomCore.queueTimeout.queue.push(queueItem)
    }

    if (jDomCore.queueTimeout.queue.length && !jDomCore.queueTimeout.isRunning) {
      jDomCore.queueTimeout.isRunning = true
      const toRun = jDomCore.queueTimeout.queue.shift()
      toRun.id = setTimeout(() => {
        toRun.result = toRun.func(...toRun.args)
        jDomCore.queueTimeout.isRunning = false
        return jDomCore.queueTimeout(false)
      }, toRun.timeout)
      return toRun
    }
    return queueItem
  }

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = jDomCore
    }
    exports = Object.assign(exports, jDomCore)
  }
}).call(this || window || base || {}) // Use the external context to assign this, which will be Window if rendered via browser
