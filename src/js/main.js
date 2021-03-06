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
   * @module main
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
   * Verify availability of jsonDom
   * @typedef {*|module:json-dom} jsonDom
   */
  let jsonDom = root.jsonDom

  /**
   * If jsonDom remains undefined, attempt to retrieve it as a module
   */
  if (typeof jsonDom === 'undefined') {
    if (typeof require !== 'undefined') {
      jsonDom = require('json-dom')
    } else {
      console.error('main.js requires json-dom')
    }
  }

  /**
   * Verify availability of gameActions
   * @typedef {*|module:actions} gameActions
   */
  let gameActions = root.gameActions

  /**
   * If gameUtils remains undefined, attempt to retrieve it as a module
   */
  if (typeof gameActions === 'undefined') {
    if (typeof require !== 'undefined') {
      gameActions = require('./actions.js')
    } else {
      console.error('main.js requires actions')
    }
  }

  /**
   * Verify availability of gameStart
   * @typedef {*|module:setup} gameStart
   */
  let gameStart = root.gameStart

  /**
   * If jsonDom.jDomCore remains undefined, attempt to retrieve it as a module
   */
  if (typeof gameStart === 'undefined') {
    if (typeof require !== 'undefined') {
      gameStart = require('./setup.js')
    } else {
      console.error('main.js requires setup')
    }
  }

  /**
   * Create new private reference to the document
   * @typedef {module:json-dom.documentItem} documentItem
   */
  const documentItem = gameStart.main(jsonDom.documentDomItem({
    beginRound: gameStart.beginRound,
    attackListener: gameActions.attackListener,
    restart: gameStart.restart
  }))
  console.log('Document Item: ', documentItem)

  // eslint-disable-next-line no-undef
  if (typeof document === 'undefined' || !(document instanceof HTMLDocument)) {
    // Trigger game to start if running as node module
    const form = jsonDom.getChildrenByClass('main-menu-form', documentItem.body)[0]
    const submitBtn = jsonDom.getChildrenFromAttribute('type', 'submit', form)
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
