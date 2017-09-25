// Core system functions
/**
 * Return a curried version of the passed function.
 * The returned function expects the same number of arguments minus the ones provided.
 * fn is the name of the function being curried.
 * @param fn
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
 * @param obj
 * @param fn
 * @param initObj
 * @returns {Array|*|{annotation}}
 */
const mapObject = (obj, fn, initObj = {}) => Array.isArray(obj) ? obj.map((prop, i) => fn.length === 1 ? fn(prop) : fn(prop, i)) : Object.keys(obj).reduce((newObj, curr) => {
        newObj[curr] = fn.length === 1 ? fn(obj[curr]) : fn(obj[curr], curr)
        return newObj
    }, initObj)

/**
 *
 * @param obj
 * @param fn
 * @param initObj
 * @returns {Array.<T>|*}
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
 *
 * @param obj
 * @param fn
 * @param initObj
 * @returns {Array.<T>|*}
 */
const reduceObject = (obj, fn, initObj = {}) => Array.isArray(obj) ? obj.reduce(fn, initObj) : Object.keys(obj).reduce((newObj, curr) => fn(newObj, obj[curr]), initObj)

/**
 * Helper function for testing if the item is an Object or Array that contains properties or elements
 * @param item
 * @returns {boolean}
 */
const notEmptyObjectOrArray = item => !!((typeof item === 'object' && Object.keys(item).length) || (Array.isArray(item) && item.length))

/**
 * Clone objects for manipulation without data corruption
 * @param object
 * @param parents
 * @returns {*}
 */
const cloneObject = (object, parents = []) => cloneExclusions(JSON.parse(JSON.stringify(object, (key, val) => removeCircularReference(key, val, parents))), object, parents = [])

/**
 * A simple function to check if an item is in an array
 * @param arr
 * @param prop
 * @returns {boolean}
 */
const inArray = (arr, prop) => arr.indexOf(prop) >= 0

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
 * A function to use with mapObject or just map which will either return the result
 * of re-running a function or return the original item.
 * Pass in the object to be used with map.
 * Pass in the conditions as a test function.
 * Pass in the recursive function.
 * Add any other args to that function.
 * @param obj
 * @param test
 * @param fn
 * @param args
 * @returns {function(*=, *)}
 */
const recursiveMap = (obj, test, fn, ...args) => (prop, key) => test(prop, key) ? prop : fn(obj[key], prop, ...args)

/**
 * Tests exceptions to what must be returned as reference vs cloned.
 * @param obj
 * @param extraTest
 * @returns {function(*=, *=)}
 */
const cloneRules = (obj, extraTest = false) => (prop, key) => !obj[key] || prop instanceof HTMLElement || key === 'parentItem' || key === 'listenerArgs' || (extraTest ? extraTest(prop, key) : false)

/**
 * A helper for cloneExclusions to simplify that function
 * @param cloned
 * @param object
 * @param parents
 * @param fn
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
 * Perform a deep merge of objects. This will combine all objects and sub-objects,
 * objects having the same attributes will overwrite starting from the end of the argument
 * list and bubbling up to return a merged version of the first object.
 * WARNING: This is a recursive function.
 * @param args
 * @returns {*}
 */
const mergeObjects = (...args) => (args.length === 2) ?
    (notEmptyObjectOrArray(args[1])) ?
        mapObject(args[1], recursiveMap(args[0], cloneRules(args[0]), mergeObjects), cloneObject(args[0])) :
        args[1] :
    args.length === 1 ?
        cloneObject(args[0]) :
        args.reduce((obj1, obj2) => mergeObjects(obj1, obj2), {})

/**
 * Perform a deep merge of objects. This will combine all objects and sub-objects,
 * objects having the same attributes will overwrite starting from the end of the argument
 * list and bubbling up to return the overwritten first object.
 * WARNING: This is a recursive function.
 * WARNING: This will mutate the first object passed in as input
 * @param args
 * @returns {*}
 */
const mergeObjectsMutable = (...args) => (args.length === 2) ?
    (notEmptyObjectOrArray(args[1])) ?
        mapObject(args[1], recursiveMap(args[0], cloneRules(args[0]), mergeObjectsMutable), args[0]) :
        args[1] :
    args.length === 1 ?
        args[0] :
        args.reduce((obj1, obj2) => mergeObjectsMutable(obj1, obj2), {})


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
