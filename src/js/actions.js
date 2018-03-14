'use strict'
// Functions used for live updating
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this || {}

  /**
   * Store reference to any pre-existing module of the same name
   * @type {gameActions|*}
   */
  const previousGameActions = root.gameActions || {}

  /**
   * All methods exported from this module are encapsulated within gameActions.
   * @typedef {Object} gameActions
   * @property {gameActions} gameActions
   * @property {function} attackFleet
   * @property {function} attackListener
   * @property {function} computerAttack
   * @property {function} noConflict
   * @property {function} setShip
   * @property {function} updatePlayer
   */

  /**
   * A reference to all functions to be used globally / exported
   * @type {gameActions}
   */
  const exportFunctions = {
    noConflict: () => {
      root.gameActions = previousGameActions
      return exportFunctions
    }
  }
  root.gameActions = exportFunctions

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
      console.error('actions.js requires jDomCore')
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
      console.error('actions.js requires jDomCoreDom')
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
      console.error('actions.js requires jDomObjectsMatrix')
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
      console.error('actions.js requires jDomCoreMatrix')
    }
  }

  /**
   * Verify availability of jDomLayout
   * @type {*|jDomLayout}
   */
  let jDomLayout = root.jDomLayout

  /**
   * If jDomCoreDom remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomLayout === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomLayout = require('./layout.js')
    } else {
      console.error('actions.js requires jDomLayout')
    }
  }

  /**
   * Verify availability of gamePieces
   * @type {*|gamePieces}
   */
  let gamePieces = root.gamePieces

  /**
   * If gamePieces remains undefined, attempt to retrieve it as a module
   */
  if (typeof gamePieces === 'undefined') {
    if (typeof require !== 'undefined') {
      gamePieces = require('./game-pieces.js')
    } else {
      console.error('actions.js requires gamePieces')
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
      console.error('actions.js requires gameUtils')
    }
  }

  /**
   * Update view based on actions performed
   * @param config
   * @param isRobot
   * @returns {*}
   */
  const configureHtml = (config, isRobot) => {
    // Update cell colour once it has been hit
    // Add any other style changes to the cell
    if (isRobot) {
      attackFleet.isLocked = true
      jDomCore.queueTimeout(() => {
        if (config.isHit) {
          config.attributes.style.backgroundColor = config.hasShip ? 'red' : 'white'
        }
        config = jDomCoreDom.updateElement(config)
        attackFleet.isLocked = false
        return config
      }, 0)
    } else {
      if (config.isHit) {
        config.attributes.style.backgroundColor = config.hasShip ? 'red' : 'white'
      }
      config = jDomCoreDom.updateElement(config)
    }
    return config
  }

  /**
   * Given a cell and new config data, update the data of the cell
   * @param config
   * @param matrix
   * @param x
   * @param y
   * @param z
   * @param isRobot
   */
  const update3dCell = (config, matrix, x, y, z, isRobot = false) => configureHtml(jDomCore.mergeObjectsMutable(matrix.children[z].children[y].children[x], config), isRobot)

  /**
   *
   */
  const setViewShip = jDomCore.curry(update3dCell)(jDomCore.mergeObjects(gamePieces.shipTile(), {attributes: {style: {backgroundColor: '#777'}}}))

  /**
   *
   */
  const setHiddenShip = jDomCore.curry(update3dCell)(gamePieces.shipTile())

  /**
   *
   */
  const setHit = jDomCore.curry(update3dCell)(gamePieces.hitTile())

  /**
   * Set a specified point to be part of a ship
   * @param matrix
   * @param point
   * @param view
   */
  exportFunctions.setShip = (matrix, point, view) => view ? setViewShip(matrix, point.x, point.y, point.z) : setHiddenShip(matrix, point.x, point.y, point.z)

  /**
   *
   * @param player
   * @param status
   * @returns {*}
   */
  const updatePlayerStats = (player, status = `${Math.round(player.status * 100) / 100}%`) => {
    player.playerStats = jDomCoreDom.updateElements(jDomCore.mergeObjects(player.playerStats, gamePieces.playerStats(player, status)))
    // console.log(gamePieces.playerStats(player, status).children[0].attributes.innerHTML)
    return player
  }

  /**
   * Track player stats such as attacks and turns
   * @param player
   * @param playAgain
   * @param sunkShip
   */
  const updatePlayer = (player, playAgain, sunkShip = 0) => {
    if (player.attacker) {
      if (playAgain) {
        ++player.attacks.hit
      } else {
        ++player.attacks.miss
      }
      if (sunkShip) {
        ++player.attacks.sunk
      }
    }
    let result = {}
    if (!playAgain) {
      player.attacker = !player.attacker
      attackFleet.isLocked = true
      if (player.attacker) {
        result = jDomCore.queueTimeout(() => {
          attackFleet.isLocked = false
          return player.board.children.map(l => l.children.map(r => r.children.map(c => jDomCoreDom.updateElement(jDomCore.mergeObjects(c, {
            attributes: {
              style: {
                width: '17px',
                height: '17px'
              }
            }
          })))))
        }, 400)
        ++player.turnCnt
      } else {
        result = jDomCore.queueTimeout(() => {
          attackFleet.isLocked = false
          return player.board.children.map(l => l.children.map(r => r.children.map(c => jDomCoreDom.updateElement(jDomCore.mergeObjects(c, {
            attributes: {
              style: {
                width: '35px',
                height: '35px'
              }
            }
          })))))
        }, 0)
      }
    }
    result = jDomCore.queueTimeout(() => updatePlayerStats(player, player.attacker ? 'ATTACKER' : `${Math.round(player.status * 100) / 100}%`), 0)
    return result.result || player
  }
  exportFunctions.updatePlayer = updatePlayer

  /**
   * Final state once a game is won (only one player remains)
   * @param winner
   * @returns {Array.<*>}
   */
  const endGame = (winner) => {
    const parent = jDomCoreDom.getTopParentItem(winner)
    const players = winner.parentItem.children
    players.map(player => updatePlayerStats(player))
    winner = updatePlayerStats(winner, 'WINNER')
    const finalScore = jDomCoreDom.renderHTML(jDomLayout.finalScore(players), parent)
    finalScore.children[0].children.map(child => child.attributes.innerHTML)
    return [winner]
  }

  /**
   *
   * @param attacker
   * @param players
   * @param attackerIndex
   * @returns {*}
   */
  const findNextAttacker = (attacker, players, attackerIndex) => {
    let nextAttacker = (players.length > 1 && attackerIndex >= players.length - 1) ? players[0] : players[++attackerIndex]
    return nextAttacker.status > 0 ? nextAttacker : findNextAttacker(attacker, players, attackerIndex) // Only use players with a positive status
  }

  /**
   * Based on the current attacker and list of players, return the next attacker.
   * @param attacker
   * @param players
   * @param playAgain
   * @returns {*}
   */
  const getNextAttacker = (attacker, players, playAgain) => playAgain ? attacker : updatePlayer(findNextAttacker(attacker, players, players.indexOf(attacker)), playAgain)

  /**
   * Update all game stats after each player round
   * @param player
   * @param hitShip
   * @param sunkShip
   * @param players
   * @returns {*}
   */
  const updateScore = (player, hitShip, sunkShip, players) => {
    players = players.filter((p) => p.status > 0)
    let attacker = players.reduce((p1, p2) => p1.attacker ? p1 : p2)
    attacker = updatePlayer(attacker, hitShip, sunkShip)
    if (players.length < 2) {
      return jDomCore.queueTimeout(() => endGame(players[0]), 200)
    }
    let nextAttacker = getNextAttacker(attacker, players, hitShip)
    if (nextAttacker.isRobot) {
      jDomCore.queueTimeout(computerAttack, 0, nextAttacker, players)
    }
    return players
  }

  /**
   * Perform attack on an enemy board / cell
   * @param target
   * @returns {*}
   */
  const attackFleet = (target) => {
    attackFleet.isLocked = attackFleet.isLocked || false
    let player = jDomCoreDom.getParentsByClass('player', target)[0]
    let players = jDomCoreDom.getParentsByClass('boards', target)[0].children
    // Player cannot attack themselves (current attacker) or if they have bad status
    if (player.status <= 0 || player.attacker || attackFleet.isLocked) {
      return players
    }
    // Update cell to hit
    let hitCell = setHit(player.board, target.point.x, target.point.y, target.point.z, players.reduce((p1, p2) => p1.attacker ? p1 : p2).isRobot)
    let hitShip = false
    let sunkShip = 0
    if (hitCell.hasShip) {
      let status = 0
      // Update all ship status and player status by checking all ships / parts
      player.shipFleet.map((ship) => {
        // Get all healthy ships
        let healthy = ship.parts.filter((part) => {
          if (jDomCoreMatrix.checkEqualPoints(part.point, target.point)) {
            hitShip = ship
          }
          return !part.isHit
        })
        // Create percentage health status
        ship.status = healthy.length / ship.parts.length * 100
        // Create sum of ship status
        status += ship.status
        return ship
      })
      // Divide sum of ship statuses by number of ships to get player status
      player.status = status / player.shipFleet.length
    }
    if (hitShip) {
      player = updatePlayerStats(player, `${Math.round(player.status * 100) / 100}%`)
      // Check if the hit ship was sunk
      sunkShip = hitShip.status <= 0 ? hitShip.parts.length : 0
    }
    return updateScore(player, hitCell.hasShip, sunkShip, players)
  }
  exportFunctions.attackFleet = attackFleet

  /**
   *
   * @param e
   * @param target
   * @param args
   * @returns {*}
   */
  const attackListener = (e, target, args = {}) => attackFleet(target)
  exportFunctions.attackListener = attackListener

  /**
   * Choose which player to attack.
   * @param players
   * @returns {*}
   */
  const selectTargetPlayer = (players) => {
    // Get a list of all players with broken ships or with lowest status.
    let victims = gameUtils.getBrokenShipsPlayers(players).length ? gameUtils.getBrokenShipsPlayers(players) : gameUtils.getLowStatusItems(players)
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
        // If there are no points between, attack the outer points first.
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
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = exportFunctions
    }
    exports = Object.assign(exports, exportFunctions)
  }
}).call(this || window || base || {}) // Use the external context to assign this, which will be Window if rendered via browser
