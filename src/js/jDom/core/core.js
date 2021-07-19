/**
 * @file All of the core system functions for stringing together functions and simplifying logic.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
'use strict'
/**
 * All methods exported from this module are encapsulated within jDomCore.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @typedef {Object} jDomCore
 * @module jDom/core/core
 */
const jDomCore = {}

/**
 * Re-add the Object Properties which cannot be cloned and must be directly copied to the new cloned object
 * WARNING: This is a recursive function.
 * @param {Object} cloned - A value-only copy of the original object
 * @param {Object} object - The original object that is being cloned
 * @returns {Object|Array}
 */
const cloneCopy = (object, cloned) =>
  functionalHelpers.isCloneable(object)
    ? functionalHelpers.reduceObject(object, (start, prop, key) => {
      start[key] = (cloned[key] && functionalHelpers.isCloneable(prop))
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
jDomCore.cloneObject = object => cloneCopy(object, JSON.parse(
  JSON.stringify(object, (key, val) => key !== 'parentItem' || !functionalHelpers.isCloneable(val)
    ? val
    : undefined)
))

/**
 * Merge two objects and provide clone or original on the provided function.
 * The passed function should accept a minimum of two objects to be merged.
 * If the desire is to mutate the input objects, then the function name should
 * have the word 'mutable' in the name (case-insensitive).
 * @param {module:jDom/core/core.mergeObjects|module:jDom/core/core.mergeObjectsMutable|Function} fn - Pass one of
 * the mergeObjects functions to be used
 * @param {Object} obj1 - The receiving object; this is the object which will have it's properties overridden
 * @param {Object} obj2 - The contributing object; this is the object which will contribute new properties and
 * override existing ones
 * @param {boolean} [isMutable=false] - An optional flag which indicates whether we will clone objects or directly
 * modify them
 * @returns {Object}
 */
const mergeObjectsBase = (fn, obj1, obj2, isMutable = false) => functionalHelpers.isCloneable(obj2)
  ? functionalHelpers.reduceObject(
    obj2,
    (newObj, prop, key) => functionalHelpers.setValue(
      key,
      (obj1[key] && (key !== 'parentItem' || !functionalHelpers.isCloneable(prop)))
        ? fn(obj1[key], prop)
        : prop,
      newObj
    ),
    isMutable ? obj1 : jDomCore.cloneObject(obj1)
  )
  : obj2

/**
 * Perform a deep merge of objects. This will combine all objects and sub-objects,
 * objects having the same attributes will overwrite starting from the end of the argument
 * list and bubbling up to return a merged version of the first object.
 * WARNING: This is a recursive function.
 * @function mergeObjects
 * @param {...Object} args - Provide a list of objects which will be merged starting from the end up into the first
 * object
 * @returns {Object}
 */
jDomCore.mergeObjects = (...args) => args.length === 2
  ? mergeObjectsBase(jDomCore.mergeObjects, args[0], args[1])
  : args.length === 1
    ? functionalHelpers.cloneObject(args[0])
    : args.reduce(functionalHelpers.curry(mergeObjectsBase)(jDomCore.mergeObjects), {})

/**
 * Perform a deep merge of objects. This will combine all objects and sub-objects,
 * objects having the same attributes will overwrite starting from the end of the argument
 * list and bubbling up to return the overwritten first object.
 * WARNING: This is a recursive function.
 * WARNING: This will mutate the first object passed in as input
 * @function mergeObjectsMutable
 * @param {...Object} args - Provide a list of objects which will be merged starting from the end up into the first
 * object
 * @returns {Object}
 */
jDomCore.mergeObjectsMutable = (...args) => args.length === 2
  ? mergeObjectsBase(jDomCore.mergeObjectsMutable, args[0], args[1], true)
  : args.length === 1
    ? args[0]
    : args.reduce(functionalHelpers.curry(mergeObjectsBase)(jDomCore.mergeObjectsMutable), {})

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
 * Run Timeout functions one after the other in queue. This function needs some work to comply with the standards
 * applied to the rest of this file where this is not a Pure function, and it does not reliably return a result. This
 * implementation should likely be used with Promise instead.
 * WARNING: This is a recursive function.
 * @function queueTimeout
 * @param {function|object|boolean} fn - A callback function to be performed at some time in the future.
 * @param {number} time - The time in milliseconds to delay.
 * @param {...*} args - Arguments to be passed to the callback once it is implemented.
 * @returns {{id: number, func: function, timeout: number, args: {Array}, result: *}}
 */
jDomCore.queueTimeout = (fn = {}, time = 0, ...args) => {
  // Track the queue to be processed in FIFO
  jDomCore.queueTimeout.queue = jDomCore.queueTimeout.queue || []
  // Do not run more than one queued item at a time
  jDomCore.queueTimeout.isRunning = jDomCore.queueTimeout.isRunning || false
  // Construct an object which will store the queued function data
  const queueItem = { id: 0, func: fn, timeout: time, args: args, result: 0 }
  if (fn) {
    // When the function is valid, append it to the end of the queue
    jDomCore.queueTimeout.queue.push(queueItem)
  }
  if (jDomCore.queueTimeout.queue.length && !jDomCore.queueTimeout.isRunning) {
    // Check that the queue is not empty, and it is not running a queued item
    // Set isRunning flag to begin processing the next queued item
    jDomCore.queueTimeout.isRunning = true
    // Pick an item off the front of the queue, and thereby reduce the queue size
    const toRun = jDomCore.queueTimeout.queue.shift()
    // Get the timeout ID when it has begun
    toRun.id = setTimeout(() => {
      // Run the function after the provided timeout
      toRun.result = toRun.func(...toRun.args)
      // Reset isRunning flag
      jDomCore.queueTimeout.isRunning = false
      // Re-run the queue which will get the next queued item if there is one
      return jDomCore.queueTimeout(false)
    }, toRun.timeout)
    // Return whatever object we have for the current queued item being processed, likely incomplete because the
    // function will complete in the future
    return toRun
  }
  // Return newly created queuedItem
  return queueItem
}