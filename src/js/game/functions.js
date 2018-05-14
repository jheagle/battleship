'use strict'
// Game specific functions
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this || {}

  /**
   * Store reference to any pre-existing module of the same name
   * @type {gameUtils|*}
   */
  const previousGameUtils = root.gameUtils || {}

  /**
   * A reference to all functions to be used globally / exported
   * @module gameUtils
   */
  const gameUtils = {}
  root.gameUtils = gameUtils

  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {gameUtils}
   */
  gameUtils.noConflict = () => {
    root.gameUtils = previousGameUtils
    return gameUtils
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
      jDomCoreMatrix = require('../jDom/matrix/core.js')
    } else {
      console.error('functions.js requires jDomCoreMatrix')
    }
  }

  /**
   * Return the hasShip tile boolean at the specified point.
   * @function checkIfShipCell
   * @param pnt
   * @param matrix
   * @returns {boolean}
   */
  gameUtils.checkIfShipCell = (pnt, matrix) => matrix.children[pnt.z].children[pnt.y].children[pnt.x].hasShip

  /**
   * Return the isHit tile boolean at the specified point.
   * @function checkIfHitCell
   * @param pnt
   * @param matrix
   * @returns {boolean}
   */
  gameUtils.checkIfHitCell = (pnt, matrix) => matrix.children[pnt.z].children[pnt.y].children[pnt.x].isHit

  /**
   * Get all points which were not yet hit in the matrix.
   * @function getAllNonHitCells
   * @param matrix
   * @returns {Array}
   */
  gameUtils.getAllNonHitCells = matrix => jDomCoreMatrix.getAllPoints(matrix).filter(p => !gameUtils.checkIfHitCell(p, matrix))

  /**
   * Get the points which have same edges with the provided point and are not hit.
   * @function getAdjEdgeNonHitCells
   * @param pnt
   * @param matrix
   * @returns {Array}
   */
  gameUtils.getAdjEdgeNonHitCells = (pnt, matrix) => jDomCoreMatrix.adjacentEdgePoints(pnt, matrix).filter(p => !gameUtils.checkIfHitCell(p, matrix))

  /**
   * Given an array of items, return the item with the lowest status property (at the end of the array)
   * @function getALowStatusItem
   * @param items
   * @returns {Array}
   */
  gameUtils.getALowStatusItem = items => items.reduce((a, b) => b.status <= a.status ? b : a)

  /**
   * Given an array of items, return all items which have the lowest status property
   * @function getLowStatusItems
   * @param items
   * @returns {Array}
   */
  gameUtils.getLowStatusItems = items => items.filter(i => i.status <= gameUtils.getALowStatusItem(items).status)

  /**
   * Given an array of items, return all of the items which have a status less than 100, but more than 0
   * @function getBrokenItems
   * @param items
   * @returns {Array}
   */
  gameUtils.getBrokenItems = items => items.filter(i => i.status < 100 && i.status > 0)

  /**
   * Return all of the players which have broken ships.
   * @function getBrokenShipsPlayers
   * @param players
   * @returns {Array}
   */
  gameUtils.getBrokenShipsPlayers = players => players.filter(p => gameUtils.getBrokenItems(p.shipFleet).length)

  /**
   * Return the number of damaged ship parts. Performs math on the number of parts vs the damaged status.
   * @function numDamagedParts
   * @param total
   * @param status
   * @returns {number}
   */
  gameUtils.numDamagedParts = (total, status) => total - Math.ceil(((status / 100) * total))

  /**
   * Used to generate 'checkerboard' style attack by only attacking every non-edge-touching cell
   * @function filterAdjacentPoints
   * @param pnt
   * @returns {boolean}
   */
  gameUtils.filterAdjacentPoints = pnt => ((pnt.z % 2 === 0 && ((pnt.x % 2 === 0 && pnt.y % 2 === 0) || (pnt.x % 2 !== 0 && pnt.y % 2 !== 0))) || (pnt.z % 2 !== 0 && ((pnt.x % 2 !== 0 && pnt.y % 2 === 0) || (pnt.x % 2 === 0 && pnt.y % 2 !== 0))))

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = gameUtils
    }
    exports = Object.assign(exports, gameUtils)
  }
}).call(this || window || base || {}) // Use the external context to assign this, which will be Window if rendered via browser
