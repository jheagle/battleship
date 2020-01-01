'use strict'
// Game specific functions
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this || {}

  /**
   * Store reference to any pre-existing module of the same name
   * @type {gameStart|*}
   */
  const previousGameStart = root.gameStart || {}

  /**
   * A reference to all functions to be used globally / exported
   * @typedef (Object) gameStart
   * @module game/setup
   */
  const gameStart = {}
  root.gameStart = gameStart

  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {gameStart}
   */
  gameStart.noConflict = () => {
    root.gameStart = previousGameStart
    return gameStart
  }

  /**
   * Verify availability of jDomCore
   * @typedef {*|module:jDom/core/core} jDomCore
   */
  let jDomCore = root.jDomCore

  /**
   * If jDomCore remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomCore === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomCore = require('../jDom/core/core.js')
    } else {
      console.error('setup.js requires jDom/core/core')
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
      jDomCoreDom = require('../jDom/core/dom/core.js')
    } else {
      console.error('setup.js requires jDom/core/dom/core')
    }
  }

  /**
   * Verify availability of jDomMatrixCore
   * @typedef {*|module:jDom/matrix/core} jDomMatrixCore
   */
  let jDomMatrixCore = root.jDomMatrixCore

  /**
   * If jDomMatrixCore remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomMatrixCore === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomMatrixCore = require('../jDom/matrix/core.js')
    } else {
      console.error('setup.js requires jDom/matrix/core')
    }
  }

  /**
   * Verify availability of jDomMatrixObjects
   * @typedef {*|module:jDom/matrix/objects} jDomMatrixObjects
   */
  let jDomMatrixObjects = root.jDomMatrixObjects

  /**
   * If jDomMatrixObjects remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomMatrixObjects === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomMatrixObjects = require('../jDom/matrix/objects.js')
    } else {
      console.error('setup.js requires jDom/matrix/objects')
    }
  }

  /**
   * Verify availability of gameLayout
   * @typedef {*|module:game/layout} gameLayout
   */
  let gameLayout = root.gameLayout

  /**
   * If gameLayout remains undefined, attempt to retrieve it as a module
   */
  if (typeof gameLayout === 'undefined') {
    if (typeof require !== 'undefined') {
      gameLayout = require('./layout.js')
    } else {
      console.error('setup.js requires game/layout')
    }
  }

  /**
   * Verify availability of gamePieces
   * @typedef {*|module:game/pieces} gamePieces
   */
  let gamePieces = root.gamePieces

  /**
   * If gamePieces remains undefined, attempt to retrieve it as a module
   */
  if (typeof gamePieces === 'undefined') {
    if (typeof require !== 'undefined') {
      gamePieces = require('./pieces.js')
    } else {
      console.error('setup.js requires game/pieces')
    }
  }

  /**
   * Verify availability of gameUtils
   * @typedef {*|module:game/functions} gameUtils
   */
  let gameUtils = root.gameUtils

  /**
   * If gameUtils remains undefined, attempt to retrieve it as a module
   */
  if (typeof gameUtils === 'undefined') {
    if (typeof require !== 'undefined') {
      gameUtils = require('./functions.js')
    } else {
      console.error('setup.js requires game/functions')
    }
  }

  /**
   * Verify availability of gameActions
   * @typedef {*|module:game/actions} gameActions
   */
  let gameActions = root.gameActions

  /**
   * If gameActions remains undefined, attempt to retrieve it as a module
   */
  if (typeof gameActions === 'undefined') {
    if (typeof require !== 'undefined') {
      gameActions = require('./actions.js')
    } else {
      console.error('setup.js requires game/actions')
    }
  }

  /**
   * Generate a ship with the provided line of points.
   * The visibility of the ship on the board is determined by the view parameter.
   * @param shipInfo
   * @param line
   * @param matrix
   * @param view
   * @returns {{name: string, status: number, parts: Array}}
   */
  const buildShip = (shipInfo, line, matrix, view = false) => jDomCore.mergeObjects(gamePieces.ship(shipInfo.name), {parts: line.map(p => gameActions.setShip(matrix, p, view))})

  /**
   *
   * @param lengths
   * @param shipLength
   */
  const selectShipDirection = (lengths, shipLength) => jDomMatrixCore.randDirection([jDomMatrixObjects.point(1, 0, 0), jDomMatrixObjects.point(0, 1, 0), jDomMatrixObjects.point(0, 0, 1)].filter(p => lengths[jDomMatrixCore.getFirstAxisOfCoordinate(p, 1)] > shipLength))

  /**
   *
   * @param lengths
   * @param shipLength
   * @param dir
   * @returns {{start: {x: number, y: number, z: number}, dir}}
   */
  const randomStartDir = (lengths, shipLength, dir = selectShipDirection(lengths, shipLength)) => ({
    start: jDomMatrixCore.randomStart(shipLength, dir, lengths),
    dir: dir
  })

  /**
   * Get a qualifying start and direction point for a ship of specified length
   * WARNING: This is a recursive function.
   * @param matrix
   * @param shipLength
   * @param lengths
   * @param startDir
   * @returns {Array}
   */
  const generateStartEnd = (matrix, shipLength, lengths, startDir = randomStartDir(lengths, shipLength)) =>
    jDomMatrixCore.getHighestAbsoluteCoordinate(startDir.dir) === 0 ? [jDomMatrixObjects.point(0, 0, 0), jDomMatrixObjects.point(0, 0, 0)] : jDomMatrixCore.checkInBetween(...[startDir.start, jDomMatrixCore.lineEndPoint(startDir.start, shipLength, startDir.dir)], matrix, gameUtils.checkIfShipCell) ? generateStartEnd(matrix, shipLength, lengths) : [startDir.start, jDomMatrixCore.lineEndPoint(startDir.start, shipLength, startDir.dir)]

  /**
   * Create a series of randomly placed ships based on the provided shipLengths.
   * The optional parameter view will set the visibility of the ships.
   * @param {Array} ships
   * @param {Object} matrix
   * @param {boolean} [view=false]
   * @returns {Array}
   */
  const generateRandomFleet = (ships, matrix, view = false) => ships.map(ship => buildShip(ship, jDomMatrixCore.getPointsLine(...generateStartEnd(matrix, ship.size, jDomMatrixCore.getAxisLengths(matrix))), matrix, view))

  /**
   * Create a default fleet using the standard battleship lengths.
   * @param {Object} matrix
   * @param {boolean} [view=false]
   * @returns {Array}
   */
  const defaultFleet = jDomCore.curry(generateRandomFleet)([
    {name: 'Aircraft Carrier', size: 5},
    {name: 'Battleship', size: 4},
    {name: 'Submarine', size: 3},
    {name: 'Cruiser', size: 3},
    {name: 'Destroyer', size: 2}
  ])

  /**
   * Create players and associated properties.
   * Takes an integer for the number of players to generate.
   * Returns an array of players.
   * WARNING: This is a recursive function.
   * @param humans
   * @param robots
   * @param players
   * @returns {Array}
   */
  const buildPlayers = (humans, robots = 0, players = []) => {
    if (humans < 1 && robots < 1) {
      return players
    }
    let player = gamePieces.playerSet({}, `Player ${players.length + 1}`)
    player.isRobot = humans <= 0
    player.board = jDomMatrixCore.bindPointData(jDomMatrixObjects.square({
      x: [
        gamePieces.waterTile(player, players)
      ],
      matrixProps: [
        {
          eventListeners: {
            click: {listenerFunc: 'attackListener', listenerArgs: {}, listenerOptions: false}
          }
        }
      ]
    }, 10))
    player.shipFleet = defaultFleet(player.board, false) // generate fleet of ships
    player.playerStats = gamePieces.playerStats(player, `${Math.round(player.status * 100) / 100}%`)
    player.children = [player.board, player.playerStats]
    players.push(player)
    return buildPlayers(--humans, humans < 0 ? --robots : robots, players)
  }

  /**
   * Logic for setting up and starting a new round
   * (selects random start player and calls computer attack if it is AI starting)
   * @function beginRound
   * @param e
   * @param mainForm
   * @returns {boolean}
   */
  gameStart.beginRound = (e, mainForm) => {
    if (e.eventPhase !== 2){
      return false
    }
    console.log('beginRound', e.eventPhase, e.type)
    e.preventDefault()
    let parent = jDomCoreDom.getTopParentItem(mainForm)
    let humans = parseInt(jDomCoreDom.getChildrenByName('human-players', mainForm)[0].element.value)
    let robots = parseInt(jDomCoreDom.getChildrenByName('robot-players', mainForm)[0].element.value)
    if (humans < 0 || humans > 100 || robots < 0 || robots > 100) {
      return false
    }
    let firstGoesFirst = jDomCoreDom.getChildrenByName('first-go-first', mainForm)[0].element.checked
    humans = humans < 0 ? 0 : humans
    if (humans === 0) {
      robots = robots < 2 ? 2 : robots
    }
    if (humans === 1) {
      robots = robots < 1 ? 1 : robots
    }
    jDomCoreDom.removeChild(jDomCoreDom.getChildrenByClass('main-menu', parent.body)[0], parent.body)
    let players = jDomCoreDom.renderHTML(gameLayout.boards(buildPlayers(humans, robots)), parent).children
    let firstAttacker = gameActions.updatePlayer(firstGoesFirst ? players[0] : players[jDomCore.randomInteger(players.length)])
    if (firstAttacker.isRobot) {
      gameActions.computerAttack(firstAttacker, players)
    }
    return false
  }

  /**
   * The entry function
   * @function main
   * @param parent
   * @returns {module:jDom/core/dom/objects.documentItem}
   */
  gameStart.main = (parent) => {
    for (let i = parent.body.children.length - 1; i >= 0; --i) {
      jDomCoreDom.removeChild(parent.body.children[i], parent.body)
    }
    jDomCoreDom.renderHTML(gameLayout.mainMenu(), parent)
    return parent
  }

  /**
   * @function restart
   * @param e
   * @param button
   */
  gameStart.restart = (e, button) => gameStart.main(jDomCoreDom.getTopParentItem(button))

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = gameStart
    }
    exports = Object.assign(exports, gameStart)
  }
}).call(this || window || base || {}) // Use the external context to assign this, which will be Window if rendered via browser
