'use strict'
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this

  /**
   * Store reference to any pre-existing module of the same name
   * @type {gameMain|*}
   */
  const previousGameMain = root.gameMain

  /**
   * All methods exported from this module are encapsulated within gameMain.
   * @typedef {Object} gameMain
   * @property {gameMain} gameMain
   * @property {function} noConflict
   */

  /**
   * A reference to all functions to be used globally / exported
   * @type {gameMain}
   */
  const exportFunctions = {
    noConflict: () => {
      root.gameMain = previousGameMain
      return exportFunctions
    }
  }

  /**
   * Verify availability of jDomObjects
   * @type {*|jDomObjects}
   */
  let jDomObjects = root.jDomObjects

  /**
   * If jDomObjects remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomObjects === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomObjects = require('./objects-dom.js')
    } else {
      console.error('main.js requires jDomObjects')
    }
  }

  /**
   * Verify availability of gameUtils
   * @type {*|gameUtils}
   */
  let gameUtils = root.gameUtils

  /**
   * If gameUtils remains undefined, attempt to retrieve it as a module
   */
  if (typeof gameUtils === 'undefined') {
    if (typeof require !== 'undefined') {
      gameUtils = require('./functions.js')
    } else {
      console.error('main.js requires gameUtils')
    }
  }

  /**
   * Verify availability of gameActions
   * @type {*|gameActions}
   */
  let gameActions = root.gameActions

  /**
   * If gameUtils remains undefined, attempt to retrieve it as a module
   */
  if (typeof gameActions === 'undefined') {
    if (typeof require !== 'undefined') {
      gameActions = require('./actions.js')
    } else {
      console.error('main.js requires gameActions')
    }
  }

  /**
   * Create new private reference to the document
   */
  const documentItem = gameUtils.main(jDomObjects.documentDOMItem([gameUtils.beginRound, gameActions.attackListener, gameUtils.restart]))
  // console.log(documentItem)

  /**
   * Verify availability of jDomCoreDom
   * @type {*|jDomCoreDom}
   */
  let jDomCoreDom = root.jDomCoreDom

  /**
   * If jDomCoreDom remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomCoreDom === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomCoreDom = require('./core-dom.js')
    } else {
      console.error('game-ai.js requires jDomCoreDom')
    }
  }
  // const div = jDomCoreDom.getChildrenByClass('main-menu', documentItem.body)
  // console.log(div[0].element)
  const form = jDomCoreDom.getChildrenByClass('main-menu-form', documentItem.body)
  // console.log(form[0].element)
  // form[0].element.submit()
  const submitBtn = jDomCoreDom.getChildrenFromAttribute('type', 'submit', form[0])
  // console.log(submitBtn[0].element)
  // submitBtn[0].element.click()

  // samples expanded from https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge#new-answer
  // let results = mergeObjects({
  //     a: { a: 1},
  // },{
  //     a: { b: 1},
  // },{
  //     a: { b: 2, c: 1},
  //     b: 2,
  // })
  // console.log(results)

  /**
   * For each exported function, store a reference to similarly named functions from the global scope
   * @type {Object}
   */
  const previousExports = Object.keys(exportFunctions).reduce((start, next) => {
    start[next] = root[next]
    return start
  }, {})

  /**
   * Ensure each exported function has an a noConflict associated
   */
  Object.keys(exportFunctions).map((key) => {
    exportFunctions[key].noConflict = () => {
      root[key] = previousExports[key]
      return exportFunctions[key]
    }
    return key
  })

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = exportFunctions
    }
    exports = Object.assign(exports, exportFunctions)
  } else {
    exportFunctions.gameAI = exportFunctions
    root = Object.assign(root, exportFunctions)
  }
}).call(this) // Use the external context to assign this, which will be Window if rendered via browser
