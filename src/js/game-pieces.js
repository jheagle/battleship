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
   * All methods exported from this module are encapsulated within gamePieces.
   * @typedef {Object} gamePieces
   * @property {gamePieces} gamePieces
   * @property {function} hitTile
   * @property {function} noConflict
   * @property {function} playerSet
   * @property {function} playerStats
   * @property {function} ship
   * @property {function} shipTile
   * @property {function} waterTile
   */

  /**
   * A reference to all functions to be used globally / exported
   * @type {gamePieces}
   */
  const exportFunctions = {
    noConflict: () => {
      root.gamePieces = previousGamePieces
      return exportFunctions
    }
  }
  root.gamePieces = exportFunctions

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
      jDomCore = require('./core.js')
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
      jDomObjectsMatrix = require('./objects-matrix.js')
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
   * @param {Object} [player={}]
   * @param {Array} [players=[]]
   * @returns {{hasShip: boolean, isHit: boolean, eventListeners: {click: {listenerFunc: attackListener, listenerArgs: {}, listenerOptions: boolean}}, point: {}}}
   */
  const waterTile = (player = {}, players = []) => jDomCore.mergeObjects(gameTile(player, players), jDomObjectsMatrix.tile())
  exportFunctions.waterTile = waterTile

  /**
   * Set status and custom properties for tiles that have a ship
   * @returns {{hasShip: boolean}}
   */
  const shipTile = () => ({
    hasShip: true
  })
  exportFunctions.shipTile = shipTile

  /**
   * Store properties of a ship which includes an array of all associated ship tiles.
   * @param {string} name
   * @returns {{name: string, status: number, parts: Array}}
   */
  const ship = (name = '') => ({
    name: name,
    status: 100,
    parts: []
  })
  exportFunctions.ship = ship

  /**
   * Set the status of the tile to hit.
   * @returns {{isHit: boolean}}
   */
  const hitTile = () => ({
    isHit: true
  })
  exportFunctions.hitTile = hitTile

  /**
   * Store the player attributes.
   * @param {Object} board
   * @param {string} name
   * @returns {{name: string, isRobot: boolean, status: number, turnCnt: number, attacker: boolean, attacks: {hit: number, miss: number, sunk: number}, board: {}, shipFleet: Array, playerStats: {}, tagName: string, attributes: {className: string}, children: [Object]}}
   */
  const playerSet = (board = {}, name = '') => ({
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
  exportFunctions.playerSet = playerSet

  /**
   * The defined attributes for each player
   * @param {Object} [player={}]
   * @param {Object} [status=]
   * @returns {{tagName: string, attributes: {}, children: [{tagName: string, attributes: {innerHTML: string}},{tagName: string, attributes: {}, children: Array}]}}
   */
  const playerStats = (player = {}, status = '') => ({
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
  exportFunctions.playerStats = playerStats

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