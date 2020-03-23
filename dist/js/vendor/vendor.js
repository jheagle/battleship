"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * @file All of the jDomCore system functions for stringing together functions and simplifying logic.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
;
(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  var root = this || {};
  /**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */

  var previousJDomCore = root.jDomCore || {};
  /**
   * All methods exported from this module are encapsulated within jDomCore.
   * @author Joshua Heagle <joshuaheagle@gmail.com>
   * @typedef {Object} jDomCore
   * @module core/core
   */

  var jDomCore = {};
  root.jDomCore = jDomCore;
  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {jDomCore}
   */

  jDomCore.noConflict = function () {
    root.jDomCore = previousJDomCore;
    return jDomCore;
  };
  /**
   * Return a curried version of the passed function.
   * The returned function expects the same number of arguments minus the ones provided.
   * fn is the name of the function being curried.
   * @function curry
   * @param {function} fn - Receives a function to be curried
   * @returns {function(...[*]): function(...[*])}
   */


  jDomCore.curry = function (fn) {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return args.length >= fn.length ? fn.apply(void 0, args) : function () {
        for (var _len2 = arguments.length, a = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          a[_key2] = arguments[_key2];
        }

        return jDomCore.curry(fn).apply(void 0, [].concat(args, a));
      };
    };
  };
  /**
   * This was copied from a blog post on Composing Software written by Eric Elliott. The idea is to begin to make this
   * code base somewhat easier to parse and introduce point-free notation.
   * @author Eric Elliott
   * @function pipe
   * @param {...function} fns - Takes a series of functions having the same parameter, which parameter is also returned.
   * @returns {function(*=): (*|any)}
   */


  jDomCore.pipe = function () {
    for (var _len3 = arguments.length, fns = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      fns[_key3] = arguments[_key3];
    }

    return function (x) {
      return fns.reduce(function (y, f) {
        return f(y);
      }, x);
    };
  };
  /**
   * Set a value on an item, then return the item
   * @function setValue
   * @param {string|number} key - The key on the item which will have its value set
   * @param {*} value - Any value to be applied to the key
   * @param {Object|Array} item - An object or array to be updated
   * @returns {Object|Array}
   */


  jDomCore.setValue = function (key, value, item) {
    item[key] = value;
    return item;
  };
  /**
   * Set a value on an item, then return the value
   * @function setAndReturnValue
   * @param {Object|Array} item - An object or array to be updated
   * @param {string|number} key - The key on the item which will have its value set
   * @param {*} value - Any value to be applied to the key
   * @returns {*}
   */


  jDomCore.setAndReturnValue = function (item, key, value) {
    item[key] = value;
    return value;
  };
  /**
   * Function that produces a property of the new Object, taking three arguments
   * @callback module:core/core~mapCallback
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
   * @param {module:core/core~mapCallback|function} fn - The function to be processed for each mapped property
   * @param {Object|Array} [thisArg] - Optional. Value to use as this when executing callback.
   * @returns {Object|Array}
   */


  jDomCore.mapObject = function (obj, fn) {
    var thisArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
    return Array.isArray(obj) ? obj.map(fn, thisArg) : Object.keys(obj).reduce(function (newObj, curr) {
      return jDomCore.setValue(curr, fn.apply(void 0, _toConsumableArray([obj[curr], curr, obj].slice(0, fn.length || 2))), newObj);
    }, thisArg || {});
  };
  /**
   * Perform map on an array property of an object, then return the object
   * @function mapArrayProperty
   * @param {string} property - The string key for the array property to be mapped
   * @param {module:core/core~mapCallback|function} mapFunction - A function suitable to be passed to map
   * @param {Object|Array} obj - An object having an array property
   * @returns {object}
   */


  jDomCore.mapProperty = function (property, mapFunction, obj) {
    obj[property] = jDomCore.mapObject(obj[property] || [], mapFunction);
    return obj;
  };
  /**
   * Function is a predicate, to test each property value of the object. Return true to keep the element, false
   * otherwise, taking three arguments
   * @callback module:core/core~filterCallback
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
   * @param {module:core/core~filterCallback|function} fn - The function to be processed for each filtered property
   * @param {Object|Array} [thisArg] - Optional. Value to use as this when executing callback.
   * @returns {Object|Array}
   */


  jDomCore.filterObject = function (obj, fn) {
    var thisArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
    return Array.isArray(obj) ? obj.filter(fn, thisArg) : Object.keys(obj).reduce(function (newObj, curr) {
      if (fn.apply(void 0, _toConsumableArray([obj[curr], curr, obj].slice(0, fn.length || 2)))) {
        newObj[curr] = obj[curr];
      } else {
        delete newObj[curr];
      }

      return newObj;
    }, thisArg || {});
  };
  /**
   * Function to execute on each property in the object, taking four arguments
   * @callback module:core/core~reduceCallback
   * @param {*} [accumulator={}] - The accumulator accumulates the callback's return values; it is the accumulated
   * value previously returned in the last invocation of the callback, or initialValue, if supplied (see below).
   * @param {*} [currentProperty={}] - The current property being processed in the object.
   * @param {string} [currentIndex=0] - The index of the current element being processed in the array. Starts at index
   * 0, if an initialValue is provided, and at index 1 otherwise.
   * @param {Object|Array} [object={}] - The object reduce was called upon.
   * @returns {*}
   */

  /**
   * This function is intended to replicate behaviour of the Array.reduce() function but for Objects.
   * If an array is passed in instead then it will perform standard reduce(). It is recommended to
   * always use the standard reduce() function when it is known that the object is actually an array.
   * @function reduceObject
   * @param {Object|Array} obj - The Object (or Array) to be filtered
   * @param {module:core/core~reduceCallback|function} fn - The function to be processed for each filtered property
   * @param {Object|Array} [initialValue] - Optional. Value to use as the first argument to the first call of the
   * callback. If no initial value is supplied, the first element in the array will be used. Calling reduce on an empty
   * array without an initial value is an error.
   * @returns {Object|Array}
   */


  jDomCore.reduceObject = function (obj, fn) {
    var initialValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : obj[Object.keys(obj)[0]] || obj[0];
    return Array.isArray(obj) ? obj.reduce(fn, initialValue) : Object.keys(obj).reduce(function (newObj, curr) {
      return fn.apply(void 0, _toConsumableArray([newObj, obj[curr], curr, obj].slice(0, fn.length || 2)));
    }, initialValue);
  };
  /**
   * Helper function for testing if the item is an Object or Array that contains properties or elements
   * @function notEmptyObjectOrArray
   * @param {Object|Array} item - Object or Array to test
   * @returns {boolean}
   */


  jDomCore.notEmptyObjectOrArray = function (item) {
    return !!(_typeof(item) === 'object' && Object.keys(item).length || Array.isArray(item) && item.length);
  };
  /**
   * Re-add the Object Properties which cannot be cloned and must be directly copied to the new cloned object
   * WARNING: This is a recursive function.
   * @param {Object} cloned - A value-only copy of the original object
   * @param {Object} object - The original object that is being cloned
   * @returns {Object|Array}
   */


  var cloneCopy = function cloneCopy(object, cloned) {
    return jDomCore.notEmptyObjectOrArray(object) ? jDomCore.reduceObject(object, function (start, prop, key) {
      start[key] = cloned[key] && !/^(parentItem|listenerArgs|element)$/.test(key) ? cloneCopy(prop, cloned[key]) : prop;
      return start;
    }, cloned) : cloned;
  };
  /**
   * Clone objects for manipulation without data corruption, returns a copy of the provided object.
   * @function cloneObject
   * @param {Object} object - The original object that is being cloned
   * @returns {Object}
   */


  jDomCore.cloneObject = function (object) {
    return cloneCopy(object, JSON.parse(JSON.stringify(object, function (key, val) {
      return !/^(parentItem|listenerArgs|element)$/.test(key) ? val : undefined;
    })));
  };
  /**
   * Merge two objects and provide clone or original on the provided function.
   * The passed function should accept a minimum of two objects to be merged.
   * If the desire is to mutate the input objects, then the function name should
   * have the word 'mutable' in the name (case-insensitive).
   * @param {module:core/core.mergeObjects|module:core/core.mergeObjectsMutable|Function} fn - Pass one of
   * the mergeObjects functions to be used
   * @param {Object} obj1 - The receiving object; this is the object which will have it's properties overridden
   * @param {Object} obj2 - The contributing object; this is the object which will contribute new properties and
   * override existing ones
   * @param {boolean} [isMutable=false] - An optional flag which indicates whether we will clone objects or directly
   * modify them
   * @returns {Object}
   */


  var mergeObjectsBase = function mergeObjectsBase(fn, obj1, obj2) {
    var isMutable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    return jDomCore.notEmptyObjectOrArray(obj2) ? jDomCore.mapObject(obj2, function (prop, key) {
      return obj1[key] && !/^(parentItem|listenerArgs|element)$/.test(key) ? fn(obj1[key], prop) : prop;
    }, isMutable ? obj1 : jDomCore.cloneObject(obj1)) : obj2;
  };
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


  jDomCore.mergeObjects = function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return args.length === 2 ? mergeObjectsBase(jDomCore.mergeObjects, args[0], args[1]) : args.length === 1 ? jDomCore.cloneObject(args[0]) : args.reduce(jDomCore.curry(mergeObjectsBase)(jDomCore.mergeObjects), {});
  };
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


  jDomCore.mergeObjectsMutable = function () {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return args.length === 2 ? mergeObjectsBase(jDomCore.mergeObjectsMutable, args[0], args[1], true) : args.length === 1 ? args[0] : args.reduce(jDomCore.curry(mergeObjectsBase)(jDomCore.mergeObjectsMutable), {});
  };
  /**
   * Generate an array filled with a copy of the provided item or references to the provided item.
   * The length defines how long the array should be.
   * WARNING: This is a recursive function.
   * @param {boolean} useReference - Choose to multiply by clone or reference, true is by reference
   * @param {*} item - The item to be used for each array element
   * @param {number} length - The desired length of the array
   * @param {Array} [arr=[]] - The in-progress array of elements to be built and returned, will be used internally
   * @returns {Array.<*>}
   */


  var buildArrayBase = function buildArrayBase(useReference, item, length) {
    var arr = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    return --length > 0 ? buildArrayBase(useReference, useReference ? item : jDomCore.cloneObject(item), length, arr.concat([item])) : arr.concat([item]);
  };
  /**
   * Leverage buildArrayBase to generate an array filled with a copy of the provided item.
   * The length defines how long the array should be.
   * @function buildArray
   * @param {*} item - The item to be used for each array element
   * @param {number} length - The desired length of the array
   * @param {Array} [arr=[]] - The in-progress array of elements to be built and returned, will be used internally
   * @returns {Array.<*>}
   */


  jDomCore.buildArray = jDomCore.curry(buildArrayBase)(false);
  /**
   * Leverage buildArrayBase to generate an array filled with references to the provided item.
   * The length defines how long the array should be.
   * @function buildArrayOfReferences
   * @param {*} item - The item to be used for each array element
   * @param {number} length - The desired length of the array
   * @param {Array} [arr=[]] - The in-progress array of elements to be built and returned, will be used internally
   * @returns {Array.<*>}
   */

  jDomCore.buildArrayOfReferences = jDomCore.curry(buildArrayBase)(true);
  /**
   * A simple function to check if an item is in an array
   * @function inArray
   * @param {Array} arr - Haystack which may contain the specified property
   * @param {*} prop - Needle to be found within the haystack
   * @returns {boolean}
   */

  jDomCore.inArray = function (arr, prop) {
    return arr.indexOf(prop) >= 0;
  };
  /**
   * Helper for returning the absolute max value
   * @function getAbsoluteMax
   * @param {number} num1 - A number to compare
   * @param {number} num2 - Another number to be compared against
   * @returns {number}
   */


  jDomCore.getAbsoluteMax = function (num1, num2) {
    return Math.abs(num1) > Math.abs(num2) ? num1 : num2;
  };
  /**
   * Helper for returning the absolute min value
   * @function getAbsoluteMin
   * @param {number} num1 - A number to compare
   * @param {number} num2 - Another number to be compared against
   * @returns {number}
   */


  jDomCore.getAbsoluteMin = function (num1, num2) {
    return Math.abs(num1) < Math.abs(num2) ? num1 : num2;
  };
  /**
   * Create a single random number within provided range. And with optional offset,
   * The distance between the result numbers can be adjusted with interval.
   * @function randomNumber
   * @param {number} range - Choose the breadth of the random number (0-100 would be 100 for range)
   * @param {number} [offset=0] - Choose the starting number (1-10 would be 1 for offset, 9 for range)
   * @param {number} [interval=1] - Choose the distance between numbers (~5, ~10, ~15 would be 5 for interval, 1 for
   * offset, 2 for range)
   * @returns {number}
   */


  jDomCore.randomNumber = function (range) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    return (Math.random() * range + offset) * interval;
  };
  /**
   * Create a single random integer within provide range. And with optional offset,
   * The distance between the result numbers can be adjusted with interval.
   * @function randomInteger
   * @param {number} range - Choose the breadth of the random number (0-100 would be 100 for range)
   * @param {number} [offset=0] - Choose the starting number (1-10 would be 1 for offset, 9 for range)
   * @param {number} [interval=1] - Choose the distance between numbers (5, 10, 15 would be 5 for interval, 1 for
   * offset, 2 for range)
   * @returns {number}
   */


  jDomCore.randomInteger = function (range) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    return (Math.floor(Math.random() * range) + offset) * interval;
  };
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


  jDomCore.compare = function (val1, val2) {
    return val1 === val2 ? 0 : val1 > val2 ? 1 : -1;
  };
  /**
   * Compare two Arrays and return the Object where the value for each property is as follows:
   * -1 to indicate val1 is less than val2
   * 0 to indicate both values are the equal
   * 1 to indicate val1 is greater than val2
   * The returned Object uses the element values as the property names
   * This functions works by first creating a concatenated array of all unique values. Then for each unique values,
   * convert to a string and use it as a new property name. Array filter each array checking if it has the unique value.
   * Use the lengths of these filtered arrays to compare. So if the first array has the value and the second one doesn't
   * the first length will be one or more and the second will be zero, if the both have the value then both will be one
   * or more.
   * @example
   * // example of input and resulting output
   * jDomCore.compareArrays(
   *   ['match1', 'firstMismatch1', 'match2', 'firstMismatch2', 'badMatch1'],
   *   ['match1', 'match2', 'secondMismatch1', 'badMatch1', 'badMatch1']
   * )
   * // unique array
   * ['secondMismatch1', 'match1', 'firstMismatch1', 'match2', 'firstMismatch2', 'badMatch1']
   * // result object
   * {secondMismatch1: -1, match1: 0, firstMismatch1: 1, match2: 0, firstMismatch2: 1, badMatch1: -1}
   * @function compareArrays
   * @param {Array} arr1 - The first array to compare
   * @param {Array} arr2 - The second array to compare
   * @returns {Object.<string, number>}
   */


  jDomCore.compareArrays = function (arr1, arr2) {
    return arr2.filter(function (attr) {
      return !jDomCore.inArray(arr1, attr);
    }).concat(arr1).reduce(function (returnObj, attr) {
      return jDomCore.setValue(typeof attr === 'string' ? attr : JSON.stringify(attr, function (key, val) {
        return !/^(parentItem|listenerArgs|element)$/.test(key) ? val : undefined;
      }), jDomCore.compare(arr1.filter(function (val) {
        return val === attr;
      }).length, arr2.filter(function (val) {
        return val === attr;
      }).length), returnObj);
    }, {});
  };
  /**
   * This was adapted from a blog post on Composing Software written by Eric Elliott. Trace provides a way to traces
   * steps through code via the console, while maintaining the functional-style return value.
   * Returns a function which can then receive a value to output, the value will then be returned.
   * @author Eric Elliott
   * @function trace
   * @param {string} label - Pass an identifying label of the value being output.
   * @returns {function(*=)}
   */


  jDomCore.trace = function (label) {
    return function (value) {
      console.info("".concat(label, ": "), value);
      return value;
    };
  };
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


  jDomCore.queueTimeout = function () {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    // Track the queue to be processed in FIFO
    jDomCore.queueTimeout.queue = jDomCore.queueTimeout.queue || []; // Do not run more than one queued item at a time

    jDomCore.queueTimeout.isRunning = jDomCore.queueTimeout.isRunning || false; // Construct an object which will store the queued function data

    for (var _len6 = arguments.length, args = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
      args[_key6 - 2] = arguments[_key6];
    }

    var queueItem = {
      id: 0,
      func: fn,
      timeout: time,
      args: args,
      result: 0
    };

    if (fn) {
      // When the function is valid, append it to the end of the queue
      jDomCore.queueTimeout.queue.push(queueItem);
    }

    if (jDomCore.queueTimeout.queue.length && !jDomCore.queueTimeout.isRunning) {
      // Check that the queue is not empty, and it is not running a queued item
      // Set isRunning flag to begin processing the next queued item
      jDomCore.queueTimeout.isRunning = true; // Pick an item off the front of the queue, and thereby reduce the queue size

      var toRun = jDomCore.queueTimeout.queue.shift(); // Get the timeout ID when it has begun

      toRun.id = setTimeout(function () {
        // Run the function after the provided timeout
        toRun.result = toRun.func.apply(toRun, _toConsumableArray(toRun.args)); // Reset isRunning flag

        jDomCore.queueTimeout.isRunning = false; // Re-run the queue which will get the next queued item if there is one

        return jDomCore.queueTimeout(false);
      }, toRun.timeout); // Return whatever object we have for the current queued item being processed, likely incomplete because the
      // function will complete in the future

      return toRun;
    } // Return newly created queuedItem


    return queueItem;
  };
  /**
   * Either export all functions to be exported, or assign to the Window context
   */


  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = jDomCore;
    }

    exports = Object.assign(exports, jDomCore);
  }
}).call(void 0 || window || {}) // Use the external context to assign this, which will be Window if rendered via browser

/**
 * @file Core objects for representing the DOM in JSON.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
;
(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  var root = this || {};
  /**
   * Verify availability of document
   * @typedef {HTMLDocument|module:pseudoDom/objects.PseudoHTMLDocument} document
   */

  var document = root.document;
  /**
   * If document remains undefined, attempt to retrieve it as a module
   */

  if (!Object.keys(root).length) {
    if (typeof require !== 'undefined') {
      // noinspection JSUnresolvedFunction

      /**
       * @see module:pseudoDom/objects.generate
       * @typedef {Window|module:pseudoDom/objects.PseudoEventTarget} root
       */
      root = require('../../pseudoDom/objects.js').generate(root);
      document = root.document;
    } else {
      console.error('objects.js requires pseudoDom/objects');
    }
  }
  /**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */


  var previousJDomObjectsDom = root.jDomObjectsDom || {};
  /**
   * All methods exported from this module are encapsulated within jDomObjectsDom
   * @author Joshua Heagle <joshuaheagle@gmail.com>
   * @typedef {Object} jDomObjectsDom
   * @module core/dom/objects
   */

  var jDomObjectsDom = {};
  root.jDomObjectsDom = jDomObjectsDom;
  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {jDomObjectsDom}
   */

  jDomObjectsDom.noConflict = function () {
    root.jDomObjectsDom = previousJDomObjectsDom;
    return jDomObjectsDom;
  };
  /**
   * Verify availability of jDomCore
   * @typedef {*|module:core/core} jDomCore
   */


  var jDomCore = root.jDomCore;
  /**
   * If jDomCore remains undefined, attempt to retrieve it as a module
   */

  if (typeof jDomCore === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomCore = require('../core.js');
    } else {
      console.error('core/dom/objects requires core/core');
    }
  }
  /**
   * This is the standard definition of a listenerFunction to be used
   * @callback jDomObjectsDom.listenerFunction
   * @callback listenerFunction
   * @param {Event|module:pseudoDom/objects.PseudoEvent} e - The event object passed to the listener
   * @param {module:core/dom/objects.DomItem} target - The element which triggered the event
   * @param {...*} [args] - Optional args as required by the listener
   */

  /**
   * A Boolean indicating whether events of this type will be dispatched to the registered listerFunction before being
   * dispatched to any EventTarget beneath it in the Dom tree.
   * @typedef {boolean} module:core/dom/objects.UseCapture
   */

  /**
   * OptionsObject defines the structure for the options to be passed to addEventListener
   * @typedef {Object} module:core/dom/objects.OptionsObject
   * @property {boolean} capture - Indicate that events of this type will be dispatched to the registered
   * listenerFunction before being dispatched to any EventTarget beneath it in the Dom tree.
   * @property {boolean} once - Indicate that the listenerFunction should be invoked at most once after being added. If
   * 'true', the listenerFunction would be automatically removed when invoked.
   * @property {boolean} passive - Indicate that, if 'true', indicates that the listenerFunction will never call
   * preventDefault(). If preventDefault() is called, the user agent will do nothing with it.
   */

  /**
   * EventListenerOptions is either a boolean as UseCapture or an Object as OptionsObject
   * @typedef {
   * module:core/dom/objects.OptionsObject|module:core/dom/objects.UseCapture
   * } module:core/dom/objects.EventListenerOptions
   */

  /**
   * An EventListener Object to be appended to the element within the DomItem
   * @typedef {Object} jDomObjectsDom.EventListener
   * @typedef {Object} EventListener
   * @property {string} listenerFunc - A string function name matching an existing
   * {@link module:core/dom/objects~listenerFunction}.
   * @property {Object} listenerArgs - Additional args required for the listener function
   * @property {module:core/dom/objects.EventListenerOptions} listenerOptions - Provides support for options
   * parameter of addEventListener, or false for default
   */

  /**
   * DomItem defines the structure for a single element in the Dom
   * @typedef {Object} module:core/dom/objects.DomItem
   * @property {string} tagName - This is any valid HTMLElement tagName
   * @property {Object.<string, string|Object>} attributes - All potential HTML element attributes can be defined here
   * (including the defaulted style object)
   * @property {(Object|HTMLElement|module:pseudoDom/objects.PseudoHTMLElement)} element - A reference to an existing HTML element will be stored here (default
   * empty object)
   * @property {Object.<Event, module:core/dom/objects~EventListener>} eventListeners - An object holding all
   * events to be registered for the associated element
   * @property {module:core/dom/objects.DomItem} parentItem - A reference to the parent of this object
   * @property {Array.<module:core/dom/objects.DomItem>} children - A reference to an array of child objects
   */

  /**
   * This is the basic Object for representing the Dom in a virtual perspective. All incoming attributes will be merged
   * to the specified format.
   * @function createDomItem
   * @param {...Object} attributes - DomItem-like object(s) to be merged as a DomItem
   * @returns {module:core/dom/objects.DomItem}
   */


  jDomObjectsDom.createDomItem = function () {
    var _jDomCore;

    for (var _len7 = arguments.length, attributes = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      attributes[_key7] = arguments[_key7];
    }

    return (_jDomCore = jDomCore).mergeObjectsMutable.apply(_jDomCore, [{
      tagName: 'div',
      attributes: {
        style: {}
      },
      element: {},
      eventListeners: {},
      parentItem: {},
      children: []
    }].concat(attributes));
  };
  /**
   * DomItemHead defines the structure for a single element in the Dom
   * @typedef {module:core/dom/objects.DomItem} module:core/dom/objects.DomItemHead
   * @typedef {module:core/dom/objects.DomItem} DomItemHead
   * @property {string} [tagName=head] - This is set to the string head referring to the HTML element of the same name
   * @property {Object.<string, string|Object>} attributes - All potential HTML element attributes can be defined here
   * @property {HTMLHeadElement|module:pseudoDom/objects.PseudoHTMLElement} element - A reference to the HTML head element
   * @property {Array.<module:core/dom/objects.DomItem>} children - A reference to an array of child objects
   */

  /**
   * DomItemBody defines the structure for a single element in the Dom
   * @typedef {module:core/dom/objects.DomItem} module:core/dom/objects.DomItemBody
   * @typedef {module:core/dom/objects.DomItem} DomItemBody
   * @property {string} [tagName=body] - This is set to the string body referring to the HTML element of the same name
   * @property {Object.<string, string|Object>} attributes - All potential HTML element attributes can be defined here
   * @property {HTMLBodyElement|module:pseudoDom/objects.PseudoHTMLElement} element - A reference to the HTML body element
   * @property {Array.<module:core/dom/objects.DomItem>} children - A reference to an array of child objects
   */

  /**
   * Initiate the children of Root / DocumentItem. This is a helper for {@link documentDomItem}.
   * @returns {Array.<module:core/dom/objects~DomItemHead|module:core/dom/objects~DomItemBody>}
   */


  var initChildren = function initChildren() {
    return [jDomObjectsDom.createDomItem({
      tagName: 'head',
      attributes: {},
      element: document.head,
      children: []
    }), jDomObjectsDom.createDomItem({
      tagName: 'body',
      attributes: {},
      element: document.body,
      children: []
    })];
  };
  /**
   * DomItemRoot defines the structure for a single element in the Dom
   * @typedef {module:core/dom/objects.DomItem} module:core/dom/objects.DomItemRoot
   * @property {string} [tagName=html] - This is set to the string html referring to the HTML element of the same name
   * @property {Object} attributes - Empty object as attributes placeholder
   * @property {HTMLDocument|module:pseudoDom/objects.PseudoHTMLDocument} element - A reference to the entire Document
   * @property {Object.<string, module:core/dom/objects~listenerFunction>} eventListeners - all registered
   * listeners stored as listener name and function pairs
   * @property {
   * Array.<module:core/dom/objects~DomItemHead|module:core/dom/objects~DomItemBody>
   *   } children - Two references: for head and body
   * @property {module:core/dom/objects~DomItemHead} head - A specific reference to head item
   * @property {module:core/dom/objects~DomItemBody} body - A specific reference to body item
   */

  /**
   * Initiate the Root for DocumentItem. This is primary a helper for {@link documentDomItem}.
   * @param {
   * Array.<module:core/dom/objects~DomItemHead|module:core/dom/objects~DomItemBody>
   *   } children - Provide an array of Head and Body (usually via {@link initChildren})
   * @param {Object.<string, module:core/dom/objects~listenerFunction>} listeners - An object of all event
   * listeners to be registered in the Dom
   * @returns {module:core/dom/objects.DomItemRoot|module:core/dom/objects.DomItem}
   */


  var initRoot = function initRoot(children) {
    var listeners = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return jDomObjectsDom.createDomItem({
      tagName: 'html',
      attributes: {},
      element: document,
      eventListeners: listeners,
      children: children,
      head: children[0],
      body: children[1]
    });
  };
  /**
   * Return a DomItem reference to the document. The rootItem argument is a system variable and not necessary to
   * implement.
   * @function documentDomItem
   * @param {Object.<string, module:core/dom/objects~listenerFunction>} listeners - An object of all event
   * listeners to be registered in the Dom
   * @param {module:core/dom/objects.DomItemRoot|module:core/dom/objects.DomItem} [rootItem] - This is a
   * reference to DomItemRoot which will be defaulted with {@link initRoot}
   * @returns {module:core/dom/objects.DomItemRoot|module:core/dom/objects.DomItem}
   */


  jDomObjectsDom.documentDomItem = function () {
    var listeners = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var rootItem = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : initRoot(initChildren(), listeners);
    rootItem.children = rootItem.children.map(function (child) {
      return jDomObjectsDom.createDomItem(child, {
        parentItem: rootItem
      });
    });
    Object.assign(rootItem.head, rootItem.children[0]);
    Object.assign(rootItem.body, rootItem.children[1]);
    return jDomObjectsDom.createDomItem(rootItem);
  };
  /**
   * Create reference for storing document changes
   * @member documentItem
   * @type {module:core/dom/objects.DomItemRoot}
   */


  jDomObjectsDom.documentItem = jDomObjectsDom.documentDomItem();
  /**
   * Either export all functions to be exported, or assign to the Window context
   */

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = jDomObjectsDom;
    }

    exports = Object.assign(exports, jDomObjectsDom);
  }
}).call(void 0 || window || {}) // Use the external context to assign this, which will be Window if rendered via browser

/**
 * @file Core Dom management functions
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
;
(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  var root = this || {};
  /**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */

  var previousJDomCoreDom = root.jDomCoreDom || {};
  /**
   * All methods exported from this module are encapsulated within jDomCoreDom.
   * @author Joshua Heagle <joshuaheagle@gmail.com>
   * @typedef {Object} jDomCoreDom
   * @module core/dom/core
   */

  var jDomCoreDom = {};
  root.jDomCoreDom = jDomCoreDom;
  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {jDomCoreDom}
   */

  jDomCoreDom.noConflict = function () {
    root.jDomCoreDom = previousJDomCoreDom;
    return jDomCoreDom;
  };
  /**
   * Verify availability of document
   * @typedef {HTMLDocument|module:pseudoDom/objects.PseudoHTMLDocument} document
   */


  var document = root.document;
  /**
   * If document remains undefined, attempt to retrieve it as a module
   */

  if (typeof document === 'undefined') {
    if (typeof require !== 'undefined') {
      // noinspection JSUnresolvedFunction

      /**
       * @see module:pseudoDom/objects.generate
       * @typedef {Window|module:pseudoDom/objects.PseudoEventTarget} root
       */
      root = require('../../pseudoDom/objects.js').generate(root);
      document = root.document;
    } else {
      console.error('core/dom/core requires pseudoDom/objects');
    }
  }
  /**
   * Verify availability of jDomCore
   * @typedef {*|module:core/core} jDomCore
   */


  var jDomCore = root.jDomCore;
  /**
   * If jDomCore remains undefined, attempt to retrieve it as a module
   */

  if (typeof jDomCore === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomCore = require('../core.js');
    } else {
      console.error('core/dom/core requires core/core');
    }
  }
  /**
   * Verify availability of jDomCore
   * @typedef {*|module:core/dom/objects} jDomObjectsDom
   */


  var jDomObjectsDom = root.jDomObjectsDom;
  /**
   * If jDomObjectsDom remains undefined, attempt to retrieve it as a module
   */

  if (typeof jDomObjectsDom === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomObjectsDom = require('./objects.js');
    } else {
      console.error('core/dom/core requires core/dom/objects');
    }
  }
  /**
   * Check if the provided Element has the provided attributes.
   * Returns a boolean, or an array of 1 / 0 / -1 based on the comparison status.
   * @function elementHasAttribute
   * @param {HTMLElement|module:pseudoDom/objects.PseudoHTMLElement} element - Receive the element to be assessed
   * @param {string} key - The attribute name to search for
   * @param {string|Object} attr - The expected value of the attribute to compare against
   * @returns {boolean|Object.<string, number>}
   */


  jDomCoreDom.elementHasAttribute = function (element, key, attr) {
    if (!element.style) {
      // if element is not a valid element then return false
      return false;
    }

    if (/^(style|className)$/.test(key)) {
      // For attributes which are objects or multi-part strings
      // -1 = remove attribute, 0 = no change, 1 = add attribute
      return jDomCore.compareArrays(typeof attr === 'string' ? attr.split(' ') : Object.keys(attr), typeof attr === 'string' ? element[key].split(' ') : Object.keys(element[key]));
    } // Check that the key is a property of the element
    // Compare current to new one


    return element.hasAttribute(key) && element.getAttribute(key) === attr;
  };
  /**
   * Check if a class exists on the element, return object with keys for each class and a -1, 0, 1 difference indicator.
   * @param {HTMLElement|module:pseudoDom/objects.PseudoHTMLElement} element - Provide an element to check classes
   * on.
   * @param {string} classes - A string of classes (like the content of the 'class' attribute) to be compared
   * @returns {Object<string, number>|*}
   */


  jDomCoreDom.elementCompareClassList = function (element, classes) {
    return jDomCore.compareArrays(classes.split(' '), [].from(element.classList));
  };
  /**
   * Given a jDomObjectsDom.DomItem as config, this function will return the changes to be applied
   * to the stored element property.
   * @function elementChanges
   * @param {module:core/dom/objects.DomItem} config - The DomItem having config changes to be applied to its
   * element
   * @returns {module:core/dom/objects.DomItem}
   */


  jDomCoreDom.elementChanges = function (config) {
    return config.element.tagName.toLowerCase() !== config.tagName.toLowerCase() ? // Generate a new element since the tag has changed
    jDomCoreDom.generateElement(config) // Remove all the similarities
    : jDomCore.setValue('attributes', jDomCore.filterObject(config.attributes, // For each attribute, check if it becomes true / false based on the comparison results
    function (attr1, key1) {
      return jDomCore.filterObject( // Get attributes as object of truthy and falsy values
      jDomCore.mapObject(config.attributes, function (attr2, key2) {
        return _typeof(attr2) === 'object' || key2 === 'className' ? // Apply custom logic for class and styles, only keep the updates
        jDomCore.filterObject(jDomCoreDom.elementHasAttribute(config.element, key2, attr2), function (attr3) {
          return attr3 === 1;
        }) // True when the element does not already have the attribute
        : !jDomCoreDom.elementHasAttribute(config.element, key2, attr2);
      }), // Remove when the attr4 value is 0 or false, or not empty object
      function (attr4) {
        return !!attr4;
      })[key1];
    }), config);
  };
  /**
   * Set an attribute on the element within a DomItem, then return the config data.
   * @function setAttribute
   * @param {module:core/dom/objects.DomItem} config - The DomItem having config changes to be applied to its
   * element
   * @param {string} name - The attribute name to be updated
   * @param {string} value - The new value to be applied to the attribute
   * @returns {module:core/dom/objects.DomItem}
   */


  jDomCoreDom.setAttribute = function (config, name, value) {
    config.element.setAttribute(name, value);
    return config;
  };
  /**
   * Set an attribute on the element within a DomItem, then return the attribute.
   * @function setAndReturnAttribute
   * @param {module:core/dom/objects.DomItem} config - The DomItem having config changes to be applied to its
   * element
   * @param {string} name - The attribute name to be updated
   * @param {string} value - The new value to be applied to the attribute
   * @returns {string}
   */


  jDomCoreDom.setAndReturnAttribute = function (config, name, value) {
    config.element.setAttribute(name, value);
    return value;
  };
  /**
   * Update a single objects.DomItem element with the provided attributes / style / elementProperties
   * @function updateElement
   * @param {module:core/dom/objects.DomItem} config - The DomItem having config changes to be applied to its
   * element
   * @returns {module:core/dom/objects.DomItem}
   */


  jDomCoreDom.updateElement = function (config) {
    return !config.element.style // if element is not a valid element then return the config without changes
    ? config // Set the the current attributes to contain all the changes
    : jDomCore.setValue('attributes', jDomCore.mapObject( // Retrieve only the changes to be applied from the attributes
    jDomCoreDom.elementChanges(config).attributes, function (attr, key) {
      return jDomCore.notEmptyObjectOrArray(attr) ? jDomCore.mapObject(jDomCore.filterObject( // Remove attributes which have a numeric key (these are unwanted styles stored on elements)
      attr, function (param, k) {
        return /^\D+$/.test(k);
      }), function (p, i) {
        return jDomCore.setAndReturnValue(config.element.style, i, p);
      }, config.element.style) : key in config.element ? jDomCore.setAndReturnValue(config.element, key, attr) : jDomCoreDom.setAndReturnAttribute(config, key, attr);
    }), config);
  };
  /**
   * Generate HTML element data for each object in the matrix
   * WARNING: This is a recursive function.
   * @function updateElements
   * @param {module:core/dom/objects.DomItem} config - The DomItem having child DomItems with config changes to be
   * applied
   * @returns {module:core/dom/objects.DomItem}
   */


  jDomCoreDom.updateElements = function (config) {
    return jDomCore.mapProperty('children', function (child) {
      return jDomCoreDom.updateElements(child);
    }, jDomCoreDom.updateElement(config));
  };
  /**
   * Create an HTML element based on the provided attributes and return the element as an Object.
   * @function generateElement
   * @param {module:core/dom/objects.DomItem} config - The DomItem requiring matching HTML element property
   * @return {module:core/dom/objects.DomItem}
   */


  jDomCoreDom.generateElement = function (config) {
    return jDomCoreDom.updateElement(jDomCore.setValue('element', document.createElement(config.tagName), config));
  };
  /**
   * Generate HTML element data for a provided DomItem
   * @function bindElement
   * @param {module:core/dom/objects.DomItem} item - The DomItem needing element to be generated
   * @return {module:core/dom/objects.DomItem}
   */


  jDomCoreDom.bindElement = function (item) {
    return jDomCore.setValue('element', !item.element || !item.element.style ? jDomCoreDom.generateElement(item).element : item.element, item);
  };
  /**
   * Simplify detecting the parent item which can be appended to, whether root, or just a parent at any part of the tree
   * @param {
   * module:core/dom/objects.DomItemRoot|module:core/dom/objects.DomItem
   * } parent - A parent DomItem which may or may not have a body
   * @returns {module:core/dom/objects.DomItemBody|module:core/dom/objects.DomItem}
   */


  var retrieveParentItem = function retrieveParentItem(parent) {
    return parent.body ? parent.body : parent;
  };
  /**
   * Having an array and a potential new array element, check if the element is in the array, if not append to array.
   * @param {module:core/dom/objects.DomItem|*} item - An potential array element, possibly a DomItem
   * @param {Array} array - An array where an element may be appended.
   * @returns {Array|Buffer|*|T[]|string}
   */


  var addUniqueToArray = function addUniqueToArray(item, array) {
    return !jDomCore.inArray(array, item) ? array.concat([item]) : array;
  };
  /**
   * Provide a DomItem to be appended to a parent item, return the DomItem.
   * @param {module:core/dom/objects.DomItem} child - A DomItem to be appended
   * @param {module:core/dom/objects.DomItem} parent - A parent item to have a new child appended
   * @returns {module:core/dom/objects.DomItem}
   */


  var appendAndReturnChild = function appendAndReturnChild(child) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : jDomObjectsDom.documentItem.body;
    retrieveParentItem(parent).element.appendChild(child.element);
    return child;
  };
  /**
   * Append a new DomItem which has the element generated.
   * @function appendHTML
   * @param {module:core/dom/objects.DomItem} item - A new DomItem to append
   * @param {module:core/dom/objects.DomItem} parent - The parent to have DomItems appended
   * @returns {module:core/dom/objects.DomItem}
   */


  jDomCoreDom.appendHTML = function (item) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : jDomObjectsDom.documentItem.body;
    return appendAndReturnChild(jDomCoreDom.bindElement(item), jDomCore.setValue('children', addUniqueToArray(item, retrieveParentItem(parent).children), retrieveParentItem(parent)));
  };
  /**
   * Reverse of appendHTML, remove a DomItem and have the associated element removed.
   * @function removeChild
   * @param {module:core/dom/objects.DomItem} item - The DomItem with HTMLElement to be removed
   * @param {module:core/dom/objects.DomItem} parent - The parent of the items
   * @returns {Array.<HTMLElement|PseudoHTMLElement>}
   */


  jDomCoreDom.removeChild = function (item) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : jDomObjectsDom.documentItem.body;
    parent.element.removeChild(item.element);
    return parent.children.splice(parent.children.indexOf(item), 1);
  };
  /**
   * Register a single listener function as part of the root jDomObjectsDom.DomItem.
   * @function registerListener
   * @param {module:core/dom/objects~listenerFunction|function} listener - Provide a function which will be called
   * when a Dom event is triggered.
   * @param {string} [name] - The name of the listener to be used.
   * @param {module:core/dom/objects.DomItemRoot|Object} [parent] - The parent DomItem which is DomItemRoot which
   * stores has eventListeners property.
   * @returns {Object.<string, module:core/dom/objects~listenerFunction>}
   */


  jDomCoreDom.registerListener = function (listener) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : listener.name;
    var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : jDomObjectsDom.documentItem;
    return Object.assign(parent.eventListeners, _defineProperty({}, name, listener));
  };
  /**
   * Register multiple listeners from an array of functions.
   * @function registerListeners
   * @param {Array.<module:core/dom/objects~listenerFunction|function>} listeners - An array of functions to be
   * used as the registered event listeners.
   * @param {module:core/dom/objects.DomItemRoot|Object} [parent] - The parent DomItem which is DomItemRoot which
   * stores has eventListeners property.
   * @returns {module:core/dom/objects.DomItemRoot|Object}
   */


  jDomCoreDom.registerListeners = function (listeners) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : jDomObjectsDom.documentItem;
    return jDomCore.mergeObjects(parent, {
      eventListeners: parent.eventListeners
    }, {
      eventListeners: listeners
    });
  };
  /**
   * Based on the provided function / listener name, retrieve the associated function from the root jDomObjectsDom.DomItem
   * @function retrieveListener
   * @param {string} listenerName - The name of one of the registered listener functions.
   * @param {module:core/dom/objects.DomItemRoot|Object} [parent] - The parent DomItem which is DomItemRoot which
   * stores has eventListeners property.
   * @returns {module:core/dom/objects~listenerFunction|function|Object}
   */


  jDomCoreDom.retrieveListener = function (listenerName) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : jDomObjectsDom.documentItem;
    return jDomCore.inArray(Object.keys(parent.eventListeners), listenerName) ? parent.eventListeners[listenerName] : {};
  };
  /**
   * Provide compatibility for using the options parameter of addEventListener
   * @param {module:core/dom/objects.EventListenerOptions} options - An object or boolean with the listener options
   * @returns {boolean}
   */


  var listenerOptions = function listenerOptions(options) {
    if (typeof listenerOptions.supportsOptions === 'undefined') {
      // Check if supportsOptions has been defined. This is a compatibility checking flag.
      listenerOptions.supportsOptions = true;

      try {
        // If it is possible to use OptionsObject, then set our flag to true
        window.addEventListener('test', null, {
          capture: false,
          once: false,
          passive: false
        });
      } catch (err) {
        // When using an OptionsObjects fails, it is only possible to pass the boolean UseCapture as the option
        listenerOptions.supportsOptions = false;
      }
    }

    return _typeof(options) === 'object' && listenerOptions.supportsOptions ? options : false;
  };
  /**
   * Provide compatibility for assigning listeners.
   * @function assignListener
   * @param {string} trigger - The name of the event which will trigger the listenerFunction on the element.
   * @param {HTMLElement|module:pseudoDom/objects~PseudoHTMLElement} elem - An element to append the listener onto
   * @param {module:core/dom/objects~listenerFunction|function} fn - The function which will be invoked when the
   * event is triggered
   * @param {module:core/dom/objects.EventListenerOptions} options - Additional options to how the event will be
   * fired
   * @returns {module:core/dom/objects~listenerFunction|function}
   */


  jDomCoreDom.assignListener = function (trigger, elem, fn, options) {
    // Attaching a listener may be done differently based on the browser support
    if (elem.addEventListener) {
      // Latest support is provided fro addEventListener with the options parameter varying slightly
      elem.addEventListener(trigger, fn, listenerOptions(options));
    } else if (elem.attachEvent) {
      // Older browsers, especially Internet Explorer
      elem.attachEvent("on".concat(trigger), fn);
    } else {
      // General support for adding a new function onto the element which can be called to trigger the function
      elem["on".concat(trigger)] = fn;
    }

    return fn;
  };
  /**
   * When there may be extra data needed for the event listener function call, this function may be used as a helper
   * to pass the additional data. Also, if it is desirable to add event listeners during run-time, this function can be
   * used to achieve this.
   * WARNING: This is a recursive function.
   * @function appendListeners
   * @param {module:core/dom/objects.DomItem} item - The DomItem which will have its eventListeners updated.
   * @param {string} event - The string name of the event trigger type to be added.
   * @param {string} listener - The name of the function to be called once the event is triggered.
   * @param {Object} args - Additional arguments to be used in the listener function.
   * @param {module:core/dom/objects.EventListenerOptions} options - The strategy used when the event is triggered.
   * @returns {module:core/dom/objects.DomItem}
   */


  jDomCoreDom.appendListeners = function (item, event, listener) {
    var args = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    return jDomCore.mapProperty('children', function (i) {
      return jDomCoreDom.appendListeners(i, event, listener, args, options);
    }, jDomCore.setValue('eventListeners', jDomCore.setValue(event, {
      listenerFunc: listener,
      listenerArgs: args,
      listenerOptions: options
    }, item.eventListeners), item));
  };
  /**
   * Receive a DomItem with eventListeners and apply the event listeners onto the Dom element.
   * @param {module:core/dom/objects.DomItem} item - The DomItem which has eventListeners to apply to its element
   * @returns {module:core/dom/objects.DomItem}
   */


  var bindElementListeners = function bindElementListeners(item) {
    return jDomCore.mapProperty('eventListeners', function (attr, event) {
      return jDomCoreDom.assignListener(event, item.element, function (e) {
        return attr.listenerFunc(e, item, attr.listenerArgs);
      }, attr.listenerOptions);
    }, item);
  };
  /**
   * Based on the eventListeners property of the provided item, bind the
   * listeners to the associated element property for the provided jDomObjectsDom.DomItem.
   * @function bindListeners
   * @param {module:core/dom/objects.DomItem} item - The DomItem which may have eventListeners to apply to its
   * element
   * @returns {module:core/dom/objects.DomItem}
   */


  jDomCoreDom.bindListeners = function (item) {
    return item.eventListeners && Object.keys(item.eventListeners).length && item.element.style ? bindElementListeners(item) : item;
  };
  /**
   * Based on the eventListeners property of the provided item, bind the listeners to the associated element property
   * for each item in the jDomObjectsDom.DomItem structure.
   * WARNING: This is a recursive function.
   * @function bindAllListeners
   * @param {module:core/dom/objects.DomItem} item - The DomItem with an associated HTMLElement to have a listener
   * assigned
   * @returns {module:core/dom/objects.DomItem}
   */


  jDomCoreDom.bindAllListeners = function (item) {
    return jDomCore.mapProperty('children', function (i) {
      return jDomCoreDom.bindAllListeners(i);
    }, jDomCoreDom.bindListeners(item));
  };
  /**
   * To be used with jDomCoreDom.gatherChildItems which will start at item and recurse over all child items, this test
   * will then choose which child items will be returned as the result of the test.
   * @callback module:core/dom/core~testChildItem
   * @param {module:core/dom/objects.DomItem|Object} item - The DomItem is the child being tested
   * @param {Array.<module:core/dom/objects.DomItem>} gatheredResults - All of the child items gathered based on
   * the test
   * @returns {Array.<module:core/dom/objects.DomItem>}
   */

  /**
   * A selector function for retrieving existing child jDomObjectsDom.DomItems from the given parent item.
   * This function will check all the children starting from and including item, and run the test function on each
   * child encountered. The return array contains children returned from the test from all levels.
   * WARNING: This is a recursive function.
   * @function gatherChildItems
   * @param {module:core/dom/objects.DomItem} item - The DomItem which may have child items matching the attribute
   * criteria
   * @param {module:core/dom/core~testChildItem} test - Assess each child, and return the ones which qualify
   * @returns {Array.<module:core/dom/objects.DomItem>}
   */


  jDomCoreDom.gatherChildItems = function (item, test) {
    return test(item, item.children.reduce(function (a, b) {
      return a.concat(jDomCoreDom.gatherChildItems(b, test));
    }, []));
  };
  /**
   * Retrieve the {@link module:core/dom/core~testChildItem} function by providing an attribute and value to check.
   * @param {string} attr - Provide the attribute name to be searched
   * @param {*} value - The attribute value to be compared
   * @returns {module:core/dom/core~testChildItem}
   */


  var getChildTest = function getChildTest(attr, value) {
    return function (item, gatheredResults) {
      return item.attributes[attr] && item.attributes[attr] === value ? gatheredResults.concat([item]) : gatheredResults;
    };
  };
  /**
   * A selector function for retrieving existing child jDomObjectsDom.DomItems from the given parent item.
   * This function will check all the children starting from item, and scan the attributes
   * property for matches. The returned array contains children matching from all levels.
   * WARNING: This calls a recursive function.
   * @function getChildrenFromAttribute
   * @param {string} attr - Provide the attribute name to be searched
   * @param {*} value - The attribute value to be compared
   * @param {module:core/dom/objects.DomItem} item - The DomItem which may have child items matching the attribute
   * criteria
   * @returns {Array.<module:core/dom/objects.DomItem>}
   */


  jDomCoreDom.getChildrenFromAttribute = function (attr, value) {
    var item = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : jDomObjectsDom.documentItem.body;
    return jDomCoreDom.gatherChildItems(item, getChildTest(attr, value));
  };
  /**
   * Helper for getting all jDomObjectsDom.DomItems starting at parent and having specified className attribute
   * @function getChildrenByClass
   * @returns {module:core/dom/objects.DomItem[]}
   */


  jDomCoreDom.getChildrenByClass = jDomCore.curry(jDomCoreDom.getChildrenFromAttribute)('className');
  /**
   * Helper for getting all jDomObjectsDom.DomItems starting at parent and having specified name attribute
   * @function getChildrenByName
   * @returns {module:core/dom/objects.DomItem[]}
   */

  jDomCoreDom.getChildrenByName = jDomCore.curry(jDomCoreDom.getChildrenFromAttribute)('name');
  /**
   * A selector function for retrieving existing child jDomObjectsDom.DomItems from the given parent item.
   * This function will check all the children starting from item, and scan the attributes
   * property for matches. The return array contains children matching from all levels.
   * WARNING: This is a recursive function.
   * @function getParentsFromAttribute
   * @param {string} attr - Provide the attribute name to be searched
   * @param {*} value - The attribute value to be compared
   * @param {module:core/dom/objects.DomItem} item - The DomItem which may have parent items matching the
   * attribute criteria
   * @returns {Array}
   */

  jDomCoreDom.getParentsFromAttribute = function (attr, value) {
    var item = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : jDomObjectsDom.documentItem.body;
    return Object.keys(item.parentItem).length ? (item.parentItem.attributes[attr] || item[attr] || false) === value ? jDomCoreDom.getParentsFromAttribute(attr, value, item.parentItem).concat([item.parentItem]) : jDomCoreDom.getParentsFromAttribute(attr, value, item.parentItem) : [];
  };
  /**
   * Helper for getting all jDomObjectsDom.DomItems starting at child and having specified className attribute
   * @function getParentsByClass
   * @returns {Array}
   */


  jDomCoreDom.getParentsByClass = jDomCore.curry(jDomCoreDom.getParentsFromAttribute)('className');
  /**
   * Helper for getting all jDomObjectsDom.DomItems starting at child and having specified name attribute
   * @function getParentsByName
   * @returns {Array}
   */

  jDomCoreDom.getParentsByName = jDomCore.curry(jDomCoreDom.getParentsFromAttribute)('name');
  /**
   * Helper for getting all jDomObjectsDom.DomItems starting at child and having specified tagName
   * @function getParentsByTagName
   * @returns {Array}
   */

  jDomCoreDom.getParentsByTagName = jDomCore.curry(jDomCoreDom.getParentsFromAttribute)('tagName');
  /**
   * Get the upper parentItem for the provided child. (usually this is a jDomObjectsDom.documentItem reference)
   * WARNING: This is a recursive function.
   * @function getTopParentItem
   * @param {module:core/dom/objects.DomItem} item - The DomItem which we want the highest parent item of
   * @returns {module:core/dom/objects.DomItemRoot}
   */

  jDomCoreDom.getTopParentItem = function (item) {
    return Object.keys(item.parentItem).length ? jDomCoreDom.getTopParentItem(item.parentItem) : item;
  };
  /**
   * This is a shortcut for building the specified HTML elements and appending them to the Dom
   * with associated listeners.
   * The final argument is specific for adding event listeners with options.
   * @function renderHTML
   * @param {module:core/dom/objects.DomItem} item - The DomItem that we want to render the element for
   * @param {module:core/dom/objects.DomItemRoot} parent - The Base Dom item which is the parent of all the items
   * @returns {module:core/dom/objects.DomItem}
   */


  jDomCoreDom.renderHTML = function (item) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : jDomObjectsDom.documentItem;
    return jDomCore.pipe(function (domItem) {
      return jDomCore.setValue('element', domItem.element && domItem.element.style ? domItem.element : jDomCoreDom.bindElement(domItem).element, domItem);
    }, function (domItem) {
      return jDomCore.setValue('eventListeners', jDomCore.mapObject(domItem.eventListeners, function (prop) {
        return jDomCore.mergeObjects(prop, {
          listenerFunc: jDomCoreDom.retrieveListener(prop.listenerFunc, jDomCoreDom.getTopParentItem(parent))
        });
      }), domItem);
    }, jDomCore.curry(jDomCore.setValue)('parentItem', parent.body || parent), function (domItem) {
      return jDomCoreDom.bindListeners(jDomCoreDom.appendHTML(domItem, parent));
    }, function (domItem) {
      return jDomCore.mapProperty('children', function (child) {
        return jDomCoreDom.renderHTML(child, domItem);
      }, domItem);
    })(jDomCore.mapObject(jDomObjectsDom.createDomItem(item), function (prop) {
      return prop;
    }, item));
  };
  /**
   * Either export all functions to be exported, or assign to the Window context
   */


  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = jDomCoreDom;
    }

    exports = Object.assign(exports, jDomCoreDom);
  }
}).call(void 0 || window || {}) // Use the external context to assign this, which will be Window if rendered via browser

/**
 * @file Core Matrix objects for representing DOM grid in JSON.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
;
(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  var root = this || {};
  /**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */

  var previousJDomMatrixObjects = root.jDomMatrixObjects || {};
  /**
   * All methods exported from this module are encapsulated within jDomMatrixObjects.
   * @author Joshua Heagle <joshuaheagle@gmail.com>
   * @typedef {Object} jDomMatrixObjects
   * @module matrix/objects
   */

  var jDomMatrixObjects = {};
  root.jDomMatrixObjects = jDomMatrixObjects;
  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {jDomMatrixObjects}
   */

  jDomMatrixObjects.noConflict = function () {
    root.jDomMatrixObjects = previousJDomMatrixObjects;
    return jDomMatrixObjects;
  };
  /**
   * Verify availability of jDomCore
   * @typedef {*|module:core/core} jDomCore
   */


  var jDomCore = root.jDomCore;
  /**
   * If jDomCore remains undefined, attempt to retrieve it as a module
   */

  if (typeof jDomCore === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomCore = require('../core/core.js');
    } else {
      console.error('objects.js requires jDomCore');
    }
  }
  /**
   * Verify availability of jDomObjectsDom
   * @typedef {*|module:core/dom/objects} jDomObjectsDom
   */


  var jDomObjectsDom = root.jDomObjectsDom;
  /**
   * If jDomObjectsDom remains undefined, attempt to retrieve it as a module
   */

  if (typeof jDomObjectsDom === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomObjectsDom = require('../core/dom/objects.js');
    } else {
      console.error('core.js requires objects');
    }
  }
  /**
   * A string representing an axis: x, y, z
   * @typedef {string} module:matrix/objects.axis
   */

  /**
   * A number representing a coordinate in a {@link module:matrix/objects.Matrix}
   * @typedef {number} module:matrix/objects.coordinate
   */

  /**
   * Point stores a location in a {@link module:matrix/objects.Matrix} defined by three key-value pairs
   * ({@link module:matrix/objects.axis}=>{@link module:matrix/objects.coordinate})
   * @typedef {
   * Object.<module:matrix/objects.axis, module:matrix/objects.coordinate>
   *   } module:matrix/objects.Point
   * @property {module:matrix/objects.coordinate} x - The X-coordinate of a Point
   * @property {module:matrix/objects.coordinate} y - The Y-coordinate of a Point
   * @property {module:matrix/objects.coordinate} z - The Z-coordinate of a Point
   */

  /**
   * Point stores a location in a {@link module:matrix/objects.Matrix} defined by three key-value pairs
   * @typedef {module:matrix/objects.Point} module:matrix/objects.Direction
   * @property {module:matrix/objects.coordinate} x - The X-coordinate must be either -1, 0, or 1
   * @property {module:matrix/objects.coordinate} y - The Y-coordinate must be either -1, 0, or 1
   * @property {module:matrix/objects.coordinate} z - The Z-coordinate must be either -1, 0, or 1
   */

  /**
   * Store the point data for an x, y, z {@link module:matrix/objects.Matrix}.
   * @function point
   * @param {module:matrix/objects.coordinate} x - The numeric value for X-coordinate
   * @param {module:matrix/objects.coordinate} y - The numeric value for Y-coordinate
   * @param {module:matrix/objects.coordinate} [z=0] - The numeric value for Z-coordinate (default to 0 for 2D
   * {@link module:matrix/objects.Matrix})
   * @returns {module:matrix/objects.Point}
   */


  jDomMatrixObjects.point = function (x, y) {
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return {
      x: x,
      y: y,
      z: z
    };
  };
  /**
   * MatrixTile is an Object which stores a reference a {@link Point} and can be populated with additionally associated
   * fields.
   * @typedef {Object.<string, module:matrix/objects.Point>} module:matrix/objects.MatrixTile
   * @property {module:matrix/objects.Point} point - a reference to its location in a
   * {@link module:matrix/objects.Matrix}
   * @property {module:matrix/objects.axis} axis - The axis will be 'x'
   */

  /**
   * A default tile in the {@link module:matrix/objects.Matrix}
   * @function tile
   * @returns {module:matrix/objects.MatrixTile}
   */


  jDomMatrixObjects.tile = function () {
    return {
      point: {}
    };
  };
  /**
   * MatrixColumn is a DomItem which represents the x axis and also stores {@link module:matrix/objects.MatrixTile}
   * @typedef {
   * module:core/dom/objects.DomItem|module:matrix/objects.MatrixTile
   * } module:matrix/objects.MatrixColumn
   */

  /**
   * MatrixRow is the parent of a group of {@link module:matrix/objects.MatrixTile}
   * @typedef {module:core/dom/objects.DomItem} module:matrix/objects.MatrixRow
   * @property {module:matrix/objects.axis} axis - The axis will be 'y'
   * @property {Array.<module:matrix/objects.MatrixColumn>} children - all of the MatrixTile items as part of this
   * MatrixRow
   */

  /**
   * MatrixLayer is the parent of a group of {@link module:matrix/objects.MatrixTile}
   * @typedef {module:core/dom/objects.DomItem} module:matrix/objects.MatrixLayer
   * @property {module:matrix/objects.axis} axis - The axis will be 'y'
   * @property {Array.<module:matrix/objects.MatrixRow>} children - all of the MatrixRow items as part of this
   * MatrixLayer
   */

  /**
   * Matrix is a multi-level {@link module:core/dom/objects.DomItem} which is used to visually represent a
   * mathematical grid / matrix.
   * The matrix consists of four DomItem levels, at the top tier is the Matrix container with class matrix.
   * The second tier represents the z axis (with property axis='z') and has the class layer.
   * The third tier represents the y axis (with property axis='y') and has the class row.
   * The fourth (final) tier represents the x axis (with property axis='x') and has the class column.
   * The {@link module:matrix/objects.MatrixTile} is attached on the x axis tier.
   * The number of children at each level is defined by the size of the matrix, the end result is a multidimensional
   * array.
   * @typedef {module:core/dom/objects.DomItem} module:matrix/objects.Matrix
   * @augments module:core/dom/objects.DomItem
   */

  /**
   * Create a 3d matrix of i with x by y by z size, add additional objects for each layer as well
   * @function matrix
   * @param {
   * {coordinate: module:matrix/objects.coordinate, props: Array.<module:matrix/objects.MatrixTile>}
   * } x - Properties and a coordinate defining the width of the matrix.
   * @param {
   * {coordinate: module:matrix/objects.coordinate, props: Array.<module:matrix/objects.MatrixRow>}
   * } y - Properties and a coordinate defining the height of the matrix.
   * @param {
   * {coordinate: module:matrix/objects.coordinate, props: Array.<module:matrix/objects.MatrixLayer>}
   * } z - Properties and a coordinate defining the depth of the matrix.
   * @param {Array.<module:matrix/objects.Matrix>} matrixProps - Properties to be added to the matrix
   * @returns {module:matrix/objects.Matrix}
   */


  jDomMatrixObjects.matrix = function () {
    var _jDomObjectsDom, _jDomObjectsDom2, _jDomObjectsDom3, _jDomObjectsDom4;

    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      coordinate: 0,
      props: []
    };
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      coordinate: 0,
      props: []
    };
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      coordinate: 1,
      props: []
    };
    var matrixProps = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    return (_jDomObjectsDom = jDomObjectsDom).createDomItem.apply(_jDomObjectsDom, [{
      tagName: 'div',
      attributes: {
        className: 'matrix'
      },
      children: jDomCore.buildArray((_jDomObjectsDom2 = jDomObjectsDom).createDomItem.apply(_jDomObjectsDom2, [{
        axis: 'z',
        tagName: 'div',
        attributes: {
          className: 'layer'
        },
        children: jDomCore.buildArray((_jDomObjectsDom3 = jDomObjectsDom).createDomItem.apply(_jDomObjectsDom3, [{
          axis: 'y',
          tagName: 'div',
          attributes: {
            className: 'row'
          },
          children: jDomCore.buildArray((_jDomObjectsDom4 = jDomObjectsDom).createDomItem.apply(_jDomObjectsDom4, [{
            axis: 'x',
            tagName: 'div',
            attributes: {
              className: 'column'
            }
          }].concat(_toConsumableArray(x.props))), x.coordinate)
        }].concat(_toConsumableArray(y.props))), y.coordinate)
      }].concat(_toConsumableArray(z.props))), z.coordinate)
    }].concat(_toConsumableArray(matrixProps)));
  };
  /**
   * Return a single layer matrix where x and y are equal
   * @function square
   * @param {Array.<module:matrix/objects.MatrixTile>} [x=[]] - All the data to be presented as part of the
   * specified point, requires MatrixTile base
   * @param {Array.<module:matrix/objects.MatrixRow>} [y=[]] - Additional data to append to the MatrixRow
   * @param {Array.<module:matrix/objects.MatrixLayer>} [z=[]] - Additional data to append to the MatrixLayer
   * @param {Array.<module:matrix/objects.Matrix>} [matrixProps=[]] - Additional data to append to the Matrix
   * @param {number} size - Used to define height and width as equal values (depth is set to 1)
   * @returns {module:matrix/objects.Matrix}
   */


  jDomMatrixObjects.square = function () {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$x = _ref.x,
        x = _ref$x === void 0 ? [] : _ref$x,
        _ref$y = _ref.y,
        y = _ref$y === void 0 ? [] : _ref$y,
        _ref$z = _ref.z,
        z = _ref$z === void 0 ? [] : _ref$z,
        _ref$matrixProps = _ref.matrixProps,
        matrixProps = _ref$matrixProps === void 0 ? [] : _ref$matrixProps;

    var size = arguments.length > 1 ? arguments[1] : undefined;
    return jDomMatrixObjects.matrix({
      coordinate: size,
      props: x
    }, {
      coordinate: size,
      props: y
    }, {
      coordinate: 1,
      props: z
    }, matrixProps);
  };
  /**
   * Return a matrix where x, y, and z are equal
   * @function cube
   * @param {Array.<module:matrix/objects.MatrixTile>} [x=[]] - All the data to be presented as part of the
   * specified point, requires MatrixTile base
   * @param {Array.<module:matrix/objects.MatrixRow>} [y=[]] - Additional data to append to the MatrixRow
   * @param {Array.<module:matrix/objects.MatrixLayer>} [z=[]] - Additional data to append to the MatrixLayer
   * @param {Array.<module:matrix/objects.Matrix>} [matrixProps=[]] - Additional data to append to the Matrix
   * @param {number} size - Used to define height, width, and depth as equal values
   * @returns {module:matrix/objects.Matrix}
   */


  jDomMatrixObjects.cube = function () {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$x = _ref2.x,
        x = _ref2$x === void 0 ? [] : _ref2$x,
        _ref2$y = _ref2.y,
        y = _ref2$y === void 0 ? [] : _ref2$y,
        _ref2$z = _ref2.z,
        z = _ref2$z === void 0 ? [] : _ref2$z,
        _ref2$matrixProps = _ref2.matrixProps,
        matrixProps = _ref2$matrixProps === void 0 ? [] : _ref2$matrixProps;

    var size = arguments.length > 1 ? arguments[1] : undefined;
    return jDomMatrixObjects.matrix({
      coordinate: size,
      props: x
    }, {
      coordinate: size,
      props: y
    }, {
      coordinate: size,
      props: z
    }, matrixProps);
  };
  /**
   * Either export all functions to be exported, or assign to the Window context
   */


  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = jDomMatrixObjects;
    }

    exports = Object.assign(exports, jDomMatrixObjects);
  }
}).call(void 0 || window || {}) // Use the external context to assign this, which will be Window if rendered via browser

/**
 * @file All of the jDomCore matrix functions for working with a grid of points.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
;
(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  var root = this || {};
  /**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */

  var previousJDomMatrixCore = root.jDomMatrixCore || {};
  /**
   * All methods exported from this module are encapsulated within jDomMatrixCore.
   * @author Joshua Heagle <joshuaheagle@gmail.com>
   * @typedef {Object} jDomMatrixCore
   * @module matrix/core
   */

  var jDomMatrixCore = {};
  root.jDomMatrixCore = jDomMatrixCore;
  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {jDomMatrixCore}
   */

  jDomMatrixCore.noConflict = function () {
    root.jDomMatrixCore = previousJDomMatrixCore;
    return jDomMatrixCore;
  };
  /**
   * Verify availability of jDomMatrixObjects
   * @typedef {*|module:core/core} jDomCore
   */


  var jDomCore = root.jDomCore;
  /**
   * If jDomCore remains undefined, attempt to retrieve it as a module
   */

  if (typeof jDomCore === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomCore = require('../core/core.js');
    } else {
      console.error('matrix/core requires core/core');
    }
  }
  /**
   * Verify availability of jDomMatrixObjects
   * @typedef {*|module:matrix/objects} jDomMatrixObjects
   */


  var jDomMatrixObjects = root.jDomMatrixObjects;
  /**
   * If jDomCoreDom remains undefined, attempt to retrieve it as a module
   */

  if (typeof jDomMatrixObjects === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomMatrixObjects = require('./objects.js');
    } else {
      console.error('matrix/core requires matrix/objects');
    }
  }
  /**
   * Generate point data for each item in the matrix
   * WARNING: This is a recursive function.
   * @function bindPointData
   * @param {module:matrix/objects.MatrixColumn|module:matrix/objects.MatrixRow} item - A special DomItem
   * which is either a layer, row, or column in a matrix.
   * @param {module:matrix/objects.Point} pnt - A point to be added to a specific Matrix Column
   * @returns {module:matrix/objects.MatrixColumn|module:matrix/objects.MatrixRow}
   */


  jDomMatrixCore.bindPointData = function (item) {
    var pnt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : jDomMatrixObjects.point(0, 0, 0);
    return jDomCore.mergeObjects(item, item.point ? {
      point: jDomCore.cloneObject(pnt)
    } : {
      children: item.children.map(function (el, i) {
        return jDomMatrixCore.bindPointData(el, Object.assign(pnt, _defineProperty({}, el.axis, i)));
      })
    });
  };
  /**
   * Based on provided point and point direction generate next point.
   * @function nextCell
   * @param {module:matrix/objects.Point} pnt - Provide the current / initial point
   * @param {module:matrix/objects.Direction} dir - Provide the direction to be applied to find the next point
   * @returns {module:matrix/objects.Point}
   */


  jDomMatrixCore.nextCell = function (pnt, dir) {
    return jDomMatrixObjects.point(pnt.x + dir.x, pnt.y + dir.y, pnt.z + dir.z);
  };
  /**
   * Based on provided point and another point, get a point with the difference between each axis
   * @function pointDifference
   * @param {module:matrix/objects.Point} start - The first point to compare
   * @param {module:matrix/objects.Point} end - The other point to be compared
   * @returns {module:matrix/objects.Point}
   */


  jDomMatrixCore.pointDifference = function (start, end) {
    return jDomMatrixObjects.point(end.x - start.x, end.y - start.y, end.z - start.z);
  };
  /**
   * Given two points, compare the x, y, and z of each to see if they are the same
   * @function areEqualPoints
   * @param {module:matrix/objects.Point} p1 - The first point to compare
   * @param {module:matrix/objects.Point} p2 - The other point to be compared
   * @returns {boolean}
   */


  jDomMatrixCore.areEqualPoints = function (p1, p2) {
    return p1.x === p2.x && p1.y === p2.y && p1.z === p2.z;
  };
  /**
   * Return the first coordinate number with the highest absolute value.
   * @function getHighestAbsoluteCoordinate
   * @param {module:matrix/objects.Point} pnt - A Point to be assessed.
   * @returns {module:matrix/objects.coordinate}
   */


  jDomMatrixCore.getHighestAbsoluteCoordinate = function (pnt) {
    return jDomCore.reduceObject(pnt, jDomCore.getAbsoluteMax, 0);
  };
  /**
   * Having provided a coordinate number, find all corresponding axis, return the first match.
   * @function getFirstAxisOfCoordinate
   * @param {module:matrix/objects.Point} pnt - The Point containing a matching coordinate.
   * @param {module:matrix/objects.coordinate} coordinate - The coordinate to search for.
   * @returns {false|module:matrix/objects.axis}
   */


  jDomMatrixCore.getFirstAxisOfCoordinate = function (pnt, coordinate) {
    return Object.keys(pnt).filter(function (key) {
      return pnt[key] === coordinate;
    })[0] || false;
  };
  /**
   * Given a point and the value of the highest coordinate select the corresponding axis which will be the direction
   * (-1 or 1) to and set the other axis to 0.
   * @param {module:matrix/objects.Point} pnt - The which will be converted to a direction.
   * @param {module:matrix/objects.coordinate} highestCoordinate - The highest coordinate provided by the point.
   * @returns {module:matrix/objects.Direction}
   */


  var pointAndCoordinateToDirection = function pointAndCoordinateToDirection(pnt, highestCoordinate) {
    return function (axis) {
      return axis !== false ? jDomCore.mergeObjects(jDomMatrixObjects.point(0, 0, 0), _defineProperty({}, "".concat(axis), highestCoordinate > 0 ? 1 : -1)) : jDomMatrixObjects.point(0, 0, 0);
    }(jDomMatrixCore.getFirstAxisOfCoordinate(pnt, highestCoordinate));
  };
  /**
   * Having a point, convert it to a direction where the axis with the highest coordinate value will be set to -1 or 1.
   * @param {module:matrix/objects.Point} pnt - The point to be converted to a direction.
   * @returns {module:matrix/objects.Direction}
   */


  var pointToDirection = function pointToDirection(pnt) {
    return pointAndCoordinateToDirection(pnt, jDomMatrixCore.getHighestAbsoluteCoordinate(pnt));
  };
  /**
   * Retrieve a directional coordinate value based on two provided points
   * (directions consist of two zero coordinates and a single coordinate of 1 / -1)
   * @function pointsToDirection
   * @param {module:matrix/objects.Point} start - The first point to assess.
   * @param {module:matrix/objects.Point} end - The other point to assess.
   * @returns {module:matrix/objects.Direction}
   */


  jDomMatrixCore.pointsToDirection = function (start, end) {
    return pointToDirection(jDomMatrixCore.pointDifference(start, end));
  };
  /**
   * Generate a random starting point for a line with the provided length and direction.
   * @function randomStart
   * @param {number} length - The intended length the resulting line.
   * @param {module:matrix/objects.Direction} dir - The direction the line will extend towards.
   * @param {module:matrix/objects.Point} [lengthLimits={x: 10, y: 10, z: 10}] - The maximum grid size.
   * @returns {module:matrix/objects.Point}
   */


  jDomMatrixCore.randomStart = function (length, dir) {
    var lengthLimits = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : jDomMatrixObjects.point(10, 10, 10);
    return jDomMatrixObjects.point(jDomCore.randomInteger(lengthLimits.x - (length - 1) * dir.x), jDomCore.randomInteger(lengthLimits.y - (length - 1) * dir.y), jDomCore.randomInteger(lengthLimits.z - (length - 1) * dir.z));
  };
  /**
   * Given a start point, line length, and a direction, generate the end point of the line.
   * @function lineEndPoint
   * @param {module:matrix/objects.Point} start - The selected starting point.
   * @param {number} length - The total length of the line.
   * @param {module:matrix/objects.Direction} dir - The direction of the line.
   * @returns {module:matrix/objects.Point}
   */


  jDomMatrixCore.lineEndPoint = function (start, length, dir) {
    return jDomMatrixObjects.point(start.x + dir.x * (length - 1), start.y + dir.y * (length - 1), start.z + dir.z * (length - 1));
  };
  /**
   * Having provided two points, return an array of transition points connecting 'start' and 'end'. Return array
   * includes 'start' (line[0]) and 'end' (line[line.length-1])
   * @function getPointsLine
   * @param {module:matrix/objects.Point} start - The starting location of the line.
   * @param {module:matrix/objects.Point} end - The final line destination.
   * @param {Array.<module:matrix/objects.Point>} [line=[]] - The resulting line to connect start and end.
   * @returns {Array.<module:matrix/objects.Point>}
   */


  jDomMatrixCore.getPointsLine = function (start, end) {
    var line = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    return jDomMatrixCore.areEqualPoints(start, end) ? line.concat([start]) : jDomMatrixCore.getPointsLine(jDomMatrixCore.nextCell(start, jDomMatrixCore.pointsToDirection(start, end)), end, line.concat([start]));
  };
  /**
   * Takes an array of arrays containing two points each. Calls getPointsLine for each array of points. Returns an
   * array of all points captured for each line segment
   * @function getPointsLines
   * @param {Array.<Array.<module:matrix/objects.Point>>} lines - An array of lines only containing start and end.
   * @returns {Array.<Array.<module:matrix/objects.Point>>}
   */


  jDomMatrixCore.getPointsLines = function (lines) {
    return lines.reduce(function (pointsArray, line) {
      return pointsArray.concat(jDomMatrixCore.getPointsLine.apply(jDomMatrixCore, _toConsumableArray(line)));
    }, []);
  };
  /**
   * Function that produces a property of the new Object, taking three arguments
   * @callback module:matrix/core~testPointStatus
   * @param {module:matrix/objects.MatrixColumn|Object} pnt - A point which may have some status.
   * @param {module:matrix/objects.Matrix|Object} matrix - A matrix of points to find the point within.
   * @returns {boolean}
   */

  /**
   * Given a start and end point, test the points between with the provided function. Return the points as part of true
   * and / or false properties based on the test.
   * @function module:matrix/core~testPointsBetween
   * @param {module:matrix/objects.Point} start - The beginning point to check.
   * @param {module:matrix/objects.Point} end - The terminating point to check between.
   * @param {module:matrix/objects.Matrix} matrix - The grid of points all the points can exist on.
   * @param {module:matrix/core~testPointStatus} func - The test function which will return true or false.
   * @param {boolean} [inclusive=true] - Choose whether to include or exclude the start and end points in the results.
   * @returns {Object.<string, Array.<module:matrix/objects.Point>>}
   */


  jDomMatrixCore.testPointsBetween = function (start, end, matrix, func) {
    var inclusive = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    return jDomMatrixCore.getPointsLine(start, end).filter(function (prop, i, line) {
      return i !== 0 && i !== line.length - 1 || inclusive;
    }).reduce(function (newPoints, next) {
      return jDomCore.mergeObjects(newPoints, _defineProperty({}, "".concat(func(next, matrix)), [next]));
    }, {
      "true": [],
      "false": []
    });
  };
  /**
   * Given two points, check the cells between using specified function.
   * When inclusive is set to true the provided start and end points will also be tested
   * @function checkInBetween
   * @param {...*} args - These args match the parameter list for {@link module:matrix/core~testPointsBetween}
   * @returns {boolean}
   */


  jDomMatrixCore.checkInBetween = function () {
    return !!jDomMatrixCore.testPointsBetween.apply(jDomMatrixCore, arguments)["true"].length;
  };
  /**
   * Return point-like object with all of the axis lengths.
   * @function getAxisLengths
   * @param {module:matrix/objects.Matrix} matrix - The matrix to get the dimensions of.
   * @returns {module:matrix/objects.Point}
   */


  jDomMatrixCore.getAxisLengths = function (matrix) {
    return jDomMatrixObjects.point(matrix.children[0].children[0].children.length, matrix.children[0].children.length, matrix.children.length);
  };
  /**
   * Get random direction point
   * @function randDirection
   * @param {Array.<module:matrix/objects.Point>} [useCoordinates=[]] - An array of possible directions.
   * @returns {module:matrix/objects.Direction}
   */


  jDomMatrixCore.randDirection = function () {
    var useCoordinates = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return useCoordinates.length ? useCoordinates[jDomCore.randomInteger(useCoordinates.length)] : jDomMatrixObjects.point(0, 0, 0);
  };
  /**
   * Test if the provided point exists in the matrix.
   * @function checkValidPoint
   * @param {module:matrix/objects.Point} pnt - Provide a point to validate.
   * @param {module:matrix/objects.Matrix} matrix - The matrix that contains valid points.
   * @returns {boolean}
   */


  jDomMatrixCore.checkValidPoint = function (pnt, matrix) {
    return !!matrix.children[pnt.z] && !!matrix.children[pnt.z].children[pnt.y] && !!matrix.children[pnt.z].children[pnt.y].children[pnt.x] && !!matrix.children[pnt.z].children[pnt.y].children[pnt.x].point;
  };
  /**
   * Retrieve the DomItem associated with the provided point
   * @function getDomItemFromPoint
   * @param {module:matrix/objects.Point} pnt - A point corresponding to a DomItem.
   * @param {module:matrix/objects.Matrix} matrix - The matrix containing the point.
   * @returns {false|module:core/dom/objects.DomItem}
   */


  jDomMatrixCore.getDomItemFromPoint = function (pnt, matrix) {
    return jDomMatrixCore.checkValidPoint(pnt, matrix) ? matrix.children[pnt.z].children[pnt.y].children[pnt.x] : false;
  };
  /**
   * Return an array of all the points in the matrix
   * @function getAllPoints
   * @param {module:matrix/objects.Matrix|module:matrix/objects.MatrixColumn} matrix - The matrix to retrieve
   * points from.
   * @param {Array.<module:matrix/objects.Point>} [allPoints=[]] - The array of points to be returned
   * @returns {Array.<module:matrix/objects.Point>}
   */


  jDomMatrixCore.getAllPoints = function (matrix) {
    var allPoints = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return matrix.point ? allPoints.concat([matrix.point]) : matrix.children.reduce(function (allPoints, child) {
      return allPoints.concat(jDomMatrixCore.getAllPoints(child, []));
    }, []);
  };
  /**
   * Return all valid points surrounding a provided point
   * @function adjacentPoints
   * @param {module:matrix/objects.Point} pnt - The point we want to find adjacent points for.
   * @param {module:matrix/objects.Matrix} matrix - The matrix having the point.
   * @returns {Array.<module:matrix/objects.Point>}
   */


  jDomMatrixCore.adjacentPoints = function (pnt, matrix) {
    return jDomMatrixCore.getPointsLines([[jDomMatrixObjects.point(-1, 1, 1), jDomMatrixObjects.point(1, -1, -1)], [jDomMatrixObjects.point(1, 1, 1), jDomMatrixObjects.point(-1, 1, -1)], [jDomMatrixObjects.point(-1, -1, 1), jDomMatrixObjects.point(1, -1, 1)], [jDomMatrixObjects.point(1, 0, 0), jDomMatrixObjects.point(1, 1, -1)], [jDomMatrixObjects.point(-1, 1, 0), jDomMatrixObjects.point(1, 1, 0)]]).concat([jDomMatrixObjects.point(0, 0, 1), jDomMatrixObjects.point(1, 0, 0), jDomMatrixObjects.point(-1, 0, -1), jDomMatrixObjects.point(0, 0, -1)]).map(function (p) {
      return jDomMatrixCore.nextCell(pnt, p);
    }).filter(function (p) {
      return jDomMatrixCore.checkValidPoint(jDomMatrixCore.nextCell(pnt, p), matrix);
    });
  };
  /**
   * Return all points which touch on edges (not diagonal)
   * @function adjacentEdgePoints
   * @param {module:matrix/objects.Point} pnt - The point we want to find adjacent points for.
   * @param {module:matrix/objects.Matrix} matrix - The matrix having the point.
   * @returns {Array.<module:matrix/objects.Point>}
   */


  jDomMatrixCore.adjacentEdgePoints = function (pnt, matrix) {
    return [jDomMatrixObjects.point(-1, 0, 0), jDomMatrixObjects.point(1, 0, 0), jDomMatrixObjects.point(0, -1, 0), jDomMatrixObjects.point(0, 1, 0), jDomMatrixObjects.point(0, 0, -1), jDomMatrixObjects.point(0, 0, 1)].map(function (p) {
      return jDomMatrixCore.nextCell(pnt, p);
    }).filter(function (p) {
      return jDomMatrixCore.checkValidPoint(p, matrix);
    });
  };
  /**
   * Retrieve the point associated with the provided element.
   * @function getPointFromElement
   * @param {Node|HTMLElement|module:pseudoDom/objects.PseudoHTMLElement} elem - Provide an element associated with
   * a point.
   * @returns {module:matrix/objects.Point}
   */


  jDomMatrixCore.getPointFromElement = function (elem) {
    return jDomMatrixObjects.point(Array.from(elem.parentNode.childNodes).indexOf(elem), Array.from(elem.parentNode.parentNode.childNodes).indexOf(elem.parentNode), Array.from(elem.parentNode.parentNode.parentNode.childNodes).indexOf(elem.parentNode.parentNode));
  };
  /**
   * Retrieve the DomItem associated with the provided element in the matrix
   * @function getDomItemFromElement
   * @param {Node|HTMLElement|module:pseudoDom/objects.PseudoHTMLElement} elem - Provide an element having an
   * associated DomItem.
   * @param {module:matrix/objects.Matrix} matrix - The matrix potentially containing the DomItem with Point.
   * @returns {module:core/dom/objects.DomItem}
   */


  jDomMatrixCore.getDomItemFromElement = function (elem, matrix) {
    return jDomMatrixCore.getDomItemFromPoint(jDomMatrixCore.getPointFromElement(elem), matrix);
  };
  /**
   * Either export all functions to be exported, or assign to the Window context
   */


  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = jDomMatrixCore;
    }

    exports = Object.assign(exports, jDomMatrixCore);
  }
}).call(void 0 || window || {}) // Use the external context to assign this, which will be Window if rendered via browser

/**
 * @file Make all of JSON DOM available from this file in the browser.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
;
(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  var root = this || {};
  /*
   * Store reference to any pre-existing module of the same name
   * @type {jsonDom|*}
   */

  var previousJsonDom = root.jsonDom || {};
  /**
   * A reference to all functions to be used globally / exported
   * @typedef (Object) jsonDom
   */

  var jsonDom = {};
  root.jsonDom = jsonDom;
  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {jsonDom}
   */

  jsonDom.noConflict = function () {
    root.jsonDom = previousJsonDom;
    return jsonDom;
  };
  /**
   * Verify availability of jDomCore
   * @typedef {*|module:core/core} jDomCore
   */


  jsonDom.jDomCore = root.jDomCore;
  /**
   * Verify availability of objects
   * @typedef {*|module:core/dom/objects} jDomObjectsDom
   */

  jsonDom.jDomObjectsDom = root.jDomObjectsDom;
  /**
   * Verify availability of jDomCoreDom
   * @typedef {*|module:core/dom/core} jDomCoreDom
   */

  jsonDom.jDomCoreDom = root.jDomCoreDom;
  /**
   * Verify availability of objects
   * @typedef {*|module:matrix/objects} jDomMatrixObjects
   */

  jsonDom.jDomMatrixObjects = root.jDomMatrixObjects;
  /**
   * Verify availability of jDomCoreDom
   * @typedef {*|module:matrix/core} jDomMatrixCore
   */

  jsonDom.jDomMatrixCore = root.jDomMatrixCore;
  /**
   * Create new private reference to the document
   * @typedef {module:core/dom/objects.documentItem} documentItem
   */

  jsonDom.documentItem = jsonDom.jDomObjectsDom.documentDomItem();
}).call(void 0 || window || {}); // Use the external context to assign this, which will be Window if rendered via browser