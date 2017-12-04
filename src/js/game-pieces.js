// Game specific objects
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
  },
})

/**
 * Set the style for tiles representing water.
 * @param {Object} [player={}]
 * @param {Array} [players=[]]
 * @returns {{hasShip: boolean, isHit: boolean, eventListeners: {click: {listenerFunc: attackListener, listenerArgs: {}, listenerOptions: boolean}}, point: {}}}
 */
const waterTile = (player = {}, players = []) => mergeObjects(gameTile(player, players), tile())

/**
 * Set status and custom properties for tiles that have a ship
 * @returns {{hasShip: boolean}}
 */
const shipTile = () => ({
  hasShip: true,
})

/**
 * Store properties of a ship which includes an array of all associated ship tiles.
 * @param {string} name
 * @returns {{name: string, status: number, parts: Array}}
 */
const ship = (name = '') => ({
  name: name,
  status: 100,
  parts: [],
})

/**
 * Set the status of the tile to hit.
 * @returns {{isHit: boolean}}
 */
const hitTile = () => ({
  isHit: true,
})

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
      },
    },
    {
      tagName: 'ul',
      attributes: {},
      children: player.shipFleet.map(ship => ({
        tagName: 'li',
        attributes: {
          innerHTML: `<strong>${ship.name} (${ship.parts.length}):</strong> ${Math.round(ship.status * 100) / 100}%`
        },
      }))
    }
  ]
})

/**
 * Create a default fleet using the standard battleship lengths.
 * @type {Array}
 */
const defaultFleet = curry(generateRandomFleet)([
  {name: 'Aircraft Carrier', size: 5},
  {name: 'Battleship', size: 4},
  {name: 'Submarine', size: 3},
  {name: 'Cruiser', size: 3},
  {name: 'Destroyer', size: 2}
])
