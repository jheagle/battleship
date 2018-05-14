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
   * A reference to all functions to be used globally / exported
   * @module gameMain
   */
  const gameMain = {}
  root.gameMain = gameMain

  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {gameMain}
   */
  gameMain.noConflict = () => {
    root.gameMain = previousGameMain
    return gameMain
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
      jDomObjects = require('./jDom/core/domItems/objects.js')
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
      jDomCoreDom = require('./jDom/core/domItems/core.js')
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
      gameActions = require('./game/actions.js')
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
      gameStart = require('./game/start-functions.js')
    } else {
      console.error('main.js requires gameStart')
    }
  }

  /**
   * Create new private reference to the document
   * @member documentItem
   */
  const documentItem = gameStart.main(jDomObjects.documentDOMItem({
    beginRound: gameStart.beginRound,
    attackListener: gameActions.attackListener,
    restart: gameStart.restart
  }))
  console.log(documentItem)

  if (typeof document === 'undefined' || typeof document === 'PseudoHTMLDocument') {
    // Trigger game to start if running as node module
    const form = jDomCoreDom.getChildrenByClass('main-menu-form', documentItem.body)
    const submitBtn = jDomCoreDom.getChildrenFromAttribute('type', 'submit', form[0])
    submitBtn[0].element.click()
  }

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
      exports = module.exports = gameMain
    }
    exports = Object.assign(exports, gameMain)
  }
}).call(this || window || base || {}) // Use the external context to assign this, which will be Window if rendered via browser
