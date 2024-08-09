'use strict'

/**
 * A reference to all functions to be used globally / exported
 * @typedef (Object) gamePieces
 * @module game/pieces
 */
const gamePieces = {}

/**
 * Default properties for a tile in the battleship game.
 * @returns {module:jDom/core/dom/objects.DomItem}
 */
const gameTile = () => jsonDom.createDomItem({
  hasShip: false,
  isHit: false
})

/**
 * Set the style for tiles representing water.
 * @function waterTile
 * @returns {{hasShip: boolean, isHit: boolean, eventListeners: {click: {listenerFunc: attackListener, listenerArgs: {}, listenerOptions: boolean}}, point: {}}}
 */
gamePieces.waterTile = () => siFunciona.mergeObjects(gameTile(), jsonDom.tile())

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
  attacks: { hit: 0, miss: 0, sunk: 0 },
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

export default gamePieces
