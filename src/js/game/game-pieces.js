'use strict'
// Game specific objects
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this || {}

  /**
   * Store reference to any pre-existing module of the same name
   * @type {gamePieces|*}
   */
  const previousGamePieces = root.gamePieces || {}

  /**
   * A reference to all functions to be used globally / exported
   * @module gamePieces
   */
  const gamePieces = {}
  root.gamePieces = gamePieces

  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {gamePieces}
   */
  gamePieces.noConflict = () => {
    root.gamePieces = previousGamePieces
    return gamePieces
  }

  /**
   * Verify availability of jDomCore
   * @type {*|jDomCore}
   */
  let jDomCore = root.jDomCore

  /**
   * If gameUtils remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomCore === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomCore = require('../jDom/core/core.js')
    } else {
      console.error('game-pieces.js requires jDomCore')
    }
  }

  /**
   * Verify availability of jDomObjectsMatrix
   * @type {*|jDomObjectsMatrix}
   */
  let jDomObjectsMatrix = root.jDomObjectsMatrix

  /**
   * If jDomObjectsMatrix remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomObjectsMatrix === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomObjectsMatrix = require('../jDom/matrix/objects.js')
    } else {
      console.error('game-pieces.js requires jDomObjectsMatrix')
    }
  }

  /**
   * Default properties for a tile in the battleship game.
   * @param {Object} [player={}]
   * @param {Array} [players=[]]
   * @returns {{hasShip: boolean, isHit: boolean, eventListeners: {click: {listenerFunc: attackListener, listenerArgs: {}, listenerOptions: boolean}}}}
   */
  const gameTile = (player = {}, players = []) => ({
    hasShip: false,
    isHit: false,
    eventListeners: {
      click: {listenerFunc: 'attackListener', listenerArgs: {}, listenerOptions: false}
    }
  })

  /**
   * Set the style for tiles representing water.
   * @function waterTile
   * @param {Object} [player={}]
   * @param {Array} [players=[]]
   * @returns {{hasShip: boolean, isHit: boolean, eventListeners: {click: {listenerFunc: attackListener, listenerArgs: {}, listenerOptions: boolean}}, point: {}}}
   */
  gamePieces.waterTile = (player = {}, players = []) => jDomCore.mergeObjects(gameTile(player, players), jDomObjectsMatrix.tile())

  /**
   * Set status and custom properties for tiles that have a ship
   * @function shipTile
   * @returns {{hasShip: boolean}}
   */
  gamePieces.shipTile = () => ({
    hasShip: true
  })

  /**
   * Store properties of a ship which includes an array of all associated ship tiles.
   * @function ship
   * @param {string} name
   * @returns {{name: string, status: number, parts: Array}}
   */
  gamePieces.ship = (name = '') => ({
    name: name,
    status: 100,
    parts: []
  })

  /**
   * Set the status of the tile to hit.
   * @function hitTile
   * @returns {{isHit: boolean}}
   */
  gamePieces.hitTile = () => ({
    isHit: true
  })

  /**
   * Store the player attributes.
   * @function playerSet
   * @param {Object} board
   * @param {string} name
   * @returns {Object}
   */
  gamePieces.playerSet = (board = {}, name = '') => ({
    name: name,
    isRobot: false,
    status: 100,
    turnCnt: 0,
    attacker: false,
    attacks: {hit: 0, miss: 0, sunk: 0},
    board: board,
    shipFleet: [],
    playerStats: {},
    tagName: 'div',
    attributes: {
      className: 'player'
    },
    children: [
      board
    ]
  })

  /**
   * The defined attributes for each player
   * @function playerStats
   * @param {Object} [player={}]
   * @param {Object} [status=]
   * @returns {Object}
   */
  gamePieces.playerStats = (player = {}, status = '') => ({
    tagName: 'div',
    attributes: {},
    children: [
      {
        tagName: 'span',
        attributes: {
          innerHTML: `<strong>${player.name}</strong>: ${status}`
        }
      },
      {
        tagName: 'ul',
        attributes: {},
        children: player.shipFleet.map(ship => ({
          tagName: 'li',
          attributes: {
            innerHTML: `<strong>${ship.name} (${ship.parts.length}):</strong> ${Math.round(ship.status * 100) / 100}%`
          }
        }))
      }
    ]
  })

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = gamePieces
    }
    exports = Object.assign(exports, gamePieces)
  }
}).call(this || window || base || {}) // Use the external context to assign this, which will be Window if rendered via browser