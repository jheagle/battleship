'use strict'
// Game specific functions
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this

  /**
   * Store reference to any pre-existing module of the same name
   * @type {gameUtils|*}
   */
  const previousGameUtils = root.gameUtils

  /**
   * All methods exported from this module are encapsulated within gameUtils.
   * @typedef {Object} gameUtils
   * @property {gameUtils} gameUtils
   * @property {function} beginRound
   * @property {function} checkIfHitCell
   * @property {function} filterAdjacentPoints
   * @property {function} getALowStatusItem
   * @property {function} getAdjEdgeNonHitCells
   * @property {function} getAllNonHitCells
   * @property {function} getBrokenItems
   * @property {function} getBrokenShipsPlayers
   * @property {function} getLowStatusItems
   * @property {function} main
   * @property {function} noConflict
   * @property {function} numDamangedParts
   * @property {function} restart
   */

  /**
   * A reference to all functions to be used globally / exported
   * @type {gameUtils}
   */
  const exportFunctions = {
    noConflict: () => {
      root.gameUtils = previousGameUtils
      return exportFunctions
    }
  }

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
      console.error('functions.js requires jDomCore')
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
      console.error('functions.js requires jDomObjects')
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
      console.error('functions.js requires jDomCoreDom')
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
      console.error('functions.js requires jDomCoreMatrix')
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
      console.error('functions.js requires jDomObjectsMatrix')
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
      console.error('functions.js requires jDomLayout')
    }
  }

  /**
   * Verify availability of gameUtils
   * @type {*|gamePieces}
   */
  let gamePieces = root.gamePieces

  /**
   * If gameUtils remains undefined, attempt to retrieve it as a module
   */
  if (typeof gamePieces === 'undefined') {
    if (typeof require !== 'undefined') {
      gamePieces = require('./functions.js')
    } else {
      console.error('functions.js requires gamePieces')
    }
  }

  /**
   * Return the hasShip tile boolean at the specified point.
   * @param pnt
   * @param matrix
   * @returns {boolean}
   */
  const checkIfShipCell = (pnt, matrix) => matrix.children[pnt.z].children[pnt.y].children[pnt.x].hasShip

  /**
   * Return the isHit tile boolean at the specified point.
   * @param pnt
   * @param matrix
   * @returns {boolean}
   */
  const checkIfHitCell = (pnt, matrix) => matrix.children[pnt.z].children[pnt.y].children[pnt.x].isHit
  exportFunctions.checkIfHitCell = checkIfHitCell

  /**
   * Get all points which were not yet hit in the matrix.
   * @param matrix
   * @returns {Array}
   */
  const getAllNonHitCells = matrix => jDomCoreMatrix.getAllPoints(matrix).filter(p => !checkIfHitCell(p, matrix))
  exportFunctions.getAllNonHitCells = getAllNonHitCells

  /**
   * Get the points surrounding a provided point which were not hit.
   * @param pnt
   * @param matrix
   * @returns {Array}
   */
  const getAdjNonHitCells = (pnt, matrix) => jDomCoreMatrix.adjacentPoints(pnt, matrix).filter(p => !checkIfHitCell(p, matrix))

  /**
   * Get the points which have same edges with the provided point and are not hit.
   * @param pnt
   * @param matrix
   * @returns {Array}
   */
  const getAdjEdgeNonHitCells = (pnt, matrix) => jDomCoreMatrix.adjacentEdgePoints(pnt, matrix).filter(p => !checkIfHitCell(p, matrix))
  exportFunctions.getAdjEdgeNonHitCells = getAdjEdgeNonHitCells

  /**
   * Given an array of items, return the item with the lowest status property (at the end of the array)
   * @param items
   * @returns {Array}
   */
  const getALowStatusItem = items => items.reduce((a, b) => b.status <= a.status ? b : a)
  exportFunctions.getALowStatusItem = getALowStatusItem

  /**
   * Given an array of items, return all items which have the lowest status property
   * @param items
   * @returns {Array}
   */
  const getLowStatusItems = items => items.filter(i => i.status <= getALowStatusItem(items).status)
  exportFunctions.getLowStatusItems = getLowStatusItems

  /**
   * Given an array of items, return all of the items which have a status less than 100, but more than 0
   * @param items
   * @returns {Array}
   */
  const getBrokenItems = items => items.filter(i => i.status < 100 && i.status > 0)
  exportFunctions.getBrokenItems = getBrokenItems

  /**
   * Return all of the players which have broken ships.
   * @param players
   * @returns {Array}
   */
  const getBrokenShipsPlayers = players => players.filter(p => getBrokenItems(p.shipFleet).length)
  exportFunctions.getBrokenShipsPlayers = getBrokenShipsPlayers

  /**
   * Return the number of damaged ship parts. Performs math on the number of parts vs the damaged status.
   * @param total
   * @param status
   * @returns {number}
   */
  const numDamangedParts = (total, status) => total - Math.ceil(((status / 100) * total))
  exportFunctions.numDamangedParts = numDamangedParts

  /**
   * Used to generate 'checkerboard' style attack by only attacking every non-edge-touching cell
   * @param pnt
   * @returns {boolean}
   */
  const filterAdjacentPoints = pnt => ((pnt.z % 2 === 0 && ((pnt.x % 2 === 0 && pnt.y % 2 === 0) || (pnt.x % 2 !== 0 && pnt.y % 2 !== 0))) || (pnt.z % 2 !== 0 && ((pnt.x % 2 !== 0 && pnt.y % 2 === 0) || (pnt.x % 2 === 0 && pnt.y % 2 !== 0))))
  exportFunctions.filterAdjacentPoints = filterAdjacentPoints

  /**
   * Generate a ship with the provided line of points.
   * The visibility of the ship on the board is determined by the view parameter.
   * @param shipInfo
   * @param line
   * @param matrix
   * @param view
   * @returns {{name: string, status: number, parts: Array}}
   */
  const buildShip = (shipInfo, line, matrix, view = false) => jDomCore.mergeObjects(gamePieces.ship(shipInfo.name), {parts: line.map(p => setShip(matrix, p, view))})

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
   * @returns {[null,null]}
   */
  const generateStartEnd = (matrix, shipLength, lengths, startDir = randomStartDir(lengths, shipLength)) =>
    jDomCoreMatrix.getHighAbsoluteCoord(startDir.dir) === 0 ? [jDomObjectsMatrix.point(0, 0, 0), jDomObjectsMatrix.point(0, 0, 0)] : jDomCoreMatrix.checkInBetween(...[startDir.start, jDomCoreMatrix.lineEndPoint(startDir.start, shipLength, startDir.dir)], matrix, checkIfShipCell) ? generateStartEnd(matrix, shipLength, lengths) : [startDir.start, jDomCoreMatrix.lineEndPoint(startDir.start, shipLength, startDir.dir)]

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
    let player = playerSet({}, `Player ${players.length + 1}`)
    player.isRobot = humans <= 0
    player.board = jDomCoreMatrix.bindPointData(jDomObjectsMatrix.square(waterTile(player, players), 10))
    player.shipFleet = defaultFleet(player.board, false) // generate fleet of ships
    player.playerStats = playerStats(player, `${Math.round(player.status * 100) / 100}%`)
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
  const beginRound = (e, mainForm) => {
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
    let firstAttacker = updatePlayer(firstGoesFirst ? players[0] : players[jDomCore.randomInteger(players.length)])
    if (firstAttacker.isRobot) {
      computerAttack(firstAttacker, players)
    }
    return false
  }
  exportFunctions.beginRound = beginRound

  /**
   * The entry function
   * @param parent
   */
  const main = (parent = jDomObjectsDom.documentItem) => {
    for (let i = parent.body.children.length - 1; i >= 0; --i) {
      jDomCoreDom.removeChild(parent.body.children[i], parent.body)
    }
    jDomCoreDom.renderHTML(jDomLayout.mainMenu(), parent)
    return parent
  }
  exportFunctions.main = main

  const restart = (e, button) => main(jDomCoreDom.getTopParentItem(button))
  exportFunctions.restart = restart

  /**
   * For each exported function, store a reference to similarly named functions from the global scope
   * @type {Object}
   */
  const previousExports = Object.keys(exportFunctions).reduce((start, next) => {
    start[next] = root[next]
    return start
  }, {})

  /**
   * Ensure each exported function has an a noConflict associated
   */
  Object.keys(exportFunctions).map((key) => {
    exportFunctions[key].noConflict = () => {
      root[key] = previousExports[key]
      return exportFunctions[key]
    }
    return key
  })

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = exportFunctions
    }
    exports = Object.assign(exports, exportFunctions)
  } else {
    exportFunctions.gameUtils = exportFunctions
    root = Object.assign(root, exportFunctions)
  }
}).call(this) // Use the external context to assign this, which will be Window if rendered via browser
