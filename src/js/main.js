'use strict'
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this || {}

  /**
   * Store reference to any pre-existing module of the same name
   * @type {gameMain|*}
   */
  const previousGameMain = root.gameMain || {}

  /**
   * All methods exported from this module are encapsulated within gameMain.
   * @typedef {Object} gameMain
   *  - noConflict
   */

  /**
   * A reference to all functions to be used globally / exported
   * @type {gameMain}
   */
  const exportFunctions = {
    /**
     * Return a reference to this library while preserving the original same-named library
     * @function noConflict
     * @returns {gameMain}
     */
    noConflict: () => {
      root.gameMain = previousGameMain
      return exportFunctions
    }
  }
  root.gameMain = exportFunctions

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
      console.error('main.js requires jDomCoreDom')
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
   * Verify availability of gameStart
   * @type {*|gameStart}
   */
  let gameStart = root.gameStart

  /**
   * If jDomCoreDom remains undefined, attempt to retrieve it as a module
   */
  if (typeof gameStart === 'undefined') {
    if (typeof require !== 'undefined') {
      gameStart = require('./start-functions.js')
    } else {
      console.error('main.js requires gameStart')
    }
  }

  /**
   * Create new private reference to the document
   */
  const documentItem = gameStart.main(jDomObjects.documentDOMItem({
    beginRound: gameStart.beginRound,
    attackListener: gameActions.attackListener,
    restart: gameStart.restart
  }))
  console.log(documentItem)

  // const div = jDomCoreDom.getChildrenByClass('main-menu', documentItem.body)
  // console.log(div[0].element)
  // const form = jDomCoreDom.getChildrenByClass('main-menu-form', documentItem.body)
  // console.log(form[0].element)
  // form[0].element.submit()
  // const submitBtn = jDomCoreDom.getChildrenFromAttribute('type', 'submit', form[0])
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
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = exportFunctions
    }
    exports = Object.assign(exports, exportFunctions)
  }
}).call(this || window || base || {}) // Use the external context to assign this, which will be Window if rendered via browser
