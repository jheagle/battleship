// Core system functions
/**
 * Return a curried version of the passed function.
 * The returned function expects the same number of arguments minus the ones provided.
 * fn is the name of the function being curried.
 * @param {function} fn
 * @returns {function(...[*]): function(...[*])}
 */
const curry = (fn) => {
    let curried = (...args) => args.length >= fn.length ?
        fn(...args) :
        (...a) => curried(...[...args, ...a])
    return curried
}

/**
 * This function is intended to replicate behaviour of the Array.map() function but for Objects.
 * If an array is passed in instead then it will perform standard map(). It is recommended to
 * always use the standard map() function when it is known that the object is actually an array.
 * @param {Object|Array} obj
 * @param {function} fn
 * @param {Object|Array} initObj
 * @returns {Object|Array}
 */
const mapObject = (obj, fn, initObj = {}) => Array.isArray(obj) ? obj.map((prop, i) => fn.length === 1 ? fn(prop) : fn(prop, i)) : Object.keys(obj).reduce((newObj, curr) => {
    newObj[curr] = fn.length === 1 ? fn(obj[curr]) : fn(obj[curr], curr)
    return newObj
}, initObj)

/**
 * This function is intended to replicate behaviour of the Array.filter() function but for Objects.
 * If an array is passed in instead then it will perform standard filter(). It is recommended to
 * always use the standard filter() function when it is known that the object is actually an array.
 * @param {Object|Array} obj
 * @param {function} fn
 * @param {Object|Array} initObj
 * @returns {Object|Array}
 */
const filterObject = (obj, fn, initObj = {}) => Array.isArray(obj) ? obj.filter((prop, i) => fn.length === 1 ? fn(prop) : fn(prop, i)) : Object.keys(obj).reduce((newObj, curr) => {
    if ((fn.length === 1 ? fn(obj[curr]) : fn(obj[curr], curr))) {
        newObj[curr] = obj[curr]
    } else {
        delete newObj[curr]
    }
    return newObj
}, initObj)

/**
 * This function is intended to replicate behaviour of the Array.reduce() function but for Objects.
 * If an array is passed in instead then it will perform standard reduce(). It is recommended to
 * always use the standard reduce() function when it is known that the object is actually an array.
 * @param {Object|Array} obj
 * @param {function} fn
 * @param {Object|Array} initObj
 * @returns {Object|Array}
 */
const reduceObject = (obj, fn, initObj = {}) => Array.isArray(obj) ? obj.reduce(fn, initObj) : Object.keys(obj).reduce((newObj, curr) => fn(newObj, obj[curr]), initObj)

/**
 * Helper function for testing if the item is an Object or Array that contains properties or elements
 * @param {Object|Array} item
 * @returns {boolean}
 */
const notEmptyObjectOrArray = item => !!((typeof item === 'object' && Object.keys(item).length) || (Array.isArray(item) && item.length))

/**
 * A function to use with mapObject or just map which will either return the result
 * of re-running a function or return the original item.
 * Pass in the object to be used with map.
 * Pass in the conditions as a test function.
 * Pass in the recursive function.
 * Add any other args to that function.
 * @param {Object} obj
 * @param {function} test
 * @param {function} fn
 * @param {...*} [args]
 * @returns {*|function(*=, *)}
 */
const recursiveMap = (obj, test, fn, ...args) => (prop, key) => test(prop, key) ? prop : fn(obj[key], prop, ...args)

/**
 * Tests exceptions to what must be returned as reference vs cloned.
 * @param {Object} obj
 * @param {boolean} [extraTest=false]
 * @returns {boolean}
 */
const cloneRules = (obj, extraTest = false) => (prop, key) => !obj[key] || prop instanceof HTMLElement || key === 'parentItem' || key === 'listenerArgs' || (extraTest ? extraTest(prop, key) : false)

/**
 * A helper for cloneExclusions to simplify that function
 * @param {Object} cloned
 * @param {Object} object
 * @param {Array} parents
 * @param {function} fn
 * @returns {Array|*|{annotation}}
 */
const cloneExMap = (cloned, object, parents, fn) => mapObject(object, recursiveMap(cloned, cloneRules(cloned, curry(inArray)(parents.concat([object]))), fn, parents.concat([object])))

/**
 * Re-add the Object Properties which cannot be cloned and must be directly copied to the new cloned object
 * WARNING: This is a recursive function.
 * @param cloned
 * @param object
 * @param parents
 * @returns {*}
 */
const cloneExclusions = (cloned, object, parents = []) => notEmptyObjectOrArray(object) ?
    cloneExMap(cloned, object, parents, cloneExclusions) :
    cloned

/**
 * Exclude cloning the same references multiple times. This ia utility function to be called with JSON.stringify
 * @param key
 * @param val
 * @param parents
 * @returns {*}
 */
const removeCircularReference = (key, val, parents = []) => {
    if (typeof val === 'object') {
        if (inArray(parents, val))
            return undefined
        parents.push(val)
    }
    return val
}

/**
 * Clone objects for manipulation without data corruption, returns a copy of the provided object.
 * @param {Object} object
 * @param {Array} [parents=[]]
 * @returns {Object}
 */
const cloneObject = (object, parents = []) => cloneExclusions(JSON.parse(JSON.stringify(object, (key, val) => removeCircularReference(key, val, parents))), object, parents = [])

/**
 * Merge two objects and provide clone or original based on isMutable parameter.
 * @param {boolean} isMutable
 * @param {Object} obj1
 * @param {Object} obj2
 * @returns {*}
 */
const mergeObjectsBase = (isMutable, obj1, obj2) => (notEmptyObjectOrArray(obj2)) ? mapObject(obj2, recursiveMap(obj1, cloneRules(obj1), isMutable ? mergeObjectsMutable : mergeObjects), isMutable ? obj1 : cloneObject(obj1)) : obj2

/**
 * Perform a deep merge of objects. This will combine all objects and sub-objects,
 * objects having the same attributes will overwrite starting from the end of the argument
 * list and bubbling up to return a merged version of the first object.
 * WARNING: This is a recursive function.
 * @param {...Object} args
 * @returns {Object}
 */
const mergeObjects = (...args) => args.length === 2 ?
    mergeObjectsBase(false, args[0], args[1]) :
    args.length === 1 ?
        cloneObject(args[0]) :
        args.reduce(curry(mergeObjectsBase)(false), {})

/**
 * Perform a deep merge of objects. This will combine all objects and sub-objects,
 * objects having the same attributes will overwrite starting from the end of the argument
 * list and bubbling up to return the overwritten first object.
 * WARNING: This is a recursive function.
 * WARNING: This will mutate the first object passed in as input
 * @param {...Object} args
 * @returns {Object}
 */
const mergeObjectsMutable = (...args) => args.length === 2 ?
    mergeObjectsBase(true, args[0], args[1]) :
    args.length === 1 ?
        args[0] :
        args.reduce(curry(mergeObjectsBase)(true), {})

/**
 * Generate an array of specified item extending to specified length
 * WARNING: This is a recursive function.
 * @param item
 * @param length
 * @param useReference
 * @param arr
 * @returns {Array.<*>}
 */
const buildArray = (item, length, useReference = false, arr = []) => --length > 0 ?
    buildArray((useReference ?
        item :
        cloneObject(item)), length, useReference, arr.concat([item])) :
    arr.concat([item])

/**
 * A simple function to check if an item is in an array
 * @param {Array} arr
 * @param {*} prop
 * @returns {boolean}
 */
const inArray = (arr, prop) => arr.indexOf(prop) >= 0

/**
 * A simple function usable with reduce to get the max or min value
 * @param {boolean} getMax
 * @param {number} num1
 * @param {number} num2
 * @returns {number}
 */
const getMaxOrMin = (getMax, num1, num2) => ((getMax && num2 > num1) || (!getMax && num2 < num1)) ? num2 : num1

/**
 * Helper for returning max value
 * @function getMax
 * @param {number} num1
 * @param {number} num2
 * @returns {number}
 */
const getMax = curry(getMaxOrMin)(true)

/**
 * Helper for returning min value
 * @function getMin
 * @param {number} num1
 * @param {number} num2
 * @returns {number}
 */
const getMin = curry(getMaxOrMin)(false)

/**
 * Create a single random number within provided range. And with optional offset,
 * The distance between the result numbers can be adjusted with interval.
 * @param {number} range
 * @param {number} [offset=0]
 * @param {number} [interval=1]
 * @returns {number}
 */
const randomNumber = (range, offset = 0, interval = 1) => (Math.random() * range + offset) * interval

/**
 * Create a single random integer within provide range. And with optional offset,
 * The distance between the result numbers can be adjusted with interval.
 * @param {number} range
 * @param {number} [offset=0]
 * @param {number} [interval=1]
 * @returns {number}
 */
const randomInteger = (range, offset = 0, interval = 1) => (Math.floor(Math.random() * range) + offset) * interval

/**
 * Run Timeout functions one after the other in queue
 * WARNING: This is a recursive function.
 * @param fn
 * @param time
 * @param args
 * @returns {*}
 */
const queueTimeout = (fn = {}, time = 0, ...args) => {
    queueTimeout.queue = queueTimeout.queue || []
    queueTimeout.isRunning = queueTimeout.isRunning || false
    let queueItem = {id: 0, func: fn, timeout: time, args: args, result: 0}
    if (fn)
        queueTimeout.queue.push(queueItem)

    if (queueTimeout.queue.length && !queueTimeout.isRunning) {
        queueTimeout.isRunning = true
        let toRun = queueTimeout.queue.shift()
        toRun.id = setTimeout(() => {
            toRun.result = toRun.func(...toRun.args)
            queueTimeout.isRunning = false
            return queueTimeout(false)
        }, toRun.timeout)
        return toRun
    }
    return queueItem
}
