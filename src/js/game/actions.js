'use strict'
// Functions used for live updating
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this || {}

  /**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */
  const previousGameActions = root.gameActions || {}

  /**
   * All methods exported from this module are encapsulated within gameActions.
   * @typedef {Object} gameActions
   * @module game/actions
   */
  const gameActions = {}
  root.gameActions = gameActions

  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {gameActions}
   */
  gameActions.noConflict = () => {
    root.gameActions = previousGameActions
    return gameActions
  }

  /**
   * Verify availability of jDomCore
   * @typedef {*|module:jDom/core/core} jDomCore
   */
  let jDomCore = root.jDomCore

  /**
   * If gameUtils remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomCore === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomCore = require('../jDom/core/core.js')
    } else {
      console.error('actions.js requires jDom/core/core')
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
      console.error('actions.js requires jDom/core/dom/core')
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
      console.error('actions.js requires jDom/matrix/objects')
    }
  }

  /**
   * Verify availability of jDomMatrixCore
   * @typedef {*|module:jDom/matrix/core} jDomMatrixCore
   */
  let jDomMatrixCore = root.jDomMatrixCore

  /**
   * If jDomCoreDom remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomMatrixCore === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomMatrixCore = require('../jDom/matrix/core.js')
    } else {
      console.error('actions.js requires jDom/matrix/core')
    }
  }

  /**
   * Verify availability of gameLayout
   * @typedef {*|module:game/layout} gameLayout
   */
  let gameLayout = root.gameLayout

  /**
   * If jDomCoreDom remains undefined, attempt to retrieve it as a module
   */
  if (typeof gameLayout === 'undefined') {
    if (typeof require !== 'undefined') {
      gameLayout = require('./layout.js')
    } else {
      console.error('actions.js requires game/layout')
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
      console.error('actions.js requires game/pieces')
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
      console.error('actions.js requires game/functions')
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
      gameActions.attackFleet.isLocked = true
      jDomCore.queueTimeout(() => {
        if (config.isHit) {
          config.attributes.style.backgroundColor = config.hasShip ? 'red' : 'white'
        }
        config = jDomCoreDom.updateElement(config)
        gameActions.attackFleet.isLocked = false
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
   * @function setShip
   * @param matrix
   * @param point
   * @param view
   */
  gameActions.setShip = (matrix, point, view) => view ? setViewShip(matrix, point.x, point.y, point.z) : setHiddenShip(matrix, point.x, point.y, point.z)

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
   * @function updatePlayer
   * @param player
   * @param playAgain
   * @param sunkShip
   */
  gameActions.updatePlayer = (player, playAgain, sunkShip = 0) => {
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
    if (!playAgain) {
      player.attacker = !player.attacker
      gameActions.attackFleet.isLocked = true
      if (player.attacker) {
        if (!player.isRobot) {
          jDomCore.queueTimeout(() => {
            gameActions.attackFleet.isLocked = false
            return player.board.children.map(l => l.children.map(r => r.children.map(c => jDomCoreDom.updateElement(jDomCore.mergeObjects(c, {
              attributes: {
                style: {
                  width: '17px',
                  height: '17px'
                }
              }
            })))))
          }, 400)
        }
        ++player.turnCnt
      } else {
        jDomCore.queueTimeout(() => {
          gameActions.attackFleet.isLocked = false
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
    const result = jDomCore.queueTimeout(() => updatePlayerStats(player, player.attacker ? 'ATTACKER' : `${Math.round(player.status * 100) / 100}%`), 0)
    return result.result || player
  }

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
    const finalScore = jDomCoreDom.renderHTML(gameLayout.finalScore(players), parent)
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
  const getNextAttacker = (attacker, players, playAgain) => playAgain ? attacker : gameActions.updatePlayer(findNextAttacker(attacker, players, players.indexOf(attacker)), playAgain)

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
    attacker = gameActions.updatePlayer(attacker, hitShip, sunkShip)
    if (players.length < 2) {
      return jDomCore.queueTimeout(() => endGame(players[0]), 200)
    }
    let nextAttacker = getNextAttacker(attacker, players, hitShip)
    if (nextAttacker.isRobot) {
      jDomCore.queueTimeout(gameActions.computerAttack, 0, nextAttacker, players)
    }
    return players
  }

  /**
   * Perform attack on an enemy board / cell
   * @function attackFleet
   * @param target
   * @returns {*}
   */
  gameActions.attackFleet = (target) => {
    gameActions.attackFleet.isLocked = gameActions.attackFleet.isLocked || false
    let player = jDomCoreDom.getParentsByClass('player', target)[0]
    let players = jDomCoreDom.getParentsByClass('boards', target)[0].children
    // Player cannot attack themselves (current attacker) or if they have bad status
    if (player.status <= 0 || player.attacker || gameActions.attackFleet.isLocked) {
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
          if (jDomMatrixCore.checkEqualPoints(part.point, target.point)) {
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

  /**
   *
   * @function attackListener
   * @param e
   * @param target
   * @returns {*}
   */
  gameActions.attackListener = (e, target) => gameActions.attackFleet(jDomMatrixCore.getDomItemFromElement(e.target, target))

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
      let moreBrokenShips = brokenShips.filter(ship => gameUtils.numDamagedParts(ship.parts.length, ship.status) > 1)
      // Of the broken ships, attack the lowest status ship
      let targetShip = gameUtils.getALowStatusItem(moreBrokenShips.length ? moreBrokenShips : brokenShips)
      // Get all of the parts which have been hit
      let hitParts = targetShip.parts.filter(part => gameUtils.checkIfHitCell(part.point, victim.board))
      if (moreBrokenShips.length) {
        // If there are more broken ships, attack the parts between hit points first.
        for (let i = 0; i < hitParts.length; ++i) {
          let targetPoints = jDomMatrixCore.getInBetween(hitParts[0].point, hitParts[i].point, victim.board, gameUtils.checkIfHitCell, false)
          if (targetPoints.false.length) {
            displayTargets(targetPoints.false, targetPoints.false[0], victim)
            return jDomMatrixCore.getDomItemFromPoint(targetPoints.false[0], victim.board)
          }
        }
        // If there are no points between, attack the outer points first.
        let pntDiff = jDomMatrixCore.pointDifference(hitParts[0].point, hitParts[1].point)
        let dirPnts = (pntDiff.x > 0 ? [jDomMatrixObjects.point(-1, 0, 0), jDomMatrixObjects.point(1, 0, 0)] : [jDomMatrixObjects.point(0, -1, 0), jDomMatrixObjects.point(0, 1, 0)]).map((p, i) => jDomMatrixCore.nextCell(hitParts[(hitParts.length - 1) * i].point, p)).filter(p => jDomMatrixCore.checkValidPoint(p, victim.board)).filter(a => !gameUtils.checkIfHitCell(a, victim.board))
        // Check outer points which are valid and not hit.
        let target = dirPnts.reduce((a, b) => gameUtils.checkIfHitCell(a, victim.board) ? b : a)
        if (target) {
          displayTargets(dirPnts, target, victim)
          return jDomMatrixCore.getDomItemFromPoint(target, victim.board)
        }
      }
      // If there is only one hit part, then set that as the lastTarget for detecting adjacent parts.
      availTargets = gameUtils.getAdjEdgeNonHitCells(hitParts[0].point, victim.board)
    }
    let finalTargets = availTargets.length ? availTargets : gameUtils.getAllNonHitCells(victim.board).filter(t => gameUtils.filterAdjacentPoints(t))
    let target = finalTargets[jDomCore.randomInteger(finalTargets.length)]
    displayTargets(finalTargets, target, victim)

    // If there are available targets then hit one at random
    return jDomMatrixCore.getDomItemFromPoint(target, victim.board)
  }

  /**
   *
   * @param targets
   * @param target
   * @param victim
   * @returns {Array}
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
    data.targets.forEach(t => jDomCoreDom.updateElement(jDomCore.mergeObjects(jDomMatrixCore.getDomItemFromPoint(t, data.victim.board), {attributes: {style: {borderColor: '#333'}}})))
    if (!data.target) {
      data.victim.board.children.map(l => jDomCoreDom.updateElement(jDomCore.mergeObjects(l, {attributes: {style: {borderColor: 'yellow'}}})))
      data.targets.forEach(t => jDomCoreDom.updateElement(jDomCore.mergeObjects(jDomMatrixCore.getDomItemFromPoint(t, data.victim.board), {attributes: {style: {borderColor: 'yellow'}}})))
    }
    return data
  }

  /**
   * Main AI logic for computer to attack, selects a target then performs attack function.
   * @function computerAttack
   * @param player
   * @param players
   */
  gameActions.computerAttack = (player, players) => {
    let victim = selectTargetPlayer(players.filter(p => !p.attacker))
    gameActions.attackFleet.isLocked = false
    return gameActions.attackFleet(selectTargetCoord(victim))
  }

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = gameActions
    }
    exports = Object.assign(exports, gameActions)
  }
}).call(this || window || base || {}) // Use the external context to assign this, which will be Window if rendered via browser
