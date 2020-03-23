'use strict'
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  const root = this || {}

  /**
   * Store reference to any pre-existing module of the same name
   * @type {gameMain|*}
   */
  const previousGameMain = root.gameMain || {}

  /**
   * A reference to all functions to be used globally / exported
   * @typedef (Object) gameMain
   * @module game/main
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
   * Verify availability of jDomObjectsDom
   * @typedef {*|module:jDom/core/dom/objects} jDomObjectsDom
   */
  let jDomObjectsDom = root.jDomObjectsDom

  /**
   * If jDomObjectsDom remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomObjectsDom === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomObjectsDom = require('../vendor/json-dom').domObjects
    } else {
      console.error('main.js requires jDom/core/dom/objects')
    }
  }

  /**
   * Verify availability of jDomCoreDom
   * @typedef {*|module:jDom/core/dom/core} jDomCoreDom
   */
  let jDomCoreDom = root.jDomCoreDom

  /**
   * If jDomCoreDom remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomCoreDom === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomCoreDom = require('../vendor/json-dom').domCore
    } else {
      console.error('main.js requires jDom/core/dom/core')
    }
  }

  /**
   * Verify availability of gameActions
   * @typedef {*|module:game/actions} gameActions
   */
  let gameActions = root.gameActions

  /**
   * If gameUtils remains undefined, attempt to retrieve it as a module
   */
  if (typeof gameActions === 'undefined') {
    if (typeof require !== 'undefined') {
      gameActions = require('./actions.js')
    } else {
      console.error('main.js requires game/actions')
    }
  }

  /**
   * Verify availability of gameStart
   * @typedef {*|module:game/setup} gameStart
   */
  let gameStart = root.gameStart

  /**
   * If jDomCoreDom remains undefined, attempt to retrieve it as a module
   */
  if (typeof gameStart === 'undefined') {
    if (typeof require !== 'undefined') {
      gameStart = require('./setup.js')
    } else {
      console.error('main.js requires game/setup')
    }
  }

  /**
   * Create new private reference to the document
   * @typedef {module:jDom/core/dom/objects.documentItem} documentItem
   */
  const documentItem = gameStart.main(jDomObjectsDom.documentDomItem({
    beginRound: gameStart.beginRound,
    attackListener: gameActions.attackListener,
    restart: gameStart.restart
  }))
  console.log('Document Item: ', documentItem)

  // eslint-disable-next-line no-undef
  if (typeof document === 'undefined' || !(document instanceof HTMLDocument)) {
    // Trigger game to start if running as node module
    const form = jDomCoreDom.getChildrenByClass('main-menu-form', documentItem.body)[0]
    const submitBtn = jDomCoreDom.getChildrenFromAttribute('type', 'submit', form)
    submitBtn[0].element.click()
  }

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = gameMain
    }
    exports = Object.assign(exports, gameMain)
  }
}).call(this || window || {}) // Use the external context to assign this, which will be Window if rendered via browser
