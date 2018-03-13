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
   * @type {jDomCore|*}
   */
  const previousJDomCore = root.jDomCore || {}

  /**
   * All methods exported from this module are encapsulated within jDomCore.
   * @typedef {Object} jDomCore
   * @property {function} buildArray
   * @property {function} buildArrayOfReferences
   * @property {function} cloneObject
   * @property {function} compare
   * @property {function} compareArrays
   * @property {function} curry
   * @property {function} filterObject
   * @property {function} getMax
   * @property {function} getMaxOrMin
   * @property {function} getMin
   * @property {function} inArray
   * @property {function} mapObject
   * @property {function} mergeObjects
   * @property {function} mergeObjectsMutable
   * @property {function} noConflict
   * @property {function} notEmptyObjectOrArray
   * @property {function} pipe
   * @property {function} queueTimeout
   * @property {function} randomInteger
   * @property {function} randomNumber
   * @property {function} reduceObject
   * @property {function} trace
   */

  /**
   * A reference to all functions to be used globally / exported
   * @type {jDomCore}
   */
  const exportFunctions = {
    noConflict: () => {
      root.jDomCore = previousJDomCore
      return exportFunctions
    }
  }
  root.jDomCore = exportFunctions

  /**
   * Return a curried version of the passed function.
   * The returned function expects the same number of arguments minus the ones provided.
   * fn is the name of the function being curried.
   * @param {function} fn - Receives a function to be curried
   * @returns {function(...[*]): function(...[*])}
   */
  const curry = (fn) => {
    const curried = (...args) => args.length >= fn.length ? fn(...args) : (...a) => curried(...[...args, ...a])
    return curried
  }
  exportFunctions.curry = curry

  /**
   * This was copied from a blog post on Composing Software written by Eric Elliott. The idea is to begin to make this
   * code base somewhat easier to parse and introduce point-free notation.
   * @author Eric Elliott
   * @param {...function} fns - Takes a series of functions have the same parameter, which parameter is also returned.
   * @returns {function(*=): (*|any)}
   */
  exportFunctions.pipe = (...fns) => x => fns.reduce((y, f) => f(y), x)

  /**
   * Function that produces a property of the new Object, taking three arguments
   * @callback mapCallback
   * @param {*} currentProperty - The current property being processed in the object.
   * @param {string} [currentIndex] - The property name of the current property being processed in the object.
   * @param {Object|Array} [object] - The object map was called upon.
   * @returns {*}
   */

  /**
   * This function is intended to replicate behaviour of the Array.map() function but for Objects.
   * If an array is passed in instead then it will perform standard map(). It is recommended to
   * always use the standard map() function when it is known that the object is actually an array.
   * @param {Object|Array} obj - The Object (or Array) to be mapped
   * @param {mapCallback} fn - The function to be processed for each mapped property
   * @param {Object|Array} [thisArg] - Optional. Value to use as this when executing callback.
   * @returns {Object|Array}
   */
  const mapObject = (obj, fn, thisArg = undefined) => Array.isArray(obj) ? obj.map(fn, thisArg) : Object.keys(obj).reduce((newObj, curr) => {
    newObj[curr] = fn(...[obj[curr], curr, obj].slice(0, fn.length || 2))
    return newObj
  }, thisArg || {})
  exportFunctions.mapObject = mapObject

  /**
   * Function is a predicate, to test each property value of the object. Return true to keep the element, false otherwise, taking three arguments:
   * @callback filterCallback
   * @param {*} currentProperty - The current property being processed in the object.
   * @param {string} [currentIndex] - The property name of the current property being processed in the object.
   * @param {Object|Array} [object] - The object filter was called upon.
   * @returns {boolean}
   */

  /**
   * This function is intended to replicate behaviour of the Array.filter() function but for Objects.
   * If an array is passed in instead then it will perform standard filter(). It is recommended to
   * always use the standard filter() function when it is known that the object is actually an array.
   * @param {Object|Array} obj - The Object (or Array) to be filtered
   * @param {filterCallback} fn - The function to be processed for each filtered property
   * @param {Object|Array} [thisArg] - Optional. Value to use as this when executing callback.
   * @returns {Object|Array}
   */
  const filterObject = (obj, fn, thisArg = undefined) => Array.isArray(obj) ? obj.filter(fn, thisArg) : Object.keys(obj).reduce((newObj, curr) => {
    if (fn(...[obj[curr], curr, obj].slice(0, fn.length || 2))) {
      newObj[curr] = obj[curr]
    } else {
      delete newObj[curr]
    }
    return newObj
  }, thisArg || {})
  exportFunctions.filterObject = filterObject

  /**
   * Function to execute on each property in the object, taking four arguments:
   * @callback reduceCallback
   * @param {*} accumulator - The accumulator accumulates the callback's return values; it is the accumulated value previously returned in the last invocation of the callback, or initialValue, if supplied (see below).
   * @param {*} currentProperty - The current property being processed in the object.
   * @param {string} [currentIndex] - The index of the current element being processed in the array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
   * @param {Object|Array} [object] - The object reduce was called upon.
   * @returns {*}
   */

  /**
   * This function is intended to replicate behaviour of the Array.reduce() function but for Objects.
   * If an array is passed in instead then it will perform standard reduce(). It is recommended to
   * always use the standard reduce() function when it is known that the object is actually an array.
   * @param {Object|Array} obj - The Object (or Array) to be filtered
   * @param {reduceCallback} fn - The function to be processed for each filtered property
   * @param {Object|Array} [initialValue] - Optional. Value to use as the first argument to the first call of the callback. If no initial value is supplied, the first element in the array will be used. Calling reduce on an empty array without an initial value is an error.
   * @returns {Object|Array}
   */
  const reduceObject = (obj, fn, initialValue = obj[Object.keys(obj)[0]] || obj[0]) => Array.isArray(obj) ? obj.reduce(fn, initialValue) : Object.keys(obj).reduce((newObj, curr) => fn(...[newObj, obj[curr], curr, obj].slice(0, fn.length || 2)), initialValue)
  exportFunctions.reduceObject = reduceObject

  /**
   * Helper function for testing if the item is an Object or Array that contains properties or elements
   * @param {Object|Array} item - Object or Array to test
   * @returns {boolean}
   */
  const notEmptyObjectOrArray = item => !!((typeof item === 'object' && Object.keys(item).length) || (Array.isArray(item) && item.length))
  exportFunctions.notEmptyObjectOrArray = notEmptyObjectOrArray

  /**
   * Function is a predicate, accepts optional arguments of a property and a propertyName to be used in the test.
   * @callback recursiveMapTest
   * @param {*} [property] - The property value to be tested.
   * @param {string} [propertyName] - The current property being processed in the object.
   * @returns {boolean}
   */

  /**
   * This is typically a reference to the calling function which will be called recursively.
   * @callback recursiveMapCallback
   * @param {*} propertyReference - A reference to the current property being processed.
   * @param {*} [propertyValue] - The value of the current property being processed.
   * @param {...*} [args] - Additional arguments that may be needed for the recursive function callback.
   * @returns {*}
   */

  /**
   * A function to use with mapObject or just map which will either return the result
   * of re-running a function or return the original item.
   * Pass in the object to be used with map.
   * Pass in the conditions as a test function: True returns the object; False continues recursion.
   * Pass in the recursive function.
   * Add any other args to that function.
   * @param {Object|Array} obj -> The Object or array being processed.
   * @param {recursiveMapTest} test - The condition which either continues or terminates recursion.
   * @param {recursiveMapCallback} fn - A reference to the calling function to be recursively run.
   * @param {...*} [args] - Additional args which might be needed for recursiveMapCallback.
   * @returns {*|recursiveMapCallback}
   */
  const recursiveMap = (obj, test, fn, ...args) => (prop, key) => test(...[prop, key].slice(0, test.length)) ? prop : fn(...[obj[key], prop].slice(0, fn.length || 2), ...args)

  /**
   * A predicate to determin if the provided input meets the conditions.
   * @callback cloneExtraTest
   * @param {*} property - A reference to the current property being processed.
   * @param {String|number} propertyName - The value of the current property being processed.
   * @returns {boolean}
   */

  /**
   * Tests exceptions to what must be returned as reference vs cloned. Returns true for return reference vs false for return clone.
   * @param {Object|Array} obj - The Object or Array to be tested.
   * @param {cloneExtraTest} [extraTest=false] - Additional function which can be used in the test.
   * @returns {boolean}
   */
  const cloneRules = (obj, extraTest = false) => (prop, key) => !obj[key] || /^(parentItem|listenerArgs|element)$/.test(key) || (extraTest ? extraTest(prop, key) : false)

  /**
   * Re-add the Object Properties which cannot be cloned and must be directly copied to the new cloned object
   * WARNING: This is a recursive function.
   * @param {Object} cloned - A value-only copy of the original object
   * @param {Object} object - The original object that is being cloned
   * @returns {Object|Array}
   */
  const cloneCopy = (object, cloned) =>
    notEmptyObjectOrArray(object)
      ? reduceObject(object, (start, prop, key) => {
        start[key] = (cloned[key] && !/^(parentItem|listenerArgs|element)$/.test(key))
          ? cloneCopy(prop, cloned[key])
          : prop
        return start
      }, cloned)
      : cloned

  /**
   * Clone objects for manipulation without data corruption, returns a copy of the provided object.
   * @param {Object} object - The original object that is being cloned
   * @returns {Object}
   */
  const cloneObject = (object) => cloneCopy(object, JSON.parse(JSON.stringify(object, (key, val) => !/^(parentItem|listenerArgs|element)$/.test(key) ? val : undefined)))
  exportFunctions.cloneObject = cloneObject

  /**
   * Merge two objects and provide clone or original on the provided function.
   * The passed function should accept a minimum of two objects to be merged.
   * If the desire is to mutate the input objects, then the function name should
   * have the word 'mutable' in the name (case-insensitive).
   * @param {function} fn
   * @param {Object} obj1
   * @param {Object} obj2
   * @returns {Object}
   */
  const mergeObjectsBase = (fn, obj1, obj2) => (notEmptyObjectOrArray(obj2)) ? mapObject(obj2, recursiveMap(obj1, cloneRules(obj1), fn), /mutable/i.test(fn.name) ? obj1 : cloneObject(obj1)) : obj2

  /**
   * Perform a deep merge of objects. This will combine all objects and sub-objects,
   * objects having the same attributes will overwrite starting from the end of the argument
   * list and bubbling up to return a merged version of the first object.
   * WARNING: This is a recursive function.
   * @param {...Object} args
   * @returns {Object}
   */
  const mergeObjects = (...args) => args.length === 2 ? mergeObjectsBase(mergeObjects, args[0], args[1]) : args.length === 1 ? cloneObject(args[0]) : args.reduce(curry(mergeObjectsBase)(mergeObjects), {})
  exportFunctions.mergeObjects = mergeObjects

  /**
   * Perform a deep merge of objects. This will combine all objects and sub-objects,
   * objects having the same attributes will overwrite starting from the end of the argument
   * list and bubbling up to return the overwritten first object.
   * WARNING: This is a recursive function.
   * WARNING: This will mutate the first object passed in as input
   * @param {...Object} args
   * @returns {Object}
   */
  const mergeObjectsMutable = (...args) => args.length === 2 ? mergeObjectsBase(mergeObjectsMutable, args[0], args[1]) : args.length === 1 ? args[0] : args.reduce(curry(mergeObjectsBase)(mergeObjectsMutable), {})
  exportFunctions.mergeObjectsMutable = mergeObjectsMutable

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
  const buildArrayBase = (useReference, item, length, arr = []) => --length > 0 ? buildArrayBase(useReference, (useReference ? item : cloneObject(item)), length, arr.concat([item])) : arr.concat([item])

  /**
   * Leverage buildArrayBase to generate an array filled with a copy of the provided item.
   * The length defines how long the array should be.
   * @function buildArray
   * @param {*} item
   * @param {number} length
   * @param {Array} [arr=[]]
   * @returns {Array.<*>}
   */
  exportFunctions.buildArray = curry(buildArrayBase)(false)

  /**
   * Leverage buildArrayBase to generate an array filled with references to the provided item.
   * The length defines how long the array should be.
   * @function buildArrayOfReferences
   * @param {*} item
   * @param {number} length
   * @param {Array} [arr=[]]
   * @returns {Array.<*>}
   */
  exportFunctions.buildArrayOfReferences = curry(buildArrayBase)(true)

  /**
   * A simple function to check if an item is in an array
   * @param {Array} arr
   * @param {*} prop
   * @returns {boolean}
   */
  const inArray = (arr, prop) => arr.indexOf(prop) >= 0
  exportFunctions.inArray = inArray

  /**
   * A simple function usable with reduce to get the max or min value
   * @param {boolean} getMax
   * @param {number} num1
   * @param {number} num2
   * @returns {number}
   */
  const getMaxOrMin = (getMax, num1, num2) => ((getMax && num2 > num1) || (!getMax && num2 < num1)) ? num2 : num1
  exportFunctions.getMaxOrMin = getMaxOrMin

  /**
   * Helper for returning max value
   * @function getMax
   * @param {number} num1
   * @param {number} num2
   * @returns {number}
   */
  exportFunctions.getMax = curry(getMaxOrMin)(true)

  /**
   * Helper for returning min value
   * @function getMin
   * @param {number} num1
   * @param {number} num2
   * @returns {number}
   */
  exportFunctions.getMin = curry(getMaxOrMin)(false)

  /**
   * Create a single random number within provided range. And with optional offset,
   * The distance between the result numbers can be adjusted with interval.
   * @param {number} range
   * @param {number} [offset=0]
   * @param {number} [interval=1]
   * @returns {number}
   */
  exportFunctions.randomNumber = (range, offset = 0, interval = 1) => (Math.random() * range + offset) * interval

  /**
   * Create a single random integer within provide range. And with optional offset,
   * The distance between the result numbers can be adjusted with interval.
   * @param {number} range
   * @param {number} [offset=0]
   * @param {number} [interval=1]
   * @returns {number}
   */
  exportFunctions.randomInteger = (range, offset = 0, interval = 1) => (Math.floor(Math.random() * range) + offset) * interval

  /**
   * Compare two numbers and return:
   * -1 to indicate val1 is less than val2
   * 0 to indicate both values are the equal
   * 1 to indicate val1 is greater than val2
   * @param {number} val1 - The first number to compare
   * @param {number} val2 - The second number to compare
   * @returns {number}
   */
  const compare = (val1, val2) => val1 === val2 ? 0 : val1 > val2 ? 1 : -1
  exportFunctions.compare = compare

  /**
   * Compare two Arrays and return the Object where the value for each property is as follows:
   * -1 to indicate val1 is less than val2
   * 0 to indicate both values are the equal
   * 1 to indicate val1 is greater than val2
   * The returned Object uses the element values as the property names
   * @param {Array} arr1 - The first array to compare
   * @param {Array} arr2 - The second array to compare
   * @param {Array} [parents=[]] - Used to track circular references
   * @returns {Object.<string, number>}
   */
  exportFunctions.compareArrays = (arr1, arr2, parents = []) => arr2.filter((attr, key) => !inArray(arr1, attr) || arr1[key] !== attr).concat(arr1).reduce((returnObj, attr) => {
    returnObj[JSON.stringify(attr, (key, val) => !/^(parentItem|listenerArgs|element)$/.test(key) ? val : undefined)] = compare(arr2.filter(val => val === attr).length, arr1.filter(val => val === attr).length)
    return returnObj
  }, {})

  /**
   * This was adapted from a blog post on Composing Software written by Eric Elliott. Trace provides a way to traces
   * steps through code via the console, while maintaining the functional-style return value.
   * Returns a function which can then receive a value to output, the value will then be returned.
   * @author Eric Elliott
   * @param {string} label - Pass an identifying label of the value being output.
   * @returns {function(*=)}
   */
  const trace = label => value => {
    console.info(`${label}: `, value)
    return value
  }
  exportFunctions.trace = trace

  /**
   * Run Timeout functions one after the other in queue
   * WARNING: This is a recursive function.
   * @param {function} fn
   * @param {number} time
   * @param {...*} args
   * @returns {{id: number, func: function, timeout: number, args: {Array}, result: *}}
   */
  const queueTimeout = (fn = {}, time = 0, ...args) => {
    queueTimeout.queue = queueTimeout.queue || []
    queueTimeout.isRunning = queueTimeout.isRunning || false
    const queueItem = {id: 0, func: fn, timeout: time, args: args, result: 0}
    if (fn) {
      queueTimeout.queue.push(queueItem)
    }

    if (queueTimeout.queue.length && !queueTimeout.isRunning) {
      queueTimeout.isRunning = true
      const toRun = queueTimeout.queue.shift()
      toRun.id = setTimeout(() => {
        toRun.result = toRun.func(...toRun.args)
        queueTimeout.isRunning = false
        return queueTimeout(false)
      }, toRun.timeout)
      return toRun
    }
    return queueItem
  }
  exportFunctions.queueTimeout = queueTimeout

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = exportFunctions
    }
    exports = Object.assign(exports, exportFunctions)
  }
}).call(this || window || base || {}) // Use the external context to assign this, which will be Window if rendered via browser
