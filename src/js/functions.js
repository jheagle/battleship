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
   * @property {function} checkIfHitCell
   * @property {function} checkIfShipCell
   * @property {function} filterAdjacentPoints
   * @property {function} getALowStatusItem
   * @property {function} getAdjEdgeNonHitCells
   * @property {function} getAllNonHitCells
   * @property {function} getBrokenItems
   * @property {function} getBrokenShipsPlayers
   * @property {function} getLowStatusItems
   * @property {function} noConflict
   * @property {function} numDamangedParts
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
   * Return the hasShip tile boolean at the specified point.
   * @param pnt
   * @param matrix
   * @returns {boolean}
   */
  const checkIfShipCell = (pnt, matrix) => matrix.children[pnt.z].children[pnt.y].children[pnt.x].hasShip
  exportFunctions.checkIfShipCell = checkIfShipCell

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
