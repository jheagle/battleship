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
   * All methods exported from this module are encapsulated within gameStart.
   * @typedef {Object} gameStart
   *  - beginRound
   *  - main
   *  - noConflict
   *  - restart
   */

  /**
   * A reference to all functions to be used globally / exported
   * @type {gameUtils}
   */
  const exportFunctions = {
    /**
     * Return a reference to this library while preserving the original same-named library
     * @function noConflict
     * @returns {gameUtils}
     */
    noConflict: () => {
      root.gameStart = previousGameStart
      return exportFunctions
    }
  }
  root.gameStart = exportFunctions

  /**
   * Verify availability of jDomCore
   * @type {*|jDomCore}
   */
  let jDomCore = root.jDomCore

  /**
   * If jDomCore remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomCore === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomCore = require('./core.js')
    } else {
      console.error('start-functions.js requires jDomCore')
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
      console.error('start-functions.js requires jDomObjects')
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
      console.error('start-functions.js requires jDomCoreDom')
    }
  }

  /**
   * Verify availability of jDomCoreMatrix
   * @type {*|jDomCoreMatrix}
   */
  let jDomCoreMatrix = root.jDomCoreMatrix

  /**
   * If jDomCoreMatrix remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomCoreMatrix === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomCoreMatrix = require('./core-matrix.js')
    } else {
      console.error('start-functions.js requires jDomCoreMatrix')
    }
  }

  /**
   * Verify availability of jDomObjectsMatrix
   * @type {*|jDomCoreMatrix}
   */
  let jDomObjectsMatrix = root.jDomObjectsMatrix

  /**
   * If jDomObjectsMatrix remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomObjectsMatrix === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomObjectsMatrix = require('./objects-matrix.js')
    } else {
      console.error('start-functions.js requires jDomObjectsMatrix')
    }
  }

  /**
   * Verify availability of jDomLayout
   * @type {*|jDomLayout}
   */
  let jDomLayout = root.jDomLayout

  /**
   * If jDomLayout remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomLayout === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomLayout = require('./layout.js')
    } else {
      console.error('start-functions.js requires jDomLayout')
    }
  }

  /**
   * Verify availability of gamePieces
   * @type {*|gamePieces}
   */
  let gamePieces = root.gamePieces

  /**
   * If gameUtils remains undefined, attempt to retrieve it as a module
   */
  if (typeof gamePieces === 'undefined') {
    if (typeof require !== 'undefined') {
      gamePieces = require('./game-pieces.js')
    } else {
      console.error('start-functions.js requires gamePieces')
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
      console.error('start-functions.js requires gameUtils')
    }
  }

  /**
   * Verify availability of gameActions
   * @type {*|gameActions}
   */
  let gameActions = root.gameActions

  /**
   * If gameActions remains undefined, attempt to retrieve it as a module
   */
  if (typeof gameActions === 'undefined') {
    if (typeof require !== 'undefined') {
      gameActions = require('./actions.js')
    } else {
      console.error('start-functions.js requires gameActions')
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
  const selectShipDirection = (lengths, shipLength) => jDomCoreMatrix.randDirection([jDomObjectsMatrix.point(1, 0, 0), jDomObjectsMatrix.point(0, 1, 0), jDomObjectsMatrix.point(0, 0, 1)].filter(p => lengths[jDomCoreMatrix.getAxisOfCoord(p, 1)] > shipLength))

  /**
   *
   * @param lengths
   * @param shipLength
   * @param dir
   * @returns {{start: {x: number, y: number, z: number}, dir}}
   */
  const randomStartDir = (lengths, shipLength, dir = selectShipDirection(lengths, shipLength)) => ({
    start: jDomCoreMatrix.randomStart(shipLength, dir, lengths),
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
    jDomCoreMatrix.getHighAbsoluteCoord(startDir.dir) === 0 ? [jDomObjectsMatrix.point(0, 0, 0), jDomObjectsMatrix.point(0, 0, 0)] : jDomCoreMatrix.checkInBetween(...[startDir.start, jDomCoreMatrix.lineEndPoint(startDir.start, shipLength, startDir.dir)], matrix, gameUtils.checkIfShipCell) ? generateStartEnd(matrix, shipLength, lengths) : [startDir.start, jDomCoreMatrix.lineEndPoint(startDir.start, shipLength, startDir.dir)]

  /**
   * Create a series of randomly placed ships based on the provided shipLengths.
   * The optional parameter view will set the visibility of the ships.
   * @param {Array} ships
   * @param {Object} matrix
   * @param {boolean} [view=false]
   * @returns {Array}
   */
  const generateRandomFleet = (ships, matrix, view = false) => ships.map(ship => buildShip(ship, jDomCoreMatrix.getPointsLine(...generateStartEnd(matrix, ship.size, jDomCoreMatrix.getAxisLengths(matrix))), matrix, view))

  /**
   * Create a default fleet using the standard battleship lengths.
   * @type {Array}
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
    player.board = jDomCoreMatrix.bindPointData(jDomObjectsMatrix.square(gamePieces.waterTile(player, players), 10))
    player.shipFleet = defaultFleet(player.board, false) // generate fleet of ships
    player.playerStats = gamePieces.playerStats(player, `${Math.round(player.status * 100) / 100}%`)
    player.children = [player.board, player.playerStats]
    players.push(player)
    return buildPlayers(--humans, humans < 0 ? --robots : robots, players)
  }

  /**
   * Logic for setting up and starting a new round
   * (selects random start player and calls computer attack if it is AI starting)
   * @param e
   * @param mainForm
   * @returns {boolean}
   */
  exportFunctions.beginRound = (e, mainForm) => {
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
    let players = jDomCoreDom.renderHTML(jDomLayout.boards(buildPlayers(humans, robots)), parent).children
    let firstAttacker = gameActions.updatePlayer(firstGoesFirst ? players[0] : players[jDomCore.randomInteger(players.length)])
    if (firstAttacker.isRobot) {
      gameActions.computerAttack(firstAttacker, players)
    }
    return false
  }

  /**
   * The entry function
   * @param parent
   */
  const main = (parent = jDomObjects.documentItem) => {
    for (let i = parent.body.children.length - 1; i >= 0; --i) {
      jDomCoreDom.removeChild(parent.body.children[i], parent.body)
    }
    jDomCoreDom.renderHTML(jDomLayout.mainMenu(), parent)
    return parent
  }
  exportFunctions.main = main

  exportFunctions.restart = (e, button) => main(jDomCoreDom.getTopParentItem(button))

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
