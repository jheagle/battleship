'use strict'
// Functions for computer generated actions
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this

  /**
   * Store reference to any pre-existing module of the same name
   * @type {gameAI|*}
   */
  const previousGameAI = root.gameAI

  /**
   * All methods exported from this module are encapsulated within gameAI.
   * @typedef {Object} gameAI
   * @property {gameAI} gameAI
   * @property {function} computerAttack
   * @property {function} noConflict
   */

  /**
   * A reference to all functions to be used globally / exported
   * @type {gameAI}
   */
  const exportFunctions = {
    noConflict: () => {
      root.gameAI = previousGameAI
      return exportFunctions
    }
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
      jDomCore = require('./core.js')
    } else {
      console.error('game-ai.js requires jDomCore')
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
      console.error('game-ai.js requires jDomCoreDom')
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
      console.error('game-ai.js requires jDomObjectsMatrix')
    }
  }

  /**
   * Verify availability of jDomCoreMatrix
   * @type {*|jDomCoreMatrix}
   */
  let jDomCoreMatrix = root.jDomCoreMatrix

  /**
   * If jDomCoreDom remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomCoreMatrix === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomCoreMatrix = require('./core-matrix.js')
    } else {
      console.error('game-ai.js requires jDomCoreMatrix')
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
      console.error('game-ai.js requires gameUtils')
    }
  }

  /**
   * Choose which player to attack.
   * @param players
   * @returns {*}
   */
  const selectTargetPlayer = (players) => {
    // Get a list of all players with broken ships or with lowest status.
    let victims = gameUtils.getBrokenShipsPlayers(players).length ? gameUtils.getBrokenShipsPlayers(players) : getLowStatusItems(players)
    // If more than one possible victim, select a random target, otherwise return the lowest status player.
    return victims.length === 1 ? victims[0] : victims[jDomCore.randomInteger(victims.length)]
  }

  /**
   * Choose which coordinate to attack.
   * @param victim
   * @returns {*}
   */
  const selectTargetCoord = (victim) => {
    // Try to get broken ships
    let brokenShips = gameUtils.getBrokenItems(victim.shipFleet)
    let availTargets = []
    if (brokenShips.length) {
      // If there are broken ships, target those first, select the most broken ships (more than one damaged part)
      let moreBrokenShips = brokenShips.filter(ship => gameUtils.numDamangedParts(ship.parts.length, ship.status) > 1)
      // Of the broken ships, attack the lowest status ship
      let targetShip = gameUtils.getALowStatusItem(moreBrokenShips.length ? moreBrokenShips : brokenShips)
      // Get all of the parts which have been hit
      let hitParts = targetShip.parts.filter(part => gameUtils.checkIfHitCell(part.point, victim.board))
      if (moreBrokenShips.length) {
        // If there are more broken ships, attack the parts between hit points first.
        for (let i = 0; i < hitParts.length; ++i) {
          let targetPoints = jDomCoreMatrix.getInBetween(hitParts[0].point, hitParts[i].point, victim.board, gameUtils.checkIfHitCell, false)
          if (targetPoints.false.length) {
            displayTargets(targetPoints.false, targetPoints.false[0], victim)
            return jDomCoreMatrix.getDOMItemFromPoint(targetPoints.false[0], victim.board)
          }
        }
        // If there are not points between, attack the outer points first.
        let pntDiff = jDomCoreMatrix.pointDifference(hitParts[0].point, hitParts[1].point)
        let dirPnts = (pntDiff.x > 0 ? [jDomObjectsMatrix.point(-1, 0, 0), jDomObjectsMatrix.point(1, 0, 0)] : [jDomObjectsMatrix.point(0, -1, 0), jDomObjectsMatrix.point(0, 1, 0)]).map((p, i) => jDomCoreMatrix.nextCell(hitParts[(hitParts.length - 1) * i].point, p)).filter(p => jDomCoreMatrix.checkValidPoint(p, victim.board)).filter(a => !gameUtils.checkIfHitCell(a, victim.board))
        // Check outer points which are valid and not hit.
        let target = dirPnts.reduce((a, b) => gameUtils.checkIfHitCell(a, victim.board) ? b : a)
        if (target) {
          displayTargets(dirPnts, target, victim)
          return jDomCoreMatrix.getDOMItemFromPoint(target, victim.board)
        }
      }
      // If there is only one hit part, then set that as the lastTarget for detecting adjacent parts.
      availTargets = gameUtils.getAdjEdgeNonHitCells(hitParts[0].point, victim.board)
    }
    let finalTargets = availTargets.length ? availTargets : gameUtils.getAllNonHitCells(victim.board).filter(t => gameUtils.filterAdjacentPoints(t))
    let target = finalTargets[jDomCore.randomInteger(finalTargets.length)]
    displayTargets(finalTargets, target, victim)

    // If there are available targets then hit one at random
    return jDomCoreMatrix.getDOMItemFromPoint(target, victim.board)
  }

  /**
   *
   * @param targets
   * @param target
   * @param victim
   * @returns {[*,*]}
   */
  const displayTargets = (targets, target, victim) => {
    return [
      jDomCore.queueTimeout(resetTargets, 0, {targets: targets, victim: victim}),
      jDomCore.queueTimeout(resetTargets, 200, {targets: targets, target: target, victim: victim})
    ]
  }

  /**
   *
   * @param data
   * @returns {void|Array|Object|*}
   */
  const resetTargets = data => {
    data.victim.board.children.map(l => jDomCoreDom.updateElement(jDomCore.mergeObjects(l, {attributes: {style: {borderColor: '#333'}}})))
    data.targets.forEach(t => jDomCoreDom.updateElement(jDomCore.mergeObjects(jDomCoreMatrix.getDOMItemFromPoint(t, data.victim.board), {attributes: {style: {borderColor: '#333'}}})))
    if (!data.target) {
      data.victim.board.children.map(l => jDomCoreDom.updateElement(jDomCore.mergeObjects(l, {attributes: {style: {borderColor: 'yellow'}}})))
      data.targets.forEach(t => jDomCoreDom.updateElement(jDomCore.mergeObjects(jDomCoreMatrix.getDOMItemFromPoint(t, data.victim.board), {attributes: {style: {borderColor: 'yellow'}}})))
    }
    return data
  }

  /**
   * Main AI logic for computer to attack, selects a target then performs attack function.
   * @param player
   * @param players
   */
  const computerAttack = (player, players) => {
    let victim = selectTargetPlayer(players.filter(p => !p.attacker))
    attackFleet.isLocked = false
    return attackFleet(selectTargetCoord(victim))
  }
  exportFunctions.computerAttack = computerAttack

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
    exportFunctions.gameAI = exportFunctions
    root = Object.assign(root, exportFunctions)
  }
}).call(this) // Use the external context to assign this, which will be Window if rendered via browser
