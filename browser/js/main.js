(function () { function r (e, n, t) { function o (i, f) { if (!n[i]) { if (!e[i]) { const c = typeof require === 'function' && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); const a = new Error("Cannot find module '" + i + "'"); throw a.code = 'MODULE_NOT_FOUND', a } const p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { const n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = typeof require === 'function' && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
  1: [function (require, module, exports) {
    'use strict';

    (function () {
      /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
      const root = this || {}
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

      gameActions.noConflict = function () {
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
          jDomCore = require('./jDom/core/core.js')
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
          jDomCoreDom = require('./jDom/core/dom/core.js')
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
          jDomMatrixObjects = require('./jDom/matrix/objects.js')
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
          jDomMatrixCore = require('./jDom/matrix/core.js')
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

      const configureHtml = function configureHtml (config, isRobot) {
        // Update cell colour once it has been hit
        // Add any other style changes to the cell
        if (isRobot) {
          gameActions.attackFleet.isLocked = true
          jDomCore.queueTimeout(function () {
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

      const update3dCell = function update3dCell (config, matrix, x, y, z) {
        const isRobot = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false
        return configureHtml(jDomCore.mergeObjectsMutable(matrix.children[z].children[y].children[x], config), isRobot)
      }
      /**
   *
   */

      const setViewShip = jDomCore.curry(update3dCell)(jDomCore.mergeObjects(gamePieces.shipTile(), {
        attributes: {
          style: {
            backgroundColor: '#777'
          }
        }
      }))
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

      gameActions.setShip = function (matrix, point, view) {
        return view ? setViewShip(matrix, point.x, point.y, point.z) : setHiddenShip(matrix, point.x, point.y, point.z)
      }
      /**
   *
   * @param player
   * @param status
   * @returns {*}
   */

      const updatePlayerStats = function updatePlayerStats (player) {
        const status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ''.concat(Math.round(player.status * 100) / 100, '%')
        player.playerStats = jDomCoreDom.updateElements(jDomCore.mergeObjects(player.playerStats, gamePieces.playerStats(player, status))) // console.log(gamePieces.playerStats(player, status).children[0].attributes.innerHTML)

        return player
      }
      /**
   * Track player stats such as attacks and turns
   * @function updatePlayer
   * @param player
   * @param playAgain
   * @param sunkShip
   */

      gameActions.updatePlayer = function (player, playAgain) {
        const sunkShip = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0

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
              jDomCore.queueTimeout(function () {
                gameActions.attackFleet.isLocked = false
                return player.board.children.map(function (l) {
                  return l.children.map(function (r) {
                    return r.children.map(function (c) {
                      return jDomCoreDom.updateElement(jDomCore.mergeObjects(c, {
                        attributes: {
                          style: {
                            width: '17px',
                            height: '17px'
                          }
                        }
                      }))
                    })
                  })
                })
              }, 400)
            }

            ++player.turnCnt
          } else {
            jDomCore.queueTimeout(function () {
              gameActions.attackFleet.isLocked = false
              return player.board.children.map(function (l) {
                return l.children.map(function (r) {
                  return r.children.map(function (c) {
                    return jDomCoreDom.updateElement(jDomCore.mergeObjects(c, {
                      attributes: {
                        style: {
                          width: '35px',
                          height: '35px'
                        }
                      }
                    }))
                  })
                })
              })
            }, 0)
          }
        }

        const result = jDomCore.queueTimeout(function () {
          return updatePlayerStats(player, player.attacker ? 'ATTACKER' : ''.concat(Math.round(player.status * 100) / 100, '%'))
        }, 0)
        return result.result || player
      }
      /**
   * Final state once a game is won (only one player remains)
   * @param winner
   * @returns {Array.<*>}
   */

      const endGame = function endGame (winner) {
        const parent = jDomCoreDom.getTopParentItem(winner)
        const players = winner.parentItem.children
        players.map(function (player) {
          return updatePlayerStats(player)
        })
        winner = updatePlayerStats(winner, 'WINNER')
        const finalScore = jDomCoreDom.renderHTML(gameLayout.finalScore(players), parent)
        finalScore.children[0].children.map(function (child) {
          return child.attributes.innerHTML
        })
        return [jDomCore.trace('Winner')(winner)]
      }
      /**
   *
   * @param attacker
   * @param players
   * @param attackerIndex
   * @returns {*}
   */

      const findNextAttacker = function findNextAttacker (attacker, players, attackerIndex) {
        const nextAttacker = players.length > 1 && attackerIndex >= players.length - 1 ? players[0] : players[++attackerIndex]
        return nextAttacker.status > 0 ? nextAttacker : findNextAttacker(attacker, players, attackerIndex) // Only use players with a positive status
      }
      /**
   * Based on the current attacker and list of players, return the next attacker.
   * @param attacker
   * @param players
   * @param playAgain
   * @returns {*}
   */

      const getNextAttacker = function getNextAttacker (attacker, players, playAgain) {
        return playAgain ? attacker : gameActions.updatePlayer(findNextAttacker(attacker, players, players.indexOf(attacker)), playAgain)
      }
      /**
   * Update all game stats after each player round
   * @param player
   * @param hitShip
   * @param sunkShip
   * @param players
   * @returns {*}
   */

      const updateScore = function updateScore (player, hitShip, sunkShip, players) {
        players = players.filter(function (p) {
          return p.status > 0
        })
        let attacker = players.reduce(function (p1, p2) {
          return p1.attacker ? p1 : p2
        })
        attacker = gameActions.updatePlayer(attacker, hitShip, sunkShip)

        if (players.length < 2) {
          return jDomCore.queueTimeout(function () {
            return endGame(players[0])
          }, 200)
        }

        const nextAttacker = getNextAttacker(attacker, players, hitShip)

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

      gameActions.attackFleet = function (target) {
        gameActions.attackFleet.isLocked = gameActions.attackFleet.isLocked || false
        let player = jDomCoreDom.getParentsByClass('player', target)[0]
        const players = jDomCoreDom.getParentsByClass('boards', target)[0].children // Player cannot attack themselves (current attacker) or if they have bad status

        if (player.status <= 0 || player.attacker || gameActions.attackFleet.isLocked) {
          return players
        } // Update cell to hit

        const hitCell = setHit(player.board, target.point.x, target.point.y, target.point.z, players.reduce(function (p1, p2) {
          return p1.attacker ? p1 : p2
        }).isRobot)
        let hitShip = false
        let sunkShip = 0

        if (hitCell.hasShip) {
          let status = 0 // Update all ship status and player status by checking all ships / parts

          player.shipFleet.map(function (ship) {
            // Get all healthy ships
            const healthy = ship.parts.filter(function (part) {
              if (jDomMatrixCore.areEqualPoints(part.point, target.point)) {
                hitShip = ship
              }

              return !part.isHit
            }) // Create percentage health status

            ship.status = healthy.length / ship.parts.length * 100 // Create sum of ship status

            status += ship.status
            return ship
          }) // Divide sum of ship statuses by number of ships to get player status

          player.status = status / player.shipFleet.length
        }

        if (hitShip) {
          player = updatePlayerStats(player, ''.concat(Math.round(player.status * 100) / 100, '%')) // Check if the hit ship was sunk

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

      gameActions.attackListener = function (e, target) {
        return gameActions.attackFleet(jDomMatrixCore.getDomItemFromElement(e.target, target))
      }
      /**
   * Choose which player to attack.
   * @param players
   * @returns {*}
   */

      const selectTargetPlayer = function selectTargetPlayer (players) {
        // Get a list of all players with broken ships or with lowest status.
        const victims = gameUtils.getBrokenShipsPlayers(players).length ? gameUtils.getBrokenShipsPlayers(players) : gameUtils.getLowStatusItems(players) // If more than one possible victim, select a random target, otherwise return the lowest status player.

        return victims.length === 1 ? victims[0] : victims[jDomCore.randomInteger(victims.length)]
      }
      /**
   * Choose which coordinate to attack.
   * @param victim
   * @returns {*}
   */

      const selectTargetCoordinate = function selectTargetCoordinate (victim) {
        // Try to get broken ships
        const brokenShips = gameUtils.getBrokenItems(victim.shipFleet)
        let availTargets = []

        if (brokenShips.length) {
          // If there are broken ships, target those first, select the most broken ships (more than one damaged part)
          const moreBrokenShips = brokenShips.filter(function (ship) {
            return gameUtils.numDamagedParts(ship.parts.length, ship.status) > 1
          }) // Of the broken ships, attack the lowest status ship

          const targetShip = gameUtils.getALowStatusItem(moreBrokenShips.length ? moreBrokenShips : brokenShips) // Get all of the parts which have been hit

          const hitParts = targetShip.parts.filter(function (part) {
            return gameUtils.checkIfHitCell(part.point, victim.board)
          })

          if (moreBrokenShips.length) {
            // If there are more broken ships, attack the parts between hit points first.
            for (let i = 0; i < hitParts.length; ++i) {
              const targetPoints = jDomMatrixCore.testPointsBetween(hitParts[0].point, hitParts[i].point, victim.board, gameUtils.checkIfHitCell, false)

              if (targetPoints.false.length) {
                displayTargets(targetPoints.false, targetPoints.false[0], victim)
                return jDomMatrixCore.getDomItemFromPoint(targetPoints.false[0], victim.board)
              }
            } // If there are no points between, attack the outer points first.

            const pntDiff = jDomMatrixCore.pointDifference(hitParts[0].point, hitParts[1].point)
            const dirPnts = (pntDiff.x > 0 ? [jDomMatrixObjects.point(-1, 0, 0), jDomMatrixObjects.point(1, 0, 0)] : [jDomMatrixObjects.point(0, -1, 0), jDomMatrixObjects.point(0, 1, 0)]).map(function (p, i) {
              return jDomMatrixCore.nextCell(hitParts[(hitParts.length - 1) * i].point, p)
            }).filter(function (p) {
              return jDomMatrixCore.checkValidPoint(p, victim.board)
            }).filter(function (a) {
              return !gameUtils.checkIfHitCell(a, victim.board)
            }) // Check outer points which are valid and not hit.

            const _target = dirPnts.reduce(function (a, b) {
              return gameUtils.checkIfHitCell(a, victim.board) ? b : a
            })

            if (_target) {
              displayTargets(dirPnts, _target, victim)
              return jDomMatrixCore.getDomItemFromPoint(_target, victim.board)
            }
          } // If there is only one hit part, then set that as the lastTarget for detecting adjacent parts.

          availTargets = gameUtils.getAdjEdgeNonHitCells(hitParts[0].point, victim.board)
        }

        const finalTargets = availTargets.length
          ? availTargets
          : gameUtils.getAllNonHitCells(victim.board).filter(function (t) {
            return gameUtils.filterAdjacentPoints(t)
          })
        const target = finalTargets[jDomCore.randomInteger(finalTargets.length)]
        displayTargets(finalTargets, target, victim) // If there are available targets then hit one at random

        return jDomMatrixCore.getDomItemFromPoint(target, victim.board)
      }
      /**
   *
   * @param targets
   * @param target
   * @param victim
   * @returns {Array}
   */

      var displayTargets = function displayTargets (targets, target, victim) {
        return [jDomCore.queueTimeout(resetTargets, 0, {
          targets: targets,
          victim: victim
        }), jDomCore.queueTimeout(resetTargets, 200, {
          targets: targets,
          target: target,
          victim: victim
        })]
      }
      /**
   *
   * @param data
   * @returns {void|Array|Object|*}
   */

      var resetTargets = function resetTargets (data) {
        data.victim.board.children.map(function (l) {
          return jDomCoreDom.updateElement(jDomCore.mergeObjects(l, {
            attributes: {
              style: {
                borderColor: '#333'
              }
            }
          }))
        })
        data.targets.forEach(function (t) {
          return jDomCoreDom.updateElement(jDomCore.mergeObjects(jDomMatrixCore.getDomItemFromPoint(t, data.victim.board), {
            attributes: {
              style: {
                borderColor: '#333'
              }
            }
          }))
        })

        if (!data.target) {
          data.victim.board.children.map(function (l) {
            return jDomCoreDom.updateElement(jDomCore.mergeObjects(l, {
              attributes: {
                style: {
                  borderColor: 'yellow'
                }
              }
            }))
          })
          data.targets.forEach(function (t) {
            return jDomCoreDom.updateElement(jDomCore.mergeObjects(jDomMatrixCore.getDomItemFromPoint(t, data.victim.board), {
              attributes: {
                style: {
                  borderColor: 'yellow'
                }
              }
            }))
          })
        }

        return data
      }
      /**
   * Main AI logic for computer to attack, selects a target then performs attack function.
   * @function computerAttack
   * @param player
   * @param players
   */

      gameActions.computerAttack = function (player, players) {
        const victim = selectTargetPlayer(players.filter(function (p) {
          return !p.attacker
        }))
        gameActions.attackFleet.isLocked = false
        return gameActions.attackFleet(selectTargetCoordinate(victim))
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
    }).call(void 0 || window || {}) // Use the external context to assign this, which will be Window if rendered via browser
  }, { './functions.js': 2, './jDom/core/core.js': 5, './jDom/core/dom/core.js': 6, './jDom/matrix/core.js': 8, './jDom/matrix/objects.js': 9, './layout.js': 18, './pieces.js': 20 }],
  2: [function (require, module, exports) {
    'use strict';

    (function () {
      /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
      const root = this || {}
      /**
   * Store reference to any pre-existing module of the same name
   * @type {gameUtils|*}
   */

      const previousGameUtils = root.gameUtils || {}
      /**
   * A reference to all functions to be used globally / exported
   * @typedef (Object) gameUtils
   * @module game/functions
   */

      const gameUtils = {}
      root.gameUtils = gameUtils
      /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {gameUtils}
   */

      gameUtils.noConflict = function () {
        root.gameUtils = previousGameUtils
        return gameUtils
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
          jDomMatrixCore = require('./jDom/matrix/core.js')
        } else {
          console.error('functions.js requires jDom/matrix/core')
        }
      }
      /**
   * Return the hasShip tile boolean at the specified point.
   * @function checkIfShipCell
   * @param pnt
   * @param matrix
   * @returns {boolean}
   */

      gameUtils.checkIfShipCell = function (pnt, matrix) {
        return matrix.children[pnt.z].children[pnt.y].children[pnt.x].hasShip
      }
      /**
   * Return the isHit tile boolean at the specified point.
   * @function checkIfHitCell
   * @param pnt
   * @param matrix
   * @returns {boolean}
   */

      gameUtils.checkIfHitCell = function (pnt, matrix) {
        return matrix.children[pnt.z].children[pnt.y].children[pnt.x].isHit
      }
      /**
   * Get all points which were not yet hit in the matrix.
   * @function getAllNonHitCells
   * @param matrix
   * @returns {Array}
   */

      gameUtils.getAllNonHitCells = function (matrix) {
        return jDomMatrixCore.getAllPoints(matrix).filter(function (p) {
          return !gameUtils.checkIfHitCell(p, matrix)
        })
      }
      /**
   * Get the points which have same edges with the provided point and are not hit.
   * @function getAdjEdgeNonHitCells
   * @param pnt
   * @param matrix
   * @returns {Array}
   */

      gameUtils.getAdjEdgeNonHitCells = function (pnt, matrix) {
        return jDomMatrixCore.adjacentEdgePoints(pnt, matrix).filter(function (p) {
          return !gameUtils.checkIfHitCell(p, matrix)
        })
      }
      /**
   * Given an array of items, return the item with the lowest status property (at the end of the array)
   * @function getALowStatusItem
   * @param items
   * @returns {Array}
   */

      gameUtils.getALowStatusItem = function (items) {
        return items.reduce(function (a, b) {
          return b.status <= a.status ? b : a
        })
      }
      /**
   * Given an array of items, return all items which have the lowest status property
   * @function getLowStatusItems
   * @param items
   * @returns {Array}
   */

      gameUtils.getLowStatusItems = function (items) {
        return items.filter(function (i) {
          return i.status <= gameUtils.getALowStatusItem(items).status
        })
      }
      /**
   * Given an array of items, return all of the items which have a status less than 100, but more than 0
   * @function getBrokenItems
   * @param items
   * @returns {Array}
   */

      gameUtils.getBrokenItems = function (items) {
        return items.filter(function (i) {
          return i.status < 100 && i.status > 0
        })
      }
      /**
   * Return all of the players which have broken ships.
   * @function getBrokenShipsPlayers
   * @param players
   * @returns {Array}
   */

      gameUtils.getBrokenShipsPlayers = function (players) {
        return players.filter(function (p) {
          return gameUtils.getBrokenItems(p.shipFleet).length
        })
      }
      /**
   * Return the number of damaged ship parts. Performs math on the number of parts vs the damaged status.
   * @function numDamagedParts
   * @param total
   * @param status
   * @returns {number}
   */

      gameUtils.numDamagedParts = function (total, status) {
        return total - Math.ceil(status / 100 * total)
      }
      /**
   * Used to generate 'checkerboard' style attack by only attacking every non-edge-touching cell
   * @function filterAdjacentPoints
   * @param pnt
   * @returns {boolean}
   */

      gameUtils.filterAdjacentPoints = function (pnt) {
        return pnt.z % 2 === 0 && (pnt.x % 2 === 0 && pnt.y % 2 === 0 || pnt.x % 2 !== 0 && pnt.y % 2 !== 0) || pnt.z % 2 !== 0 && (pnt.x % 2 !== 0 && pnt.y % 2 === 0 || pnt.x % 2 === 0 && pnt.y % 2 !== 0)
      }
      /**
   * Either export all functions to be exported, or assign to the Window context
   */

      if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
          exports = module.exports = gameUtils
        }

        exports = Object.assign(exports, gameUtils)
      }
    }).call(void 0 || window || {}) // Use the external context to assign this, which will be Window if rendered via browser
  }, { './jDom/matrix/core.js': 8 }],
  3: [function (require, module, exports) {
    /**
 * @file doubly linked list item.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    'use strict'
    /**
 *
 */

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

    function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor }

    const Linker = /* #__PURE__ */(function () {
      /**
   *
   * @param data
   * @param prev
   * @param next
   * @param LinkerClass
   */
      function Linker () {
        const _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        const _ref$data = _ref.data
        const data = _ref$data === void 0 ? null : _ref$data
        const _ref$prev = _ref.prev
        const prev = _ref$prev === void 0 ? null : _ref$prev
        const _ref$next = _ref.next
        const next = _ref$next === void 0 ? null : _ref$next

        const LinkerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Linker

        _classCallCheck(this, Linker)

        this.LinkerClass = LinkerClass
        this.data = data
        this.prev = prev
        this.next = next
      }
      /**
   *
   * @param node
   * @returns {Linker}
   */

      _createClass(Linker, [{
        key: 'after',
        value: function after (node) {
          if (!node.LinkerClass) {
            if (_typeof(node) !== 'object') {
              node = {
                data: node
              }
            }

            node = new this.LinkerClass(node)
          }

          node.next = this.next
          node.prev = this
          this.next = node

          if (node.next) {
            node.next.prev = node
          }

          return node
        }
        /**
     *
     * @param node
     * @returns {Linker}
     */

      }, {
        key: 'before',
        value: function before (node) {
          if (!node.LinkerClass) {
            if (_typeof(node) !== 'object') {
              node = {
                data: node
              }
            }

            node = new this.LinkerClass(node)
          }

          node.prev = this.prev
          node.next = this
          this.prev = node

          if (node.prev) {
            node.prev.next = node
          }

          return node
        }
      }])

      return Linker
    }())
    /**
 *
 * @param values
 * @param LinkerClass
 * @returns {Linker}
 */

    Linker.fromArray = function () {
      const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
      const LinkerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Linker
      return values.reduce(function (list, element) {
        if (list === null) {
          if (_typeof(element) !== 'object') {
            element = {
              data: element
            }
          }

          return new LinkerClass(Object.assign({}, element, {
            prev: list
          }))
        }

        return Linker.prototype.after.apply(list, [element])
      }, null)
    }

    module.exports = Linker
  }, {}],
  4: [function (require, module, exports) {
    /**
 * @file doubly linked tree item.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    'use strict'

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

    function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor }

    function _inherits (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function') } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass) }

    function _setPrototypeOf (o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) { o.__proto__ = p; return o }; return _setPrototypeOf(o, p) }

    function _createSuper (Derived) { const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget) } else { result = Super.apply(this, arguments) } return _possibleConstructorReturn(this, result) } }

    function _possibleConstructorReturn (self, call) { if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call } return _assertThisInitialized(self) }

    function _assertThisInitialized (self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return self }

    function _isNativeReflectConstruct () { if (typeof Reflect === 'undefined' || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === 'function') return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true } catch (e) { return false } }

    function _getPrototypeOf (o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf (o) { return o.__proto__ || Object.getPrototypeOf(o) }; return _getPrototypeOf(o) }

    const Linker = require('./Linker')

    const TreeLinker = /* #__PURE__ */(function (_Linker) {
      _inherits(TreeLinker, _Linker)

      const _super = _createSuper(TreeLinker)

      /**
   *
   * @param data
   * @param prev
   * @param next
   * @param children
   * @param parent
   * @param LinkerClass
   */
      function TreeLinker () {
        let _this

        const _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        const _ref$data = _ref.data
        const data = _ref$data === void 0 ? null : _ref$data
        const _ref$prev = _ref.prev
        const prev = _ref$prev === void 0 ? null : _ref$prev
        const _ref$next = _ref.next
        const next = _ref$next === void 0 ? null : _ref$next
        const _ref$children = _ref.children
        const children = _ref$children === void 0 ? null : _ref$children
        const _ref$parent = _ref.parent
        const parent = _ref$parent === void 0 ? null : _ref$parent

        const LinkerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TreeLinker

        _classCallCheck(this, TreeLinker)

        _this = _super.call(this, {
          data: data,
          prev: prev,
          next: next
        }, LinkerClass)
        _this.parent = parent
        _this.children = _this.childrenFromArray(children, LinkerClass)
        return _this
      }

      _createClass(TreeLinker, [{
        key: 'childrenFromArray',
        value: function childrenFromArray () {
          const _this2 = this

          const children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
          const LinkerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TreeLinker
          return children !== null
            ? Linker.fromArray.apply(this, [children.map(function (child) {
              return Object.assign({}, child, {
                parent: _this2
              })
            }), LinkerClass])
            : null
        }
      }])

      return TreeLinker
    }(Linker))

    module.exports = TreeLinker
  }, { './Linker': 3 }],
  5: [function (require, module, exports) {
    /**
 * @file All of the core system functions for stringing together functions and simplifying logic.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    'use strict'

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

    function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

    function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen) }

    function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && iter[Symbol.iterator] != null || iter['@@iterator'] != null) return Array.from(iter) }

    function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr) }

    function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2 }

    (function () {
      /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
      const root = this || {}
      /**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */

      const previousJDomCore = root.jDomCore || {}
      /**
   * All methods exported from this module are encapsulated within jDomCore.
   * @author Joshua Heagle <joshuaheagle@gmail.com>
   * @typedef {Object} jDomCore
   * @module jDom/core/core
   */

      const jDomCore = {}
      root.jDomCore = jDomCore
      /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {jDomCore}
   */

      jDomCore.noConflict = function () {
        root.jDomCore = previousJDomCore
        return jDomCore
      }
      /**
   * Return a curried version of the passed function.
   * The returned function expects the same number of arguments minus the ones provided.
   * fn is the name of the function being curried.
   * @function curry
   * @param {function} fn - Receives a function to be curried
   * @returns {function(...[*]): function(...[*])}
   */

      jDomCore.curry = function (fn) {
        return function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key]
          }

          return args.length >= fn.length
            ? fn.apply(void 0, args)
            : function () {
              for (var _len2 = arguments.length, a = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                a[_key2] = arguments[_key2]
              }

              return jDomCore.curry(fn).apply(void 0, [].concat(args, a))
            }
        }
      }
      /**
   * This was copied from a blog post on Composing Software written by Eric Elliott. The idea is to begin to make this
   * code base somewhat easier to parse and introduce point-free notation.
   * @author Eric Elliott
   * @function pipe
   * @param {...function} fns - Takes a series of functions having the same parameter, which parameter is also returned.
   * @returns {function(*=): (*|any)}
   */

      jDomCore.pipe = function () {
        for (var _len3 = arguments.length, fns = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          fns[_key3] = arguments[_key3]
        }

        return function (x) {
          return fns.reduce(function (y, f) {
            return f(y)
          }, x)
        }
      }
      /**
   * Set a value on an item, then return the item
   * @function setValue
   * @param {string|number} key - The key on the item which will have its value set
   * @param {*} value - Any value to be applied to the key
   * @param {Object|Array} item - An object or array to be updated
   * @returns {Object|Array}
   */

      jDomCore.setValue = function (key, value, item) {
        item[key] = value
        return item
      }
      /**
   * Set a value on an item, then return the value
   * @function setAndReturnValue
   * @param {Object|Array} item - An object or array to be updated
   * @param {string|number} key - The key on the item which will have its value set
   * @param {*} value - Any value to be applied to the key
   * @returns {*}
   */

      jDomCore.setAndReturnValue = function (item, key, value) {
        item[key] = value
        return value
      }
      /**
   * Function that produces a property of the new Object, taking three arguments
   * @callback module:jDom/core/core~mapCallback
   * @param {*} currentProperty - The current property being processed in the object.
   * @param {string} [currentIndex] - The property name of the current property being processed in the object.
   * @param {Object|Array} [object] - The object map was called upon.
   * @returns {*}
   */

      /**
   * This function is intended to replicate behaviour of the Array.map() function but for Objects.
   * If an array is passed in instead then it will perform standard map(). It is recommended to
   * always use the standard map() function when it is known that the object is actually an array.
   * @function mapObject
   * @param {Object|Array} obj - The Object (or Array) to be mapped
   * @param {module:jDom/core/core~mapCallback|function} fn - The function to be processed for each mapped property
   * @param {Object|Array} [thisArg] - Optional. Value to use as this when executing callback.
   * @returns {Object|Array}
   */

      jDomCore.mapObject = function (obj, fn) {
        const thisArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined
        return Array.isArray(obj)
          ? obj.map(fn, thisArg)
          : Object.keys(obj).reduce(function (newObj, curr) {
            return jDomCore.setValue(curr, fn.apply(void 0, _toConsumableArray([obj[curr], curr, obj].slice(0, fn.length || 2))), newObj)
          }, thisArg || {})
      }
      /**
   * Perform map on an array property of an object, then return the object
   * @function mapArrayProperty
   * @param {string} property - The string key for the array property to be mapped
   * @param {module:jDom/core/core~mapCallback|function} mapFunction - A function suitable to be passed to map
   * @param {Object|Array} obj - An object having an array property
   * @returns {object}
   */

      jDomCore.mapProperty = function (property, mapFunction, obj) {
        obj[property] = jDomCore.mapObject(obj[property] || [], mapFunction)
        return obj
      }
      /**
   * Function is a predicate, to test each property value of the object. Return true to keep the element, false
   * otherwise, taking three arguments
   * @callback module:jDom/core/core~filterCallback
   * @param {*} currentProperty - The current property being processed in the object.
   * @param {string} [currentIndex] - The property name of the current property being processed in the object.
   * @param {Object|Array} [object] - The object filter was called upon.
   * @returns {boolean}
   */

      /**
   * This function is intended to replicate behaviour of the Array.filter() function but for Objects.
   * If an array is passed in instead then it will perform standard filter(). It is recommended to
   * always use the standard filter() function when it is known that the object is actually an array.
   * @function filterObject
   * @param {Object|Array} obj - The Object (or Array) to be filtered
   * @param {module:jDom/core/core~filterCallback|function} fn - The function to be processed for each filtered property
   * @param {Object|Array} [thisArg] - Optional. Value to use as this when executing callback.
   * @returns {Object|Array}
   */

      jDomCore.filterObject = function (obj, fn) {
        const thisArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined
        return Array.isArray(obj)
          ? obj.filter(fn, thisArg)
          : Object.keys(obj).reduce(function (newObj, curr) {
            if (fn.apply(void 0, _toConsumableArray([obj[curr], curr, obj].slice(0, fn.length || 2)))) {
              newObj[curr] = obj[curr]
            } else {
              delete newObj[curr]
            }

            return newObj
          }, thisArg || {})
      }
      /**
   * Function to execute on each property in the object, taking four arguments
   * @callback module:jDom/core/core~reduceCallback
   * @param {*} [accumulator={}] - The accumulator accumulates the callback's return values; it is the accumulated
   * value previously returned in the last invocation of the callback, or initialValue, if supplied (see below).
   * @param {*} [currentProperty={}] - The current property being processed in the object.
   * @param {string} [currentIndex=0] - The index of the current element being processed in the array. Starts at index
   * 0, if an initialValue is provided, and at index 1 otherwise.
   * @param {Object|Array} [object={}] - The object reduce was called upon.
   * @returns {*}
   */

      /**
   * This function is intended to replicate behaviour of the Array.reduce() function but for Objects.
   * If an array is passed in instead then it will perform standard reduce(). It is recommended to
   * always use the standard reduce() function when it is known that the object is actually an array.
   * @function reduceObject
   * @param {Object|Array} obj - The Object (or Array) to be filtered
   * @param {module:jDom/core/core~reduceCallback|function} fn - The function to be processed for each filtered property
   * @param {Object|Array} [initialValue] - Optional. Value to use as the first argument to the first call of the
   * callback. If no initial value is supplied, the first element in the array will be used. Calling reduce on an empty
   * array without an initial value is an error.
   * @returns {Object|Array}
   */

      jDomCore.reduceObject = function (obj, fn) {
        const initialValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : obj[Object.keys(obj)[0]] || obj[0]
        return Array.isArray(obj)
          ? obj.reduce(fn, initialValue)
          : Object.keys(obj).reduce(function (newObj, curr) {
            return fn.apply(void 0, _toConsumableArray([newObj, obj[curr], curr, obj].slice(0, fn.length || 2)))
          }, initialValue)
      }
      /**
   * Helper function for testing if the item is an Object or Array that contains properties or elements
   * @function notEmptyObjectOrArray
   * @param {Object|Array} item - Object or Array to test
   * @returns {boolean}
   */

      jDomCore.notEmptyObjectOrArray = function (item) {
        return !!(_typeof(item) === 'object' && Object.keys(item).length || Array.isArray(item) && item.length)
      }
      /**
   * Re-add the Object Properties which cannot be cloned and must be directly copied to the new cloned object
   * WARNING: This is a recursive function.
   * @param {Object} cloned - A value-only copy of the original object
   * @param {Object} object - The original object that is being cloned
   * @returns {Object|Array}
   */

      const cloneCopy = function cloneCopy (object, cloned) {
        return jDomCore.notEmptyObjectOrArray(object)
          ? jDomCore.reduceObject(object, function (start, prop, key) {
            start[key] = cloned[key] && !/^(parentItem|listenerArgs|element)$/.test(key) ? cloneCopy(prop, cloned[key]) : prop
            return start
          }, cloned)
          : cloned
      }
      /**
   * Clone objects for manipulation without data corruption, returns a copy of the provided object.
   * @function cloneObject
   * @param {Object} object - The original object that is being cloned
   * @returns {Object}
   */

      jDomCore.cloneObject = function (object) {
        return cloneCopy(object, JSON.parse(JSON.stringify(object, function (key, val) {
          return !/^(parentItem|listenerArgs|element)$/.test(key) ? val : undefined
        })))
      }
      /**
   * Merge two objects and provide clone or original on the provided function.
   * The passed function should accept a minimum of two objects to be merged.
   * If the desire is to mutate the input objects, then the function name should
   * have the word 'mutable' in the name (case-insensitive).
   * @param {module:jDom/core/core.mergeObjects|module:jDom/core/core.mergeObjectsMutable|Function} fn - Pass one of
   * the mergeObjects functions to be used
   * @param {Object} obj1 - The receiving object; this is the object which will have it's properties overridden
   * @param {Object} obj2 - The contributing object; this is the object which will contribute new properties and
   * override existing ones
   * @param {boolean} [isMutable=false] - An optional flag which indicates whether we will clone objects or directly
   * modify them
   * @returns {Object}
   */

      const mergeObjectsBase = function mergeObjectsBase (fn, obj1, obj2) {
        const isMutable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false
        return jDomCore.notEmptyObjectOrArray(obj2)
          ? jDomCore.mapObject(obj2, function (prop, key) {
            return obj1[key] && !/^(parentItem|listenerArgs|element)$/.test(key) ? fn(obj1[key], prop) : prop
          }, isMutable ? obj1 : jDomCore.cloneObject(obj1))
          : obj2
      }
      /**
   * Perform a deep merge of objects. This will combine all objects and sub-objects,
   * objects having the same attributes will overwrite starting from the end of the argument
   * list and bubbling up to return a merged version of the first object.
   * WARNING: This is a recursive function.
   * @function mergeObjects
   * @param {...Object} args - Provide a list of objects which will be merged starting from the end up into the first
   * object
   * @returns {Object}
   */

      jDomCore.mergeObjects = function () {
        for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4]
        }

        return args.length === 2 ? mergeObjectsBase(jDomCore.mergeObjects, args[0], args[1]) : args.length === 1 ? jDomCore.cloneObject(args[0]) : args.reduce(jDomCore.curry(mergeObjectsBase)(jDomCore.mergeObjects), {})
      }
      /**
   * Perform a deep merge of objects. This will combine all objects and sub-objects,
   * objects having the same attributes will overwrite starting from the end of the argument
   * list and bubbling up to return the overwritten first object.
   * WARNING: This is a recursive function.
   * WARNING: This will mutate the first object passed in as input
   * @function mergeObjectsMutable
   * @param {...Object} args - Provide a list of objects which will be merged starting from the end up into the first
   * object
   * @returns {Object}
   */

      jDomCore.mergeObjectsMutable = function () {
        for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          args[_key5] = arguments[_key5]
        }

        return args.length === 2 ? mergeObjectsBase(jDomCore.mergeObjectsMutable, args[0], args[1], true) : args.length === 1 ? args[0] : args.reduce(jDomCore.curry(mergeObjectsBase)(jDomCore.mergeObjectsMutable), {})
      }
      /**
   * Generate an array filled with a copy of the provided item or references to the provided item.
   * The length defines how long the array should be.
   * WARNING: This is a recursive function.
   * @param {boolean} useReference - Choose to multiply by clone or reference, true is by reference
   * @param {*} item - The item to be used for each array element
   * @param {number} length - The desired length of the array
   * @param {Array} [arr=[]] - The in-progress array of elements to be built and returned, will be used internally
   * @returns {Array.<*>}
   */

      const buildArrayBase = function buildArrayBase (useReference, item, length) {
        const arr = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : []
        return --length > 0 ? buildArrayBase(useReference, useReference ? item : jDomCore.cloneObject(item), length, arr.concat([item])) : arr.concat([item])
      }
      /**
   * Leverage buildArrayBase to generate an array filled with a copy of the provided item.
   * The length defines how long the array should be.
   * @function buildArray
   * @param {*} item - The item to be used for each array element
   * @param {number} length - The desired length of the array
   * @param {Array} [arr=[]] - The in-progress array of elements to be built and returned, will be used internally
   * @returns {Array.<*>}
   */

      jDomCore.buildArray = jDomCore.curry(buildArrayBase)(false)
      /**
   * Leverage buildArrayBase to generate an array filled with references to the provided item.
   * The length defines how long the array should be.
   * @function buildArrayOfReferences
   * @param {*} item - The item to be used for each array element
   * @param {number} length - The desired length of the array
   * @param {Array} [arr=[]] - The in-progress array of elements to be built and returned, will be used internally
   * @returns {Array.<*>}
   */

      jDomCore.buildArrayOfReferences = jDomCore.curry(buildArrayBase)(true)
      /**
   * A simple function to check if an item is in an array
   * @function inArray
   * @param {Array} arr - Haystack which may contain the specified property
   * @param {*} prop - Needle to be found within the haystack
   * @returns {boolean}
   */

      jDomCore.inArray = function (arr, prop) {
        return arr.indexOf(prop) >= 0
      }
      /**
   * Helper for returning the absolute max value
   * @function getAbsoluteMax
   * @param {number} num1 - A number to compare
   * @param {number} num2 - Another number to be compared against
   * @returns {number}
   */

      jDomCore.getAbsoluteMax = function (num1, num2) {
        return Math.abs(num1) > Math.abs(num2) ? num1 : num2
      }
      /**
   * Helper for returning the absolute min value
   * @function getAbsoluteMin
   * @param {number} num1 - A number to compare
   * @param {number} num2 - Another number to be compared against
   * @returns {number}
   */

      jDomCore.getAbsoluteMin = function (num1, num2) {
        return Math.abs(num1) < Math.abs(num2) ? num1 : num2
      }
      /**
   * Create a single random number within provided range. And with optional offset,
   * The distance between the result numbers can be adjusted with interval.
   * @function randomNumber
   * @param {number} range - Choose the breadth of the random number (0-100 would be 100 for range)
   * @param {number} [offset=0] - Choose the starting number (1-10 would be 1 for offset, 9 for range)
   * @param {number} [interval=1] - Choose the distance between numbers (~5, ~10, ~15 would be 5 for interval, 1 for
   * offset, 2 for range)
   * @returns {number}
   */

      jDomCore.randomNumber = function (range) {
        const offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0
        const interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1
        return (Math.random() * range + offset) * interval
      }
      /**
   * Create a single random integer within provide range. And with optional offset,
   * The distance between the result numbers can be adjusted with interval.
   * @function randomInteger
   * @param {number} range - Choose the breadth of the random number (0-100 would be 100 for range)
   * @param {number} [offset=0] - Choose the starting number (1-10 would be 1 for offset, 9 for range)
   * @param {number} [interval=1] - Choose the distance between numbers (5, 10, 15 would be 5 for interval, 1 for
   * offset, 2 for range)
   * @returns {number}
   */

      jDomCore.randomInteger = function (range) {
        const offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0
        const interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1
        return (Math.floor(Math.random() * range) + offset) * interval
      }
      /**
   * Compare two numbers and return:
   * -1 to indicate val1 is less than val2
   * 0 to indicate both values are the equal
   * 1 to indicate val1 is greater than val2
   * @function compare
   * @param {number} val1 - The first number to compare
   * @param {number} val2 - The second number to compare
   * @returns {number}
   */

      jDomCore.compare = function (val1, val2) {
        return val1 === val2 ? 0 : val1 > val2 ? 1 : -1
      }
      /**
   * Compare two Arrays and return the Object where the value for each property is as follows:
   * -1 to indicate val1 is less than val2
   * 0 to indicate both values are the equal
   * 1 to indicate val1 is greater than val2
   * The returned Object uses the element values as the property names
   * This functions works by first creating a concatenated array of all unique values. Then for each unique values,
   * convert to a string and use it as a new property name. Array filter each array checking if it has the unique value.
   * Use the lengths of these filtered arrays to compare. So if the first array has the value and the second one doesn't
   * the first length will be one or more and the second will be zero, if the both have the value then both will be one
   * or more.
   * @example
   * // example of input and resulting output
   * jDomCore.compareArrays(
   *   ['match1', 'firstMismatch1', 'match2', 'firstMismatch2', 'badMatch1'],
   *   ['match1', 'match2', 'secondMismatch1', 'badMatch1', 'badMatch1']
   * )
   * // unique array
   * ['secondMismatch1', 'match1', 'firstMismatch1', 'match2', 'firstMismatch2', 'badMatch1']
   * // result object
   * {secondMismatch1: -1, match1: 0, firstMismatch1: 1, match2: 0, firstMismatch2: 1, badMatch1: -1}
   * @function compareArrays
   * @param {Array} arr1 - The first array to compare
   * @param {Array} arr2 - The second array to compare
   * @returns {Object.<string, number>}
   */

      jDomCore.compareArrays = function (arr1, arr2) {
        return arr2.filter(function (attr) {
          return !jDomCore.inArray(arr1, attr)
        }).concat(arr1).reduce(function (returnObj, attr) {
          return jDomCore.setValue(typeof attr === 'string'
            ? attr
            : JSON.stringify(attr, function (key, val) {
              return !/^(parentItem|listenerArgs|element)$/.test(key) ? val : undefined
            }), jDomCore.compare(arr1.filter(function (val) {
            return val === attr
          }).length, arr2.filter(function (val) {
            return val === attr
          }).length), returnObj)
        }, {})
      }
      /**
   * This was adapted from a blog post on Composing Software written by Eric Elliott. Trace provides a way to traces
   * steps through code via the console, while maintaining the functional-style return value.
   * Returns a function which can then receive a value to output, the value will then be returned.
   * @author Eric Elliott
   * @function trace
   * @param {string} label - Pass an identifying label of the value being output.
   * @returns {function(*=)}
   */

      jDomCore.trace = function (label) {
        return function (value) {
          console.info(''.concat(label, ': '), value)
          return value
        }
      }
      /**
   * Run Timeout functions one after the other in queue. This function needs some work to comply with the standards
   * applied to the rest of this file where this is not a Pure function, and it does not reliably return a result. This
   * implementation should likely be used with Promise instead.
   * WARNING: This is a recursive function.
   * @function queueTimeout
   * @param {function|object|boolean} fn - A callback function to be performed at some time in the future.
   * @param {number} time - The time in milliseconds to delay.
   * @param {...*} args - Arguments to be passed to the callback once it is implemented.
   * @returns {{id: number, func: function, timeout: number, args: {Array}, result: *}}
   */

      jDomCore.queueTimeout = function () {
        const fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        const time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0
        // Track the queue to be processed in FIFO
        jDomCore.queueTimeout.queue = jDomCore.queueTimeout.queue || [] // Do not run more than one queued item at a time

        jDomCore.queueTimeout.isRunning = jDomCore.queueTimeout.isRunning || false // Construct an object which will store the queued function data

        for (var _len6 = arguments.length, args = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
          args[_key6 - 2] = arguments[_key6]
        }

        const queueItem = {
          id: 0,
          func: fn,
          timeout: time,
          args: args,
          result: 0
        }

        if (fn) {
          // When the function is valid, append it to the end of the queue
          jDomCore.queueTimeout.queue.push(queueItem)
        }

        if (jDomCore.queueTimeout.queue.length && !jDomCore.queueTimeout.isRunning) {
          // Check that the queue is not empty, and it is not running a queued item
          // Set isRunning flag to begin processing the next queued item
          jDomCore.queueTimeout.isRunning = true // Pick an item off the front of the queue, and thereby reduce the queue size

          const toRun = jDomCore.queueTimeout.queue.shift() // Get the timeout ID when it has begun

          toRun.id = setTimeout(function () {
            // Run the function after the provided timeout
            toRun.result = toRun.func.apply(toRun, _toConsumableArray(toRun.args)) // Reset isRunning flag

            jDomCore.queueTimeout.isRunning = false // Re-run the queue which will get the next queued item if there is one

            return jDomCore.queueTimeout(false)
          }, toRun.timeout) // Return whatever object we have for the current queued item being processed, likely incomplete because the
          // function will complete in the future

          return toRun
        } // Return newly created queuedItem

        return queueItem
      }
      /**
   * Either export all functions to be exported, or assign to the Window context
   */

      if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
          exports = module.exports = jDomCore
        }

        exports = Object.assign(exports, jDomCore)
      }
    }).call(void 0 || window || {}) // Use the external context to assign this, which will be Window if rendered via browser
  }, {}],
  6: [function (require, module, exports) {
    /**
 * @file Core Dom management functions
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    'use strict'

    function _defineProperty (obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }) } else { obj[key] = value } return obj }

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    (function () {
      /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
      let root = this || {}
      /**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */

      const previousJDomCoreDom = root.jDomCoreDom || {}
      /**
   * All methods exported from this module are encapsulated within jDomCoreDom.
   * @author Joshua Heagle <joshuaheagle@gmail.com>
   * @typedef {Object} jDomCoreDom
   * @module jDom/core/dom/core
   */

      const jDomCoreDom = {}
      root.jDomCoreDom = jDomCoreDom
      /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {jDomCoreDom}
   */

      jDomCoreDom.noConflict = function () {
        root.jDomCoreDom = previousJDomCoreDom
        return jDomCoreDom
      }
      /**
   * Verify availability of document
   * @typedef {HTMLDocument|module:jDom/pseudoDom/objects.PseudoHTMLDocument} document
   */

      let document = root.document
      /**
   * If document remains undefined, attempt to retrieve it as a module
   */

      if (typeof document === 'undefined') {
        if (typeof require !== 'undefined') {
          // noinspection JSUnresolvedFunction

          /**
       * @see module:jDom/pseudoDom/objects.generate
       * @typedef {Window|module:jDom/pseudoDom/objects.PseudoEventTarget} root
       */
          root = require('../../pseudoDom/objects.js').generate(root)
          document = root.document
        } else {
          console.error('jDom/core/dom/core requires jDom/pseudoDom/objects')
        }
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
          jDomCore = require('../core.js')
        } else {
          console.error('jDom/core/dom/core requires jDom/core/core')
        }
      }
      /**
   * Verify availability of jDomCore
   * @typedef {*|module:jDom/core/dom/objects} jDomObjects
   */

      let jDomObjects = root.jDomObjects
      /**
   * If jDomObjects remains undefined, attempt to retrieve it as a module
   */

      if (typeof jDomObjects === 'undefined') {
        if (typeof require !== 'undefined') {
          jDomObjects = require('./objects.js')
        } else {
          console.error('jDom/core/dom/core requires jDom/core/dom/objects')
        }
      }
      /**
   * Check if the provided Element has the provided attributes.
   * Returns a boolean, or an array of 1 / 0 / -1 based on the comparison status.
   * @function elementHasAttribute
   * @param {HTMLElement|module:jDom/pseudoDom/objects.PseudoHTMLElement} element - Receive the element to be assessed
   * @param {string} key - The attribute name to search for
   * @param {string|Object} attr - The expected value of the attribute to compare against
   * @returns {boolean|Object.<string, number>}
   */

      jDomCoreDom.elementHasAttribute = function (element, key, attr) {
        if (!element.style) {
          // if element is not a valid element then return false
          return false
        }

        if (/^(style|className)$/.test(key)) {
          // For attributes which are objects or multi-part strings
          // -1 = remove attribute, 0 = no change, 1 = add attribute
          return jDomCore.compareArrays(typeof attr === 'string' ? attr.split(' ') : Object.keys(attr), typeof attr === 'string' ? element[key].split(' ') : Object.keys(element[key]))
        } // Check that the key is a property of the element
        // Compare current to new one

        return element.hasAttribute(key) && element.getAttribute(key) === attr
      }
      /**
   * Check if a class exists on the element, return object with keys for each class and a -1, 0, 1 difference indicator.
   * @param {HTMLElement|module:jDom/pseudoDom/objects.PseudoHTMLElement} element - Provide an element to check classes
   * on.
   * @param {string} classes - A string of classes (like the content of the 'class' attribute) to be compared
   * @returns {Object<string, number>|*}
   */

      jDomCoreDom.elementCompareClassList = function (element, classes) {
        return jDomCore.compareArrays(classes.split(' '), [].from(element.classList))
      }
      /**
   * Given a jDomObjects.DomItem as config, this function will return the changes to be applied
   * to the stored element property.
   * @function elementChanges
   * @param {module:jDom/core/dom/objects.DomItem} config - The DomItem having config changes to be applied to its
   * element
   * @returns {module:jDom/core/dom/objects.DomItem}
   */

      jDomCoreDom.elementChanges = function (config) {
        return config.element.tagName.toLowerCase() !== config.tagName.toLowerCase() // Generate a new element since the tag has changed
          ? jDomCoreDom.generateElement(config) // Remove all the similarities
          : jDomCore.setValue('attributes', jDomCore.filterObject(config.attributes, // For each attribute, check if it becomes true / false based on the comparison results
            function (attr1, key1) {
              return jDomCore.filterObject( // Get attributes as object of truthy and falsy values
                jDomCore.mapObject(config.attributes, function (attr2, key2) {
                  return _typeof(attr2) === 'object' || key2 === 'className' // Apply custom logic for class and styles, only keep the updates
                    ? jDomCore.filterObject(jDomCoreDom.elementHasAttribute(config.element, key2, attr2), function (attr3) {
                      return attr3 === 1
                    }) // True when the element does not already have the attribute
                    : !jDomCoreDom.elementHasAttribute(config.element, key2, attr2)
                }), // Remove when the attr4 value is 0 or false, or not empty object
                function (attr4) {
                  return !!attr4
                })[key1]
            }), config)
      }
      /**
   * Set an attribute on the element within a DomItem, then return the config data.
   * @function setAttribute
   * @param {module:jDom/core/dom/objects.DomItem} config - The DomItem having config changes to be applied to its
   * element
   * @param {string} name - The attribute name to be updated
   * @param {string} value - The new value to be applied to the attribute
   * @returns {module:jDom/core/dom/objects.DomItem}
   */

      jDomCoreDom.setAttribute = function (config, name, value) {
        config.element.setAttribute(name, value)
        return config
      }
      /**
   * Set an attribute on the element within a DomItem, then return the attribute.
   * @function setAndReturnAttribute
   * @param {module:jDom/core/dom/objects.DomItem} config - The DomItem having config changes to be applied to its
   * element
   * @param {string} name - The attribute name to be updated
   * @param {string} value - The new value to be applied to the attribute
   * @returns {string}
   */

      jDomCoreDom.setAndReturnAttribute = function (config, name, value) {
        config.element.setAttribute(name, value)
        return value
      }
      /**
   * Update a single jDomObjects.DomItem element with the provided attributes / style / elementProperties
   * @function updateElement
   * @param {module:jDom/core/dom/objects.DomItem} config - The DomItem having config changes to be applied to its
   * element
   * @returns {module:jDom/core/dom/objects.DomItem}
   */

      jDomCoreDom.updateElement = function (config) {
        return !config.element.style // if element is not a valid element then return the config without changes
          ? config // Set the the current attributes to contain all the changes
          : jDomCore.setValue('attributes', jDomCore.mapObject( // Retrieve only the changes to be applied from the attributes
            jDomCoreDom.elementChanges(config).attributes, function (attr, key) {
              return jDomCore.notEmptyObjectOrArray(attr) ? jDomCore.mapObject(jDomCore.filterObject( // Remove attributes which have a numeric key (these are unwanted styles stored on elements)
                attr, function (param, k) {
                  return /^\D+$/.test(k)
                }), function (p, i) {
                return jDomCore.setAndReturnValue(config.element.style, i, p)
              }, config.element.style) : key in config.element ? jDomCore.setAndReturnValue(config.element, key, attr) : jDomCoreDom.setAndReturnAttribute(config, key, attr)
            }), config)
      }
      /**
   * Generate HTML element data for each object in the matrix
   * WARNING: This is a recursive function.
   * @function updateElements
   * @param {module:jDom/core/dom/objects.DomItem} config - The DomItem having child DomItems with config changes to be
   * applied
   * @returns {module:jDom/core/dom/objects.DomItem}
   */

      jDomCoreDom.updateElements = function (config) {
        return jDomCore.mapProperty('children', function (child) {
          return jDomCoreDom.updateElements(child)
        }, jDomCoreDom.updateElement(config))
      }
      /**
   * Create an HTML element based on the provided attributes and return the element as an Object.
   * @function generateElement
   * @param {module:jDom/core/dom/objects.DomItem} config - The DomItem requiring matching HTML element property
   * @return {module:jDom/core/dom/objects.DomItem}
   */

      jDomCoreDom.generateElement = function (config) {
        return jDomCoreDom.updateElement(jDomCore.setValue('element', document.createElement(config.tagName), config))
      }
      /**
   * Generate HTML element data for a provided DomItem
   * @function bindElement
   * @param {module:jDom/core/dom/objects.DomItem} item - The DomItem needing element to be generated
   * @return {module:jDom/core/dom/objects.DomItem}
   */

      jDomCoreDom.bindElement = function (item) {
        return jDomCore.setValue('element', !item.element || !item.element.style ? jDomCoreDom.generateElement(item).element : item.element, item)
      }
      /**
   * Simplify detecting the parent item which can be appended to, whether root, or just a parent at any part of the tree
   * @param {
   * module:jDom/core/dom/objects.DomItemRoot|module:jDom/core/dom/objects.DomItem
   * } parent - A parent DomItem which may or may not have a body
   * @returns {module:jDom/core/dom/objects.DomItemBody|module:jDom/core/dom/objects.DomItem}
   */

      const retrieveParentItem = function retrieveParentItem (parent) {
        return parent.body ? parent.body : parent
      }
      /**
   * Having an array and a potential new array element, check if the element is in the array, if not append to array.
   * @param {module:jDom/core/dom/objects.DomItem|*} item - An potential array element, possibly a DomItem
   * @param {Array} array - An array where an element may be appended.
   * @returns {Array|Buffer|*|T[]|string}
   */

      const addUniqueToArray = function addUniqueToArray (item, array) {
        return !jDomCore.inArray(array, item) ? array.concat([item]) : array
      }
      /**
   * Provide a DomItem to be appended to a parent item, return the DomItem.
   * @param {module:jDom/core/dom/objects.DomItem} child - A DomItem to be appended
   * @param {module:jDom/core/dom/objects.DomItem} parent - A parent item to have a new child appended
   * @returns {module:jDom/core/dom/objects.DomItem}
   */

      const appendAndReturnChild = function appendAndReturnChild (child) {
        const parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : jDomObjects.documentItem.body
        retrieveParentItem(parent).element.appendChild(child.element)
        return child
      }
      /**
   * Append a new DomItem which has the element generated.
   * @function appendHTML
   * @param {module:jDom/core/dom/objects.DomItem} item - A new DomItem to append
   * @param {module:jDom/core/dom/objects.DomItem} parent - The parent to have DomItems appended
   * @returns {module:jDom/core/dom/objects.DomItem}
   */

      jDomCoreDom.appendHTML = function (item) {
        const parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : jDomObjects.documentItem.body
        return appendAndReturnChild(jDomCoreDom.bindElement(item), jDomCore.setValue('children', addUniqueToArray(item, retrieveParentItem(parent).children), retrieveParentItem(parent)))
      }
      /**
   * Reverse of appendHTML, remove a DomItem and have the associated element removed.
   * @function removeChild
   * @param {module:jDom/core/dom/objects.DomItem} item - The DomItem with HTMLElement to be removed
   * @param {module:jDom/core/dom/objects.DomItem} parent - The parent of the items
   * @returns {Array.<HTMLElement|PseudoHTMLElement>}
   */

      jDomCoreDom.removeChild = function (item) {
        const parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : jDomObjects.documentItem.body
        parent.element.removeChild(item.element)
        return parent.children.splice(parent.children.indexOf(item), 1)
      }
      /**
   * Register a single listener function as part of the root jDomObjects.DomItem.
   * @function registerListener
   * @param {module:jDom/core/dom/objects~listenerFunction|function} listener - Provide a function which will be called
   * when a Dom event is triggered.
   * @param {string} [name] - The name of the listener to be used.
   * @param {module:jDom/core/dom/objects.DomItemRoot|Object} [parent] - The parent DomItem which is DomItemRoot which
   * stores has eventListeners property.
   * @returns {Object.<string, module:jDom/core/dom/objects~listenerFunction>}
   */

      jDomCoreDom.registerListener = function (listener) {
        const name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : listener.name
        const parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : jDomObjects.documentItem
        return Object.assign(parent.eventListeners, _defineProperty({}, name, listener))
      }
      /**
   * Register multiple listeners from an array of functions.
   * @function registerListeners
   * @param {Array.<module:jDom/core/dom/objects~listenerFunction|function>} listeners - An array of functions to be
   * used as the registered event listeners.
   * @param {module:jDom/core/dom/objects.DomItemRoot|Object} [parent] - The parent DomItem which is DomItemRoot which
   * stores has eventListeners property.
   * @returns {module:jDom/core/dom/objects.DomItemRoot|Object}
   */

      jDomCoreDom.registerListeners = function (listeners) {
        const parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : jDomObjects.documentItem
        return jDomCore.mergeObjects(parent, {
          eventListeners: parent.eventListeners
        }, {
          eventListeners: listeners
        })
      }
      /**
   * Based on the provided function / listener name, retrieve the associated function from the root jDomObjects.DomItem
   * @function retrieveListener
   * @param {string} listenerName - The name of one of the registered listener functions.
   * @param {module:jDom/core/dom/objects.DomItemRoot|Object} [parent] - The parent DomItem which is DomItemRoot which
   * stores has eventListeners property.
   * @returns {module:jDom/core/dom/objects~listenerFunction|function|Object}
   */

      jDomCoreDom.retrieveListener = function (listenerName) {
        const parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : jDomObjects.documentItem
        return jDomCore.inArray(Object.keys(parent.eventListeners), listenerName) ? parent.eventListeners[listenerName] : {}
      }
      /**
   * Provide compatibility for using the options parameter of addEventListener
   * @param {module:jDom/core/dom/objects.EventListenerOptions} options - An object or boolean with the listener options
   * @returns {boolean}
   */

      const listenerOptions = function listenerOptions (options) {
        if (typeof listenerOptions.supportsOptions === 'undefined') {
          // Check if supportsOptions has been defined. This is a compatibility checking flag.
          listenerOptions.supportsOptions = true

          try {
            // If it is possible to use OptionsObject, then set our flag to true
            window.addEventListener('test', null, {
              capture: false,
              once: false,
              passive: false
            })
          } catch (err) {
            // When using an OptionsObjects fails, it is only possible to pass the boolean UseCapture as the option
            listenerOptions.supportsOptions = false
          }
        }

        return _typeof(options) === 'object' && listenerOptions.supportsOptions ? options : false
      }
      /**
   * Provide compatibility for assigning listeners.
   * @function assignListener
   * @param {string} trigger - The name of the event which will trigger the listenerFunction on the element.
   * @param {HTMLElement|module:jDom/pseudoDom/objects~PseudoHTMLElement} elem - An element to append the listener onto
   * @param {module:jDom/core/dom/objects~listenerFunction|function} fn - The function which will be invoked when the
   * event is triggered
   * @param {module:jDom/core/dom/objects.EventListenerOptions} options - Additional options to how the event will be
   * fired
   * @returns {module:jDom/core/dom/objects~listenerFunction|function}
   */

      jDomCoreDom.assignListener = function (trigger, elem, fn, options) {
        // Attaching a listener may be done differently based on the browser support
        if (elem.addEventListener) {
          // Latest support is provided fro addEventListener with the options parameter varying slightly
          elem.addEventListener(trigger, fn, listenerOptions(options))
        } else if (elem.attachEvent) {
          // Older browsers, especially Internet Explorer
          elem.attachEvent('on'.concat(trigger), fn)
        } else {
          // General support for adding a new function onto the element which can be called to trigger the function
          elem['on'.concat(trigger)] = fn
        }

        return fn
      }
      /**
   * When there may be extra data needed for the event listener function call, this function may be used as a helper
   * to pass the additional data. Also, if it is desirable to add event listeners during run-time, this function can be
   * used to achieve this.
   * WARNING: This is a recursive function.
   * @function appendListeners
   * @param {module:jDom/core/dom/objects.DomItem} item - The DomItem which will have its eventListeners updated.
   * @param {string} event - The string name of the event trigger type to be added.
   * @param {string} listener - The name of the function to be called once the event is triggered.
   * @param {Object} args - Additional arguments to be used in the listener function.
   * @param {module:jDom/core/dom/objects.EventListenerOptions} options - The strategy used when the event is triggered.
   * @returns {module:jDom/core/dom/objects.DomItem}
   */

      jDomCoreDom.appendListeners = function (item, event, listener) {
        const args = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {}
        const options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false
        return jDomCore.mapProperty('children', function (i) {
          return jDomCoreDom.appendListeners(i, event, listener, args, options)
        }, jDomCore.setValue('eventListeners', jDomCore.setValue(event, {
          listenerFunc: listener,
          listenerArgs: args,
          listenerOptions: options
        }, item.eventListeners), item))
      }
      /**
   * Receive a DomItem with eventListeners and apply the event listeners onto the Dom element.
   * @param {module:jDom/core/dom/objects.DomItem} item - The DomItem which has eventListeners to apply to its element
   * @returns {module:jDom/core/dom/objects.DomItem}
   */

      const bindElementListeners = function bindElementListeners (item) {
        return jDomCore.mapProperty('eventListeners', function (attr, event) {
          return jDomCoreDom.assignListener(event, item.element, function (e) {
            return attr.listenerFunc(e, item, attr.listenerArgs)
          }, attr.listenerOptions)
        }, item)
      }
      /**
   * Based on the eventListeners property of the provided item, bind the
   * listeners to the associated element property for the provided jDomObjects.DomItem.
   * @function bindListeners
   * @param {module:jDom/core/dom/objects.DomItem} item - The DomItem which may have eventListeners to apply to its
   * element
   * @returns {module:jDom/core/dom/objects.DomItem}
   */

      jDomCoreDom.bindListeners = function (item) {
        return item.eventListeners && Object.keys(item.eventListeners).length && item.element.style ? bindElementListeners(item) : item
      }
      /**
   * Based on the eventListeners property of the provided item, bind the listeners to the associated element property
   * for each item in the jDomObjects.DomItem structure.
   * WARNING: This is a recursive function.
   * @function bindAllListeners
   * @param {module:jDom/core/dom/objects.DomItem} item - The DomItem with an associated HTMLElement to have a listener
   * assigned
   * @returns {module:jDom/core/dom/objects.DomItem}
   */

      jDomCoreDom.bindAllListeners = function (item) {
        return jDomCore.mapProperty('children', function (i) {
          return jDomCoreDom.bindAllListeners(i)
        }, jDomCoreDom.bindListeners(item))
      }
      /**
   * To be used with jDomCoreDom.gatherChildItems which will start at item and recurse over all child items, this test
   * will then choose which child items will be returned as the result of the test.
   * @callback module:jDom/core/dom/core~testChildItem
   * @param {module:jDom/core/dom/objects.DomItem|Object} item - The DomItem is the child being tested
   * @param {Array.<module:jDom/core/dom/objects.DomItem>} gatheredResults - All of the child items gathered based on
   * the test
   * @returns {Array.<module:jDom/core/dom/objects.DomItem>}
   */

      /**
   * A selector function for retrieving existing child jDomObjects.DomItems from the given parent item.
   * This function will check all the children starting from and including item, and run the test function on each
   * child encountered. The return array contains children returned from the test from all levels.
   * WARNING: This is a recursive function.
   * @function gatherChildItems
   * @param {module:jDom/core/dom/objects.DomItem} item - The DomItem which may have child items matching the attribute
   * criteria
   * @param {module:jDom/core/dom/core~testChildItem} test - Assess each child, and return the ones which qualify
   * @returns {Array.<module:jDom/core/dom/objects.DomItem>}
   */

      jDomCoreDom.gatherChildItems = function (item, test) {
        return test(item, item.children.reduce(function (a, b) {
          return a.concat(jDomCoreDom.gatherChildItems(b, test))
        }, []))
      }
      /**
   * Retrieve the {@link module:jDom/core/dom/core~testChildItem} function by providing an attribute and value to check.
   * @param {string} attr - Provide the attribute name to be searched
   * @param {*} value - The attribute value to be compared
   * @returns {module:jDom/core/dom/core~testChildItem}
   */

      const getChildTest = function getChildTest (attr, value) {
        return function (item, gatheredResults) {
          return item.attributes[attr] && item.attributes[attr] === value ? gatheredResults.concat([item]) : gatheredResults
        }
      }
      /**
   * A selector function for retrieving existing child jDomObjects.DomItems from the given parent item.
   * This function will check all the children starting from item, and scan the attributes
   * property for matches. The returned array contains children matching from all levels.
   * WARNING: This calls a recursive function.
   * @function getChildrenFromAttribute
   * @param {string} attr - Provide the attribute name to be searched
   * @param {*} value - The attribute value to be compared
   * @param {module:jDom/core/dom/objects.DomItem} item - The DomItem which may have child items matching the attribute
   * criteria
   * @returns {Array.<module:jDom/core/dom/objects.DomItem>}
   */

      jDomCoreDom.getChildrenFromAttribute = function (attr, value) {
        const item = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : jDomObjects.documentItem.body
        return jDomCoreDom.gatherChildItems(item, getChildTest(attr, value))
      }
      /**
   * Helper for getting all jDomObjects.DomItems starting at parent and having specified className attribute
   * @function getChildrenByClass
   * @returns {module:jDom/core/dom/objects.DomItem[]}
   */

      jDomCoreDom.getChildrenByClass = jDomCore.curry(jDomCoreDom.getChildrenFromAttribute)('className')
      /**
   * Helper for getting all jDomObjects.DomItems starting at parent and having specified name attribute
   * @function getChildrenByName
   * @returns {module:jDom/core/dom/objects.DomItem[]}
   */

      jDomCoreDom.getChildrenByName = jDomCore.curry(jDomCoreDom.getChildrenFromAttribute)('name')
      /**
   * A selector function for retrieving existing child jDomObjects.DomItems from the given parent item.
   * This function will check all the children starting from item, and scan the attributes
   * property for matches. The return array contains children matching from all levels.
   * WARNING: This is a recursive function.
   * @function getParentsFromAttribute
   * @param {string} attr - Provide the attribute name to be searched
   * @param {*} value - The attribute value to be compared
   * @param {module:jDom/core/dom/objects.DomItem} item - The DomItem which may have parent items matching the
   * attribute criteria
   * @returns {Array}
   */

      jDomCoreDom.getParentsFromAttribute = function (attr, value) {
        const item = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : jDomObjects.documentItem.body
        return Object.keys(item.parentItem).length ? (item.parentItem.attributes[attr] || item[attr] || false) === value ? jDomCoreDom.getParentsFromAttribute(attr, value, item.parentItem).concat([item.parentItem]) : jDomCoreDom.getParentsFromAttribute(attr, value, item.parentItem) : []
      }
      /**
   * Helper for getting all jDomObjects.DomItems starting at child and having specified className attribute
   * @function getParentsByClass
   * @returns {Array}
   */

      jDomCoreDom.getParentsByClass = jDomCore.curry(jDomCoreDom.getParentsFromAttribute)('className')
      /**
   * Helper for getting all jDomObjects.DomItems starting at child and having specified name attribute
   * @function getParentsByName
   * @returns {Array}
   */

      jDomCoreDom.getParentsByName = jDomCore.curry(jDomCoreDom.getParentsFromAttribute)('name')
      /**
   * Helper for getting all jDomObjects.DomItems starting at child and having specified tagName
   * @function getParentsByTagName
   * @returns {Array}
   */

      jDomCoreDom.getParentsByTagName = jDomCore.curry(jDomCoreDom.getParentsFromAttribute)('tagName')
      /**
   * Get the upper parentItem for the provided child. (usually this is a jDomObjects.documentItem reference)
   * WARNING: This is a recursive function.
   * @function getTopParentItem
   * @param {module:jDom/core/dom/objects.DomItem} item - The DomItem which we want the highest parent item of
   * @returns {module:jDom/core/dom/objects.DomItemRoot}
   */

      jDomCoreDom.getTopParentItem = function (item) {
        return Object.keys(item.parentItem).length ? jDomCoreDom.getTopParentItem(item.parentItem) : item
      }
      /**
   * This is a shortcut for building the specified HTML elements and appending them to the Dom
   * with associated listeners.
   * The final argument is specific for adding event listeners with options.
   * @function renderHTML
   * @param {module:jDom/core/dom/objects.DomItem} item - The DomItem that we want to render the element for
   * @param {module:jDom/core/dom/objects.DomItemRoot} parent - The Base Dom item which is the parent of all the items
   * @returns {module:jDom/core/dom/objects.DomItem}
   */

      jDomCoreDom.renderHTML = function (item) {
        const parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : jDomObjects.documentItem
        return jDomCore.pipe(function (domItem) {
          return jDomCore.setValue('element', domItem.element && domItem.element.style ? domItem.element : jDomCoreDom.bindElement(domItem).element, domItem)
        }, function (domItem) {
          return jDomCore.setValue('eventListeners', jDomCore.mapObject(domItem.eventListeners, function (prop) {
            return jDomCore.mergeObjects(prop, {
              listenerFunc: jDomCoreDom.retrieveListener(prop.listenerFunc, jDomCoreDom.getTopParentItem(parent))
            })
          }), domItem)
        }, jDomCore.curry(jDomCore.setValue)('parentItem', parent.body || parent), function (domItem) {
          return jDomCoreDom.bindListeners(jDomCoreDom.appendHTML(domItem, parent))
        }, function (domItem) {
          return jDomCore.mapProperty('children', function (child) {
            return jDomCoreDom.renderHTML(child, domItem)
          }, domItem)
        })(jDomCore.mapObject(jDomObjects.createDomItem(item), function (prop) {
          return prop
        }, item))
      }
      /**
   * Either export all functions to be exported, or assign to the Window context
   */

      if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
          exports = module.exports = jDomCoreDom
        }

        exports = Object.assign(exports, jDomCoreDom)
      }
    }).call(void 0 || window || {}) // Use the external context to assign this, which will be Window if rendered via browser
  }, { '../../pseudoDom/objects.js': 17, '../core.js': 5, './objects.js': 7 }],
  7: [function (require, module, exports) {
    /**
 * @file Core objects for representing the DOM in JSON.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    'use strict';

    (function () {
      /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
      let root = this || {}
      /**
   * Verify availability of document
   * @typedef {HTMLDocument|module:jDom/pseudoDom/objects.PseudoHTMLDocument} document
   */

      let document = root.document
      /**
   * If document remains undefined, attempt to retrieve it as a module
   */

      if (!Object.keys(root).length) {
        if (typeof require !== 'undefined') {
          // noinspection JSUnresolvedFunction

          /**
       * @see module:jDom/pseudoDom/objects.generate
       * @typedef {Window|module:jDom/pseudoDom/objects.PseudoEventTarget} root
       */
          root = require('../../pseudoDom/objects.js').generate(root)
          document = root.document
        } else {
          console.error('objects.js requires jDom/pseudoDom/objects')
        }
      }
      /**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */

      const previousJDomObjects = root.jDomObjects || {}
      /**
   * All methods exported from this module are encapsulated within jDomObjects
   * @author Joshua Heagle <joshuaheagle@gmail.com>
   * @typedef {Object} jDomObjects
   * @module jDom/core/dom/objects
   */

      const jDomObjects = {}
      root.jDomObjects = jDomObjects
      /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {jDomObjects}
   */

      jDomObjects.noConflict = function () {
        root.jDomObjects = previousJDomObjects
        return jDomObjects
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
          jDomCore = require('../core.js')
        } else {
          console.error('jDom/core/dom/objects requires jDom/core/core')
        }
      }
      /**
   * This is the standard definition of a listenerFunction to be used
   * @callback jDomObjects.listenerFunction
   * @callback listenerFunction
   * @param {Event|module:jDom/pseudoDom/objects.PseudoEvent} e - The event object passed to the listener
   * @param {module:jDom/core/dom/objects.DomItem} target - The element which triggered the event
   * @param {...*} [args] - Optional args as required by the listener
   */

      /**
   * A Boolean indicating whether events of this type will be dispatched to the registered listerFunction before being
   * dispatched to any EventTarget beneath it in the Dom tree.
   * @typedef {boolean} module:jDom/core/dom/objects.UseCapture
   */

      /**
   * OptionsObject defines the structure for the options to be passed to addEventListener
   * @typedef {Object} module:jDom/core/dom/objects.OptionsObject
   * @property {boolean} capture - Indicate that events of this type will be dispatched to the registered
   * listenerFunction before being dispatched to any EventTarget beneath it in the Dom tree.
   * @property {boolean} once - Indicate that the listenerFunction should be invoked at most once after being added. If
   * 'true', the listenerFunction would be automatically removed when invoked.
   * @property {boolean} passive - Indicate that, if 'true', indicates that the listenerFunction will never call
   * preventDefault(). If preventDefault() is called, the user agent will do nothing with it.
   */

      /**
   * EventListenerOptions is either a boolean as UseCapture or an Object as OptionsObject
   * @typedef {
   * module:jDom/core/dom/objects.OptionsObject|module:jDom/core/dom/objects.UseCapture
   * } module:jDom/core/dom/objects.EventListenerOptions
   */

      /**
   * An EventListener Object to be appended to the element within the DomItem
   * @typedef {Object} jDomObjects.EventListener
   * @typedef {Object} EventListener
   * @property {string} listenerFunc - A string function name matching an existing
   * {@link module:jDom/core/dom/objects~listenerFunction}.
   * @property {Object} listenerArgs - Additional args required for the listener function
   * @property {module:jDom/core/dom/objects.EventListenerOptions} listenerOptions - Provides support for options
   * parameter of addEventListener, or false for default
   */

      /**
   * DomItem defines the structure for a single element in the Dom
   * @typedef {Object} module:jDom/core/dom/objects.DomItem
   * @property {string} tagName - This is any valid HTMLElement tagName
   * @property {Object.<string, string|Object>} attributes - All potential HTML element attributes can be defined here
   * (including the defaulted style object)
   * @property {(Object|HTMLElement|module:jDom/pseudoDom/objects.PseudoHTMLElement)} element - A reference to an existing HTML element will be stored here (default
   * empty object)
   * @property {Object.<Event, module:jDom/core/dom/objects~EventListener>} eventListeners - An object holding all
   * events to be registered for the associated element
   * @property {module:jDom/core/dom/objects.DomItem} parentItem - A reference to the parent of this object
   * @property {Array.<module:jDom/core/dom/objects.DomItem>} children - A reference to an array of child objects
   */

      /**
   * This is the basic Object for representing the Dom in a virtual perspective. All incoming attributes will be merged
   * to the specified format.
   * @function createDomItem
   * @param {...Object} attributes - DomItem-like object(s) to be merged as a DomItem
   * @returns {module:jDom/core/dom/objects.DomItem}
   */

      jDomObjects.createDomItem = function () {
        let _jDomCore

        for (var _len = arguments.length, attributes = new Array(_len), _key = 0; _key < _len; _key++) {
          attributes[_key] = arguments[_key]
        }

        return (_jDomCore = jDomCore).mergeObjectsMutable.apply(_jDomCore, [{
          tagName: 'div',
          attributes: {
            style: {}
          },
          element: {},
          eventListeners: {},
          parentItem: {},
          children: []
        }].concat(attributes))
      }
      /**
   * DomItemHead defines the structure for a single element in the Dom
   * @typedef {module:jDom/core/dom/objects.DomItem} module:jDom/core/dom/objects.DomItemHead
   * @typedef {module:jDom/core/dom/objects.DomItem} DomItemHead
   * @property {string} [tagName=head] - This is set to the string head referring to the HTML element of the same name
   * @property {Object.<string, string|Object>} attributes - All potential HTML element attributes can be defined here
   * @property {HTMLHeadElement|module:jDom/pseudoDom/objects.PseudoHTMLElement} element - A reference to the HTML head element
   * @property {Array.<module:jDom/core/dom/objects.DomItem>} children - A reference to an array of child objects
   */

      /**
   * DomItemBody defines the structure for a single element in the Dom
   * @typedef {module:jDom/core/dom/objects.DomItem} module:jDom/core/dom/objects.DomItemBody
   * @typedef {module:jDom/core/dom/objects.DomItem} DomItemBody
   * @property {string} [tagName=body] - This is set to the string body referring to the HTML element of the same name
   * @property {Object.<string, string|Object>} attributes - All potential HTML element attributes can be defined here
   * @property {HTMLBodyElement|module:jDom/pseudoDom/objects.PseudoHTMLElement} element - A reference to the HTML body element
   * @property {Array.<module:jDom/core/dom/objects.DomItem>} children - A reference to an array of child objects
   */

      /**
   * Initiate the children of Root / DocumentItem. This is a helper for {@link documentDomItem}.
   * @returns {Array.<module:jDom/core/dom/objects~DomItemHead|module:jDom/core/dom/objects~DomItemBody>}
   */

      const initChildren = function initChildren () {
        return [jDomObjects.createDomItem({
          tagName: 'head',
          attributes: {},
          element: document.head,
          children: []
        }), jDomObjects.createDomItem({
          tagName: 'body',
          attributes: {},
          element: document.body,
          children: []
        })]
      }
      /**
   * DomItemRoot defines the structure for a single element in the Dom
   * @typedef {module:jDom/core/dom/objects.DomItem} module:jDom/core/dom/objects.DomItemRoot
   * @property {string} [tagName=html] - This is set to the string html referring to the HTML element of the same name
   * @property {Object} attributes - Empty object as attributes placeholder
   * @property {HTMLDocument|module:jDom/pseudoDom/objects.PseudoHTMLDocument} element - A reference to the entire Document
   * @property {Object.<string, module:jDom/core/dom/objects~listenerFunction>} eventListeners - all registered
   * listeners stored as listener name and function pairs
   * @property {
   * Array.<module:jDom/core/dom/objects~DomItemHead|module:jDom/core/dom/objects~DomItemBody>
   *   } children - Two references: for head and body
   * @property {module:jDom/core/dom/objects~DomItemHead} head - A specific reference to head item
   * @property {module:jDom/core/dom/objects~DomItemBody} body - A specific reference to body item
   */

      /**
   * Initiate the Root for DocumentItem. This is primary a helper for {@link documentDomItem}.
   * @param {
   * Array.<module:jDom/core/dom/objects~DomItemHead|module:jDom/core/dom/objects~DomItemBody>
   *   } children - Provide an array of Head and Body (usually via {@link initChildren})
   * @param {Object.<string, module:jDom/core/dom/objects~listenerFunction>} listeners - An object of all event
   * listeners to be registered in the Dom
   * @returns {module:jDom/core/dom/objects.DomItemRoot|module:jDom/core/dom/objects.DomItem}
   */

      const initRoot = function initRoot (children) {
        const listeners = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
        return jDomObjects.createDomItem({
          tagName: 'html',
          attributes: {},
          element: document,
          eventListeners: listeners,
          children: children,
          head: children[0],
          body: children[1]
        })
      }
      /**
   * Return a DomItem reference to the document. The rootItem argument is a system variable and not necessary to
   * implement.
   * @function documentDomItem
   * @param {Object.<string, module:jDom/core/dom/objects~listenerFunction>} listeners - An object of all event
   * listeners to be registered in the Dom
   * @param {module:jDom/core/dom/objects.DomItemRoot|module:jDom/core/dom/objects.DomItem} [rootItem] - This is a
   * reference to DomItemRoot which will be defaulted with {@link initRoot}
   * @returns {module:jDom/core/dom/objects.DomItemRoot|module:jDom/core/dom/objects.DomItem}
   */

      jDomObjects.documentDomItem = function () {
        const listeners = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
        const rootItem = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : initRoot(initChildren(), listeners)
        rootItem.children = rootItem.children.map(function (child) {
          return jDomObjects.createDomItem(child, {
            parentItem: rootItem
          })
        })
        Object.assign(rootItem.head, rootItem.children[0])
        Object.assign(rootItem.body, rootItem.children[1])
        return jDomObjects.createDomItem(rootItem)
      }
      /**
   * Create reference for storing document changes
   * @member documentItem
   * @type {module:jDom/core/dom/objects.DomItemRoot}
   */

      jDomObjects.documentItem = jDomObjects.documentDomItem()
      /**
   * Either export all functions to be exported, or assign to the Window context
   */

      if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
          exports = module.exports = jDomObjects
        }

        exports = Object.assign(exports, jDomObjects)
      }
    }).call(void 0 || window || {}) // Use the external context to assign this, which will be Window if rendered via browser
  }, { '../../pseudoDom/objects.js': 17, '../core.js': 5 }],
  8: [function (require, module, exports) {
    /**
 * @file All of the core matrix functions for working with a grid of points.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    'use strict'

    function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

    function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

    function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen) }

    function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && iter[Symbol.iterator] != null || iter['@@iterator'] != null) return Array.from(iter) }

    function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr) }

    function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2 }

    function _defineProperty (obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }) } else { obj[key] = value } return obj }

    (function () {
      /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
      const root = this || {}
      /**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */

      const previousJDomMatrixCore = root.jDomMatrixCore || {}
      /**
   * All methods exported from this module are encapsulated within jDomMatrixCore.
   * @author Joshua Heagle <joshuaheagle@gmail.com>
   * @typedef {Object} jDomMatrixCore
   * @module jDom/matrix/core
   */

      const jDomMatrixCore = {}
      root.jDomMatrixCore = jDomMatrixCore
      /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {jDomMatrixCore}
   */

      jDomMatrixCore.noConflict = function () {
        root.jDomMatrixCore = previousJDomMatrixCore
        return jDomMatrixCore
      }
      /**
   * Verify availability of jDomMatrixObjects
   * @typedef {*|module:jDom/core/core} jDomCore
   */

      let jDomCore = root.jDomCore
      /**
   * If jDomCore remains undefined, attempt to retrieve it as a module
   */

      if (typeof jDomCore === 'undefined') {
        if (typeof require !== 'undefined') {
          jDomCore = require('../core/core.js')
        } else {
          console.error('jDom/matrix/core requires jDom/core/core')
        }
      }
      /**
   * Verify availability of jDomMatrixObjects
   * @typedef {*|module:jDom/matrix/objects} jDomMatrixObjects
   */

      let jDomMatrixObjects = root.jDomMatrixObjects
      /**
   * If jDomCoreDom remains undefined, attempt to retrieve it as a module
   */

      if (typeof jDomMatrixObjects === 'undefined') {
        if (typeof require !== 'undefined') {
          jDomMatrixObjects = require('./objects.js')
        } else {
          console.error('jDom/matrix/core requires jDom/matrix/objects')
        }
      }
      /**
   * Generate point data for each item in the matrix
   * WARNING: This is a recursive function.
   * @function bindPointData
   * @param {module:jDom/matrix/objects.MatrixColumn|module:jDom/matrix/objects.MatrixRow} item - A special DomItem
   * which is either a layer, row, or column in a matrix.
   * @param {module:jDom/matrix/objects.Point} pnt - A point to be added to a specific Matrix Column
   * @returns {module:jDom/matrix/objects.MatrixColumn|module:jDom/matrix/objects.MatrixRow}
   */

      jDomMatrixCore.bindPointData = function (item) {
        const pnt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : jDomMatrixObjects.point(0, 0, 0)
        return jDomCore.mergeObjects(item, item.point
          ? {
              point: jDomCore.cloneObject(pnt)
            }
          : {
              children: item.children.map(function (el, i) {
                return jDomMatrixCore.bindPointData(el, Object.assign(pnt, _defineProperty({}, el.axis, i)))
              })
            })
      }
      /**
   * Based on provided point and point direction generate next point.
   * @function nextCell
   * @param {module:jDom/matrix/objects.Point} pnt - Provide the current / initial point
   * @param {module:jDom/matrix/objects.Direction} dir - Provide the direction to be applied to find the next point
   * @returns {module:jDom/matrix/objects.Point}
   */

      jDomMatrixCore.nextCell = function (pnt, dir) {
        return jDomMatrixObjects.point(pnt.x + dir.x, pnt.y + dir.y, pnt.z + dir.z)
      }
      /**
   * Based on provided point and another point, get a point with the difference between each axis
   * @function pointDifference
   * @param {module:jDom/matrix/objects.Point} start - The first point to compare
   * @param {module:jDom/matrix/objects.Point} end - The other point to be compared
   * @returns {module:jDom/matrix/objects.Point}
   */

      jDomMatrixCore.pointDifference = function (start, end) {
        return jDomMatrixObjects.point(end.x - start.x, end.y - start.y, end.z - start.z)
      }
      /**
   * Given two points, compare the x, y, and z of each to see if they are the same
   * @function areEqualPoints
   * @param {module:jDom/matrix/objects.Point} p1 - The first point to compare
   * @param {module:jDom/matrix/objects.Point} p2 - The other point to be compared
   * @returns {boolean}
   */

      jDomMatrixCore.areEqualPoints = function (p1, p2) {
        return p1.x === p2.x && p1.y === p2.y && p1.z === p2.z
      }
      /**
   * Return the first coordinate number with the highest absolute value.
   * @function getHighestAbsoluteCoordinate
   * @param {module:jDom/matrix/objects.Point} pnt - A Point to be assessed.
   * @returns {module:jDom/matrix/objects.coordinate}
   */

      jDomMatrixCore.getHighestAbsoluteCoordinate = function (pnt) {
        return jDomCore.reduceObject(pnt, jDomCore.getAbsoluteMax, 0)
      }
      /**
   * Having provided a coordinate number, find all corresponding axis, return the first match.
   * @function getFirstAxisOfCoordinate
   * @param {module:jDom/matrix/objects.Point} pnt - The Point containing a matching coordinate.
   * @param {module:jDom/matrix/objects.coordinate} coordinate - The coordinate to search for.
   * @returns {false|module:jDom/matrix/objects.axis}
   */

      jDomMatrixCore.getFirstAxisOfCoordinate = function (pnt, coordinate) {
        return Object.keys(pnt).filter(function (key) {
          return pnt[key] === coordinate
        })[0] || false
      }
      /**
   * Given a point and the value of the highest coordinate select the corresponding axis which will be the direction
   * (-1 or 1) to and set the other axis to 0.
   * @param {module:jDom/matrix/objects.Point} pnt - The which will be converted to a direction.
   * @param {module:jDom/matrix/objects.coordinate} highestCoordinate - The highest coordinate provided by the point.
   * @returns {module:jDom/matrix/objects.Direction}
   */

      const pointAndCoordinateToDirection = function pointAndCoordinateToDirection (pnt, highestCoordinate) {
        return (function (axis) {
          return axis !== false ? jDomCore.mergeObjects(jDomMatrixObjects.point(0, 0, 0), _defineProperty({}, ''.concat(axis), highestCoordinate > 0 ? 1 : -1)) : jDomMatrixObjects.point(0, 0, 0)
        }(jDomMatrixCore.getFirstAxisOfCoordinate(pnt, highestCoordinate)))
      }
      /**
   * Having a point, convert it to a direction where the axis with the highest coordinate value will be set to -1 or 1.
   * @param {module:jDom/matrix/objects.Point} pnt - The point to be converted to a direction.
   * @returns {module:jDom/matrix/objects.Direction}
   */

      const pointToDirection = function pointToDirection (pnt) {
        return pointAndCoordinateToDirection(pnt, jDomMatrixCore.getHighestAbsoluteCoordinate(pnt))
      }
      /**
   * Retrieve a directional coordinate value based on two provided points
   * (directions consist of two zero coordinates and a single coordinate of 1 / -1)
   * @function pointsToDirection
   * @param {module:jDom/matrix/objects.Point} start - The first point to assess.
   * @param {module:jDom/matrix/objects.Point} end - The other point to assess.
   * @returns {module:jDom/matrix/objects.Direction}
   */

      jDomMatrixCore.pointsToDirection = function (start, end) {
        return pointToDirection(jDomMatrixCore.pointDifference(start, end))
      }
      /**
   * Generate a random starting point for a line with the provided length and direction.
   * @function randomStart
   * @param {number} length - The intended length the resulting line.
   * @param {module:jDom/matrix/objects.Direction} dir - The direction the line will extend towards.
   * @param {module:jDom/matrix/objects.Point} [lengthLimits={x: 10, y: 10, z: 10}] - The maximum grid size.
   * @returns {module:jDom/matrix/objects.Point}
   */

      jDomMatrixCore.randomStart = function (length, dir) {
        const lengthLimits = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : jDomMatrixObjects.point(10, 10, 10)
        return jDomMatrixObjects.point(jDomCore.randomInteger(lengthLimits.x - (length - 1) * dir.x), jDomCore.randomInteger(lengthLimits.y - (length - 1) * dir.y), jDomCore.randomInteger(lengthLimits.z - (length - 1) * dir.z))
      }
      /**
   * Given a start point, line length, and a direction, generate the end point of the line.
   * @function lineEndPoint
   * @param {module:jDom/matrix/objects.Point} start - The selected starting point.
   * @param {number} length - The total length of the line.
   * @param {module:jDom/matrix/objects.Direction} dir - The direction of the line.
   * @returns {module:jDom/matrix/objects.Point}
   */

      jDomMatrixCore.lineEndPoint = function (start, length, dir) {
        return jDomMatrixObjects.point(start.x + dir.x * (length - 1), start.y + dir.y * (length - 1), start.z + dir.z * (length - 1))
      }
      /**
   * Having provided two points, return an array of transition points connecting 'start' and 'end'. Return array
   * includes 'start' (line[0]) and 'end' (line[line.length-1])
   * @function getPointsLine
   * @param {module:jDom/matrix/objects.Point} start - The starting location of the line.
   * @param {module:jDom/matrix/objects.Point} end - The final line destination.
   * @param {Array.<module:jDom/matrix/objects.Point>} [line=[]] - The resulting line to connect start and end.
   * @returns {Array.<module:jDom/matrix/objects.Point>}
   */

      jDomMatrixCore.getPointsLine = function (start, end) {
        const line = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : []
        return jDomMatrixCore.areEqualPoints(start, end) ? line.concat([start]) : jDomMatrixCore.getPointsLine(jDomMatrixCore.nextCell(start, jDomMatrixCore.pointsToDirection(start, end)), end, line.concat([start]))
      }
      /**
   * Takes an array of arrays containing two points each. Calls getPointsLine for each array of points. Returns an
   * array of all points captured for each line segment
   * @function getPointsLines
   * @param {Array.<Array.<module:jDom/matrix/objects.Point>>} lines - An array of lines only containing start and end.
   * @returns {Array.<Array.<module:jDom/matrix/objects.Point>>}
   */

      jDomMatrixCore.getPointsLines = function (lines) {
        return lines.reduce(function (pointsArray, line) {
          return pointsArray.concat(jDomMatrixCore.getPointsLine.apply(jDomMatrixCore, _toConsumableArray(line)))
        }, [])
      }
      /**
   * Function that produces a property of the new Object, taking three arguments
   * @callback module:jDom/matrix/core~testPointStatus
   * @param {module:jDom/matrix/objects.MatrixColumn|Object} pnt - A point which may have some status.
   * @param {module:jDom/matrix/objects.Matrix|Object} matrix - A matrix of points to find the point within.
   * @returns {boolean}
   */

      /**
   * Given a start and end point, test the points between with the provided function. Return the points as part of true
   * and / or false properties based on the test.
   * @function module:jDom/matrix/core~testPointsBetween
   * @param {module:jDom/matrix/objects.Point} start - The beginning point to check.
   * @param {module:jDom/matrix/objects.Point} end - The terminating point to check between.
   * @param {module:jDom/matrix/objects.Matrix} matrix - The grid of points all the points can exist on.
   * @param {module:jDom/matrix/core~testPointStatus} func - The test function which will return true or false.
   * @param {boolean} [inclusive=true] - Choose whether to include or exclude the start and end points in the results.
   * @returns {Object.<string, Array.<module:jDom/matrix/objects.Point>>}
   */

      jDomMatrixCore.testPointsBetween = function (start, end, matrix, func) {
        const inclusive = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true
        return jDomMatrixCore.getPointsLine(start, end).filter(function (prop, i, line) {
          return i !== 0 && i !== line.length - 1 || inclusive
        }).reduce(function (newPoints, next) {
          return jDomCore.mergeObjects(newPoints, _defineProperty({}, ''.concat(func(next, matrix)), [next]))
        }, {
          true: [],
          false: []
        })
      }
      /**
   * Given two points, check the cells between using specified function.
   * When inclusive is set to true the provided start and end points will also be tested
   * @function checkInBetween
   * @param {...*} args - These args match the parameter list for {@link module:jDom/matrix/core~testPointsBetween}
   * @returns {boolean}
   */

      jDomMatrixCore.checkInBetween = function () {
        return !!jDomMatrixCore.testPointsBetween.apply(jDomMatrixCore, arguments).true.length
      }
      /**
   * Return point-like object with all of the axis lengths.
   * @function getAxisLengths
   * @param {module:jDom/matrix/objects.Matrix} matrix - The matrix to get the dimensions of.
   * @returns {module:jDom/matrix/objects.Point}
   */

      jDomMatrixCore.getAxisLengths = function (matrix) {
        return jDomMatrixObjects.point(matrix.children[0].children[0].children.length, matrix.children[0].children.length, matrix.children.length)
      }
      /**
   * Get random direction point
   * @function randDirection
   * @param {Array.<module:jDom/matrix/objects.Point>} [useCoordinates=[]] - An array of possible directions.
   * @returns {module:jDom/matrix/objects.Direction}
   */

      jDomMatrixCore.randDirection = function () {
        const useCoordinates = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
        return useCoordinates.length ? useCoordinates[jDomCore.randomInteger(useCoordinates.length)] : jDomMatrixObjects.point(0, 0, 0)
      }
      /**
   * Test if the provided point exists in the matrix.
   * @function checkValidPoint
   * @param {module:jDom/matrix/objects.Point} pnt - Provide a point to validate.
   * @param {module:jDom/matrix/objects.Matrix} matrix - The matrix that contains valid points.
   * @returns {boolean}
   */

      jDomMatrixCore.checkValidPoint = function (pnt, matrix) {
        return !!matrix.children[pnt.z] && !!matrix.children[pnt.z].children[pnt.y] && !!matrix.children[pnt.z].children[pnt.y].children[pnt.x] && !!matrix.children[pnt.z].children[pnt.y].children[pnt.x].point
      }
      /**
   * Retrieve the DomItem associated with the provided point
   * @function getDomItemFromPoint
   * @param {module:jDom/matrix/objects.Point} pnt - A point corresponding to a DomItem.
   * @param {module:jDom/matrix/objects.Matrix} matrix - The matrix containing the point.
   * @returns {false|module:jDom/core/dom/objects.DomItem}
   */

      jDomMatrixCore.getDomItemFromPoint = function (pnt, matrix) {
        return jDomMatrixCore.checkValidPoint(pnt, matrix) ? matrix.children[pnt.z].children[pnt.y].children[pnt.x] : false
      }
      /**
   * Return an array of all the points in the matrix
   * @function getAllPoints
   * @param {module:jDom/matrix/objects.Matrix|module:jDom/matrix/objects.MatrixColumn} matrix - The matrix to retrieve
   * points from.
   * @param {Array.<module:jDom/matrix/objects.Point>} [allPoints=[]] - The array of points to be returned
   * @returns {Array.<module:jDom/matrix/objects.Point>}
   */

      jDomMatrixCore.getAllPoints = function (matrix) {
        const allPoints = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : []
        return matrix.point
          ? allPoints.concat([matrix.point])
          : matrix.children.reduce(function (allPoints, child) {
            return allPoints.concat(jDomMatrixCore.getAllPoints(child, []))
          }, [])
      }
      /**
   * Return all valid points surrounding a provided point
   * @function adjacentPoints
   * @param {module:jDom/matrix/objects.Point} pnt - The point we want to find adjacent points for.
   * @param {module:jDom/matrix/objects.Matrix} matrix - The matrix having the point.
   * @returns {Array.<module:jDom/matrix/objects.Point>}
   */

      jDomMatrixCore.adjacentPoints = function (pnt, matrix) {
        return jDomMatrixCore.getPointsLines([[jDomMatrixObjects.point(-1, 1, 1), jDomMatrixObjects.point(1, -1, -1)], [jDomMatrixObjects.point(1, 1, 1), jDomMatrixObjects.point(-1, 1, -1)], [jDomMatrixObjects.point(-1, -1, 1), jDomMatrixObjects.point(1, -1, 1)], [jDomMatrixObjects.point(1, 0, 0), jDomMatrixObjects.point(1, 1, -1)], [jDomMatrixObjects.point(-1, 1, 0), jDomMatrixObjects.point(1, 1, 0)]]).concat([jDomMatrixObjects.point(0, 0, 1), jDomMatrixObjects.point(1, 0, 0), jDomMatrixObjects.point(-1, 0, -1), jDomMatrixObjects.point(0, 0, -1)]).map(function (p) {
          return jDomMatrixCore.nextCell(pnt, p)
        }).filter(function (p) {
          return jDomMatrixCore.checkValidPoint(jDomMatrixCore.nextCell(pnt, p), matrix)
        })
      }
      /**
   * Return all points which touch on edges (not diagonal)
   * @function adjacentEdgePoints
   * @param {module:jDom/matrix/objects.Point} pnt - The point we want to find adjacent points for.
   * @param {module:jDom/matrix/objects.Matrix} matrix - The matrix having the point.
   * @returns {Array.<module:jDom/matrix/objects.Point>}
   */

      jDomMatrixCore.adjacentEdgePoints = function (pnt, matrix) {
        return [jDomMatrixObjects.point(-1, 0, 0), jDomMatrixObjects.point(1, 0, 0), jDomMatrixObjects.point(0, -1, 0), jDomMatrixObjects.point(0, 1, 0), jDomMatrixObjects.point(0, 0, -1), jDomMatrixObjects.point(0, 0, 1)].map(function (p) {
          return jDomMatrixCore.nextCell(pnt, p)
        }).filter(function (p) {
          return jDomMatrixCore.checkValidPoint(p, matrix)
        })
      }
      /**
   * Retrieve the point associated with the provided element.
   * @function getPointFromElement
   * @param {Node|HTMLElement|module:jDom/pseudoDom/objects.PseudoHTMLElement} elem - Provide an element associated with
   * a point.
   * @returns {module:jDom/matrix/objects.Point}
   */

      jDomMatrixCore.getPointFromElement = function (elem) {
        return jDomMatrixObjects.point(Array.from(elem.parentNode.childNodes).indexOf(elem), Array.from(elem.parentNode.parentNode.childNodes).indexOf(elem.parentNode), Array.from(elem.parentNode.parentNode.parentNode.childNodes).indexOf(elem.parentNode.parentNode))
      }
      /**
   * Retrieve the DomItem associated with the provided element in the matrix
   * @function getDomItemFromElement
   * @param {Node|HTMLElement|module:jDom/pseudoDom/objects.PseudoHTMLElement} elem - Provide an element having an
   * associated DomItem.
   * @param {module:jDom/matrix/objects.Matrix} matrix - The matrix potentially containing the DomItem with Point.
   * @returns {module:jDom/core/dom/objects.DomItem}
   */

      jDomMatrixCore.getDomItemFromElement = function (elem, matrix) {
        return jDomMatrixCore.getDomItemFromPoint(jDomMatrixCore.getPointFromElement(elem), matrix)
      }
      /**
   * Either export all functions to be exported, or assign to the Window context
   */

      if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
          exports = module.exports = jDomMatrixCore
        }

        exports = Object.assign(exports, jDomMatrixCore)
      }
    }).call(void 0 || window || {}) // Use the external context to assign this, which will be Window if rendered via browser
  }, { '../core/core.js': 5, './objects.js': 9 }],
  9: [function (require, module, exports) {
    /**
 * @file Core Matrix objects for representing DOM grid in JSON.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    'use strict'

    function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

    function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

    function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen) }

    function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && iter[Symbol.iterator] != null || iter['@@iterator'] != null) return Array.from(iter) }

    function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr) }

    function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2 }

    (function () {
      /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
      const root = this || {}
      /**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */

      const previousJDomMatrixObjects = root.jDomMatrixObjects || {}
      /**
   * All methods exported from this module are encapsulated within jDomMatrixObjects.
   * @author Joshua Heagle <joshuaheagle@gmail.com>
   * @typedef {Object} jDomMatrixObjects
   * @module jDom/matrix/objects
   */

      const jDomMatrixObjects = {}
      root.jDomMatrixObjects = jDomMatrixObjects
      /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {jDomMatrixObjects}
   */

      jDomMatrixObjects.noConflict = function () {
        root.jDomMatrixObjects = previousJDomMatrixObjects
        return jDomMatrixObjects
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
          jDomCore = require('../core/core.js')
        } else {
          console.error('objects.js requires jDomCore')
        }
      }
      /**
   * Verify availability of jDomObjects
   * @typedef {*|module:jDom/core/dom/objects} jDomObjects
   */

      let jDomObjects = root.jDomObjects
      /**
   * If jDomObjects remains undefined, attempt to retrieve it as a module
   */

      if (typeof jDomObjects === 'undefined') {
        if (typeof require !== 'undefined') {
          jDomObjects = require('../core/dom/objects.js')
        } else {
          console.error('core.js requires jDomObjects')
        }
      }
      /**
   * A string representing an axis: x, y, z
   * @typedef {string} module:jDom/matrix/objects.axis
   */

      /**
   * A number representing a coordinate in a {@link module:jDom/matrix/objects.Matrix}
   * @typedef {number} module:jDom/matrix/objects.coordinate
   */

      /**
   * Point stores a location in a {@link module:jDom/matrix/objects.Matrix} defined by three key-value pairs
   * ({@link module:jDom/matrix/objects.axis}=>{@link module:jDom/matrix/objects.coordinate})
   * @typedef {
   * Object.<module:jDom/matrix/objects.axis, module:jDom/matrix/objects.coordinate>
   *   } module:jDom/matrix/objects.Point
   * @property {module:jDom/matrix/objects.coordinate} x - The X-coordinate of a Point
   * @property {module:jDom/matrix/objects.coordinate} y - The Y-coordinate of a Point
   * @property {module:jDom/matrix/objects.coordinate} z - The Z-coordinate of a Point
   */

      /**
   * Point stores a location in a {@link module:jDom/matrix/objects.Matrix} defined by three key-value pairs
   * @typedef {module:jDom/matrix/objects.Point} module:jDom/matrix/objects.Direction
   * @property {module:jDom/matrix/objects.coordinate} x - The X-coordinate must be either -1, 0, or 1
   * @property {module:jDom/matrix/objects.coordinate} y - The Y-coordinate must be either -1, 0, or 1
   * @property {module:jDom/matrix/objects.coordinate} z - The Z-coordinate must be either -1, 0, or 1
   */

      /**
   * Store the point data for an x, y, z {@link module:jDom/matrix/objects.Matrix}.
   * @function point
   * @param {module:jDom/matrix/objects.coordinate} x - The numeric value for X-coordinate
   * @param {module:jDom/matrix/objects.coordinate} y - The numeric value for Y-coordinate
   * @param {module:jDom/matrix/objects.coordinate} [z=0] - The numeric value for Z-coordinate (default to 0 for 2D
   * {@link module:jDom/matrix/objects.Matrix})
   * @returns {module:jDom/matrix/objects.Point}
   */

      jDomMatrixObjects.point = function (x, y) {
        const z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0
        return {
          x: x,
          y: y,
          z: z
        }
      }
      /**
   * MatrixTile is an Object which stores a reference a {@link Point} and can be populated with additionally associated
   * fields.
   * @typedef {Object.<string, module:jDom/matrix/objects.Point>} module:jDom/matrix/objects.MatrixTile
   * @property {module:jDom/matrix/objects.Point} point - a reference to its location in a
   * {@link module:jDom/matrix/objects.Matrix}
   * @property {module:jDom/matrix/objects.axis} axis - The axis will be 'x'
   */

      /**
   * A default tile in the {@link module:jDom/matrix/objects.Matrix}
   * @function tile
   * @returns {module:jDom/matrix/objects.MatrixTile}
   */

      jDomMatrixObjects.tile = function () {
        return {
          point: {}
        }
      }
      /**
   * MatrixColumn is a DomItem which represents the x axis and also stores {@link module:jDom/matrix/objects.MatrixTile}
   * @typedef {
   * module:jDom/core/dom/objects.DomItem|module:jDom/matrix/objects.MatrixTile
   * } module:jDom/matrix/objects.MatrixColumn
   */

      /**
   * MatrixRow is the parent of a group of {@link module:jDom/matrix/objects.MatrixTile}
   * @typedef {module:jDom/core/dom/objects.DomItem} module:jDom/matrix/objects.MatrixRow
   * @property {module:jDom/matrix/objects.axis} axis - The axis will be 'y'
   * @property {Array.<module:jDom/matrix/objects.MatrixColumn>} children - all of the MatrixTile items as part of this
   * MatrixRow
   */

      /**
   * MatrixLayer is the parent of a group of {@link module:jDom/matrix/objects.MatrixTile}
   * @typedef {module:jDom/core/dom/objects.DomItem} module:jDom/matrix/objects.MatrixLayer
   * @property {module:jDom/matrix/objects.axis} axis - The axis will be 'y'
   * @property {Array.<module:jDom/matrix/objects.MatrixRow>} children - all of the MatrixRow items as part of this
   * MatrixLayer
   */

      /**
   * Matrix is a multi-level {@link module:jDom/core/dom/objects.DomItem} which is used to visually represent a
   * mathematical grid / matrix.
   * The matrix consists of four DomItem levels, at the top tier is the Matrix container with class matrix.
   * The second tier represents the z axis (with property axis='z') and has the class layer.
   * The third tier represents the y axis (with property axis='y') and has the class row.
   * The fourth (final) tier represents the x axis (with property axis='x') and has the class column.
   * The {@link module:jDom/matrix/objects.MatrixTile} is attached on the x axis tier.
   * The number of children at each level is defined by the size of the matrix, the end result is a multidimensional
   * array.
   * @typedef {module:jDom/core/dom/objects.DomItem} module:jDom/matrix/objects.Matrix
   * @augments module:jDom/core/dom/objects.DomItem
   */

      /**
   * Create a 3d matrix of i with x by y by z size, add additional objects for each layer as well
   * @function matrix
   * @param {
   * {coordinate: module:jDom/matrix/objects.coordinate, props: Array.<module:jDom/matrix/objects.MatrixTile>}
   * } x - Properties and a coordinate defining the width of the matrix.
   * @param {
   * {coordinate: module:jDom/matrix/objects.coordinate, props: Array.<module:jDom/matrix/objects.MatrixRow>}
   * } y - Properties and a coordinate defining the height of the matrix.
   * @param {
   * {coordinate: module:jDom/matrix/objects.coordinate, props: Array.<module:jDom/matrix/objects.MatrixLayer>}
   * } z - Properties and a coordinate defining the depth of the matrix.
   * @param {Array.<module:jDom/matrix/objects.Matrix>} matrixProps - Properties to be added to the matrix
   * @returns {module:jDom/matrix/objects.Matrix}
   */

      jDomMatrixObjects.matrix = function () {
        let _jDomObjects, _jDomObjects2, _jDomObjects3, _jDomObjects4

        const x = arguments.length > 0 && arguments[0] !== undefined
          ? arguments[0]
          : {
              coordinate: 0,
              props: []
            }
        const y = arguments.length > 1 && arguments[1] !== undefined
          ? arguments[1]
          : {
              coordinate: 0,
              props: []
            }
        const z = arguments.length > 2 && arguments[2] !== undefined
          ? arguments[2]
          : {
              coordinate: 1,
              props: []
            }
        const matrixProps = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : []
        return (_jDomObjects = jDomObjects).createDomItem.apply(_jDomObjects, [{
          tagName: 'div',
          attributes: {
            className: 'matrix'
          },
          children: jDomCore.buildArray((_jDomObjects2 = jDomObjects).createDomItem.apply(_jDomObjects2, [{
            axis: 'z',
            tagName: 'div',
            attributes: {
              className: 'layer'
            },
            children: jDomCore.buildArray((_jDomObjects3 = jDomObjects).createDomItem.apply(_jDomObjects3, [{
              axis: 'y',
              tagName: 'div',
              attributes: {
                className: 'row'
              },
              children: jDomCore.buildArray((_jDomObjects4 = jDomObjects).createDomItem.apply(_jDomObjects4, [{
                axis: 'x',
                tagName: 'div',
                attributes: {
                  className: 'column'
                }
              }].concat(_toConsumableArray(x.props))), x.coordinate)
            }].concat(_toConsumableArray(y.props))), y.coordinate)
          }].concat(_toConsumableArray(z.props))), z.coordinate)
        }].concat(_toConsumableArray(matrixProps)))
      }
      /**
   * Return a single layer matrix where x and y are equal
   * @function square
   * @param {Array.<module:jDom/matrix/objects.MatrixTile>} [x=[]] - All the data to be presented as part of the
   * specified point, requires MatrixTile base
   * @param {Array.<module:jDom/matrix/objects.MatrixRow>} [y=[]] - Additional data to append to the MatrixRow
   * @param {Array.<module:jDom/matrix/objects.MatrixLayer>} [z=[]] - Additional data to append to the MatrixLayer
   * @param {Array.<module:jDom/matrix/objects.Matrix>} [matrixProps=[]] - Additional data to append to the Matrix
   * @param {number} size - Used to define height and width as equal values (depth is set to 1)
   * @returns {module:jDom/matrix/objects.Matrix}
   */

      jDomMatrixObjects.square = function () {
        const _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        const _ref$x = _ref.x
        const x = _ref$x === void 0 ? [] : _ref$x
        const _ref$y = _ref.y
        const y = _ref$y === void 0 ? [] : _ref$y
        const _ref$z = _ref.z
        const z = _ref$z === void 0 ? [] : _ref$z
        const _ref$matrixProps = _ref.matrixProps
        const matrixProps = _ref$matrixProps === void 0 ? [] : _ref$matrixProps

        const size = arguments.length > 1 ? arguments[1] : undefined
        return jDomMatrixObjects.matrix({
          coordinate: size,
          props: x
        }, {
          coordinate: size,
          props: y
        }, {
          coordinate: 1,
          props: z
        }, matrixProps)
      }
      /**
   * Return a matrix where x, y, and z are equal
   * @function cube
   * @param {Array.<module:jDom/matrix/objects.MatrixTile>} [x=[]] - All the data to be presented as part of the
   * specified point, requires MatrixTile base
   * @param {Array.<module:jDom/matrix/objects.MatrixRow>} [y=[]] - Additional data to append to the MatrixRow
   * @param {Array.<module:jDom/matrix/objects.MatrixLayer>} [z=[]] - Additional data to append to the MatrixLayer
   * @param {Array.<module:jDom/matrix/objects.Matrix>} [matrixProps=[]] - Additional data to append to the Matrix
   * @param {number} size - Used to define height, width, and depth as equal values
   * @returns {module:jDom/matrix/objects.Matrix}
   */

      jDomMatrixObjects.cube = function () {
        const _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        const _ref2$x = _ref2.x
        const x = _ref2$x === void 0 ? [] : _ref2$x
        const _ref2$y = _ref2.y
        const y = _ref2$y === void 0 ? [] : _ref2$y
        const _ref2$z = _ref2.z
        const z = _ref2$z === void 0 ? [] : _ref2$z
        const _ref2$matrixProps = _ref2.matrixProps
        const matrixProps = _ref2$matrixProps === void 0 ? [] : _ref2$matrixProps

        const size = arguments.length > 1 ? arguments[1] : undefined
        return jDomMatrixObjects.matrix({
          coordinate: size,
          props: x
        }, {
          coordinate: size,
          props: y
        }, {
          coordinate: size,
          props: z
        }, matrixProps)
      }
      /**
   * Either export all functions to be exported, or assign to the Window context
   */

      if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
          exports = module.exports = jDomMatrixObjects
        }

        exports = Object.assign(exports, jDomMatrixObjects)
      }
    }).call(void 0 || window || {}) // Use the external context to assign this, which will be Window if rendered via browser
  }, { '../core/core.js': 5, '../core/dom/objects.js': 7 }],
  10: [function (require, module, exports) {
    /**
 * @file Substitute for the DOM Element Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    'use strict'
    /**
 * Simulate the behaviour of the Element Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoNode
 * @property {string} tagName
 * @property {string} className
 * @property {string} id
 * @property {string} innerHtml
 * @property {Array} attributes
 * @property {function} hasAttribute
 * @property {function} setAttribute
 * @property {function} getAttribute
 * @property {function} removeAttribute
 */

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

    function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor }

    function _get (target, property, receiver) { if (typeof Reflect !== 'undefined' && Reflect.get) { _get = Reflect.get } else { _get = function _get (target, property, receiver) { const base = _superPropBase(target, property); if (!base) return; const desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver) } return desc.value } } return _get(target, property, receiver || target) }

    function _superPropBase (object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break } return object }

    function _inherits (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function') } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass) }

    function _setPrototypeOf (o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) { o.__proto__ = p; return o }; return _setPrototypeOf(o, p) }

    function _createSuper (Derived) { const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget) } else { result = Super.apply(this, arguments) } return _possibleConstructorReturn(this, result) } }

    function _possibleConstructorReturn (self, call) { if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call } return _assertThisInitialized(self) }

    function _assertThisInitialized (self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return self }

    function _isNativeReflectConstruct () { if (typeof Reflect === 'undefined' || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === 'function') return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true } catch (e) { return false } }

    function _getPrototypeOf (o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf (o) { return o.__proto__ || Object.getPrototypeOf(o) }; return _getPrototypeOf(o) }

    const PseudoElement = /* #__PURE__ */(function (_require) {
      _inherits(PseudoElement, _require)

      const _super = _createSuper(PseudoElement)

      /**
   * Simulate the Element object when the Dom is not available
   * @param {string} [tagName=''] - The
   * @param {array} [attributes=[]]
   * @param {PseudoNode|Object} [parent={}]
   * @param {Array} [children=[]]
   * @constructor
   */
      function PseudoElement () {
        let _this

        const _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        const _ref$tagName = _ref.tagName
        const tagName = _ref$tagName === void 0 ? '' : _ref$tagName
        const _ref$attributes = _ref.attributes
        const attributes = _ref$attributes === void 0 ? [] : _ref$attributes
        const _ref$parent = _ref.parent
        const parent = _ref$parent === void 0 ? {} : _ref$parent
        const _ref$children = _ref.children
        const children = _ref$children === void 0 ? [] : _ref$children

        _classCallCheck(this, PseudoElement)

        _this = _super.call(this, {
          parent: parent,
          children: children
        })
        _this.tagName = tagName
        _this.attributes = attributes.concat([{
          name: 'className',
          value: ''
        }, {
          name: 'id',
          value: ''
        }, {
          name: 'innerHTML',
          value: ''
        }])
        /**
     * Map all incoming attributes to the attributes array and attach each as a property of this element
     */

        _this.attributes.map(function (_ref2) {
          const name = _ref2.name
          const value = _ref2.value
          _this[name] = value
          return {
            name: name,
            value: value
          }
        }) // this.classList = new DOMSettableTokenList(this.className)

        _this.classList = _this.className
        return _this
      }
      /**
   *
   * @returns {Function}
   */

      _createClass(PseudoElement, [{
        key: 'applyDefaultEvent',
        value: function applyDefaultEvent () {
          const _this2 = this

          let callback = function callback (event) {
            return undefined
          }

          switch (this.tagName) {
            case 'form':
              this.addEventListener('submit', callback)
              break

            case 'button':
            case 'input':
              if (/^(submit|image)$/i.test(this.type || '')) {
                callback = function callback (event) {
                  const forms = require('./PseudoEvent').getParentNodesFromAttribute('tagName', 'form', _this2)

                  if (forms) {
                    forms[0].submit()
                  }
                }

                _get(_getPrototypeOf(PseudoElement.prototype), 'setDefaultEvent', this).call(this, 'click', callback)
              }
          }

          return callback
        }
        /**
     *
     * @param {PseudoNode|PseudoElement} childElement
     * @returns {PseudoNode}
     */

      }, {
        key: 'appendChild',
        value: function appendChild (childElement) {
          _get(_getPrototypeOf(PseudoElement.prototype), 'appendChild', this).call(this, childElement)

          childElement.applyDefaultEvent()
          return childElement
        }
        /**
     * Check if an attribute is assigned to this element.
     * @param {string} attributeName - The attribute name to check
     * @returns {boolean}
     */

      }, {
        key: 'hasAttribute',
        value: function hasAttribute (attributeName) {
          return this.getAttribute(attributeName) !== 'undefined'
        }
        /**
     * Assign a new attribute or overwrite an assigned attribute with name and value.
     * @param {string} attributeName - The name key of the attribute to append
     * @param {string|Object} attributeValue - The value of the attribute to append
     * @returns {undefined}
     */

      }, {
        key: 'setAttribute',
        value: function setAttribute (attributeName, attributeValue) {
          if (this.hasAttribute(attributeName) || this[attributeName] === 'undefined') {
            this[attributeName] = attributeValue
            this.attributes.push({
              name: attributeName,
              value: attributeValue
            })
          }

          return undefined
        }
        /**
     * Retrieve the value of the specified attribute from the Element
     * @param {string} attributeName - A string representing the name of the attribute to be retrieved
     * @returns {string|Object}
     */

      }, {
        key: 'getAttribute',
        value: function getAttribute (attributeName) {
          return this.attributes.find(function (attribute) {
            return attribute.name === attributeName
          })
        } // noinspection JSUnusedGlobalSymbols

        /**
     * Remove an assigned attribute from the Element
     * @param {string} attributeName - The string name of the attribute to be removed
     * @returns {null}
     */

      }, {
        key: 'removeAttribute',
        value: function removeAttribute (attributeName) {
          if (this.hasAttribute(attributeName)) {
            delete this[attributeName]
            delete this.getAttribute(attributeName)
          }

          return null
        }
      }])

      return PseudoElement
    }(require('./PseudoNode')))

    module.exports = PseudoElement
  }, { './PseudoEvent': 11, './PseudoNode': 16 }],
  11: [function (require, module, exports) {
    /**
 * @file Substitute for the DOM Event Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    'use strict'

    function _defineProperty (obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }) } else { obj[key] = value } return obj }

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

    function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor }

    const _require = require('../../core/core.js')
    const curry = _require.curry
    /**
 * Simulate the behaviour of the Event Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {number} NONE
 * @property {number} CAPTURING_PHASE
 * @property {number} AT_TARGET
 * @property {number} BUBBLING_PHASE
 * @property {boolean} bubbles - A Boolean indicating whether the event bubbles up through the Dom or not.
 * @property {boolean} cancelable - A Boolean indicating whether the event is cancelable.
 * @property {boolean} composed - A Boolean value indicating whether or not the event can bubble across the boundary
 * between the shadow Dom and the regular Dom.
 * @property {function|PseudoEventTarget} currentTarget - A reference to the currently registered target for the event. This
 * is the object to which the event is currently slated to be sent; it's possible this has been changed along the way
 * through re-targeting.
 * @property {boolean} defaultPrevented - Indicates whether or not event.preventDefault() has been called on the event.
 * @property {boolean} immediatePropagationStopped - Flag that no further propagation should occur, including on current
 * target.
 * @property {boolean} propagationStopped - Flag that no further propagation should occur.
 * @property {int} eventPhase - Indicates which phase of the event flow is being processed. Uses PseudoEvent constants.
 * @property {EventTarget|PseudoEventTarget} target - A reference to the target to which the event was originally
 * dispatched.
 * @property {int} timeStamp - The time at which the event was created (in milliseconds). By specification, this
 * value is time since epoch, but in reality browsers' definitions vary; in addition, work is underway to change this
 * to be a DomHighResTimeStamp instead.
 * @property {string} type - The name of the event (case-insensitive).
 * @property {boolean} isTrusted - Indicates whether or not the event was initiated by the browser (after a user
 * click for instance) or by a script (using an event creation method, like event.initEvent)
 */

    const PseudoEvent = /* #__PURE__ */(function () {
      /**
   *
   * @param typeArg
   * @param bubbles
   * @param cancelable
   * @param composed
   * @returns {PseudoEvent}
   * @constructor
   */
      function PseudoEvent () {
        const _this = this

        const typeArg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''

        const _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
        const _ref$bubbles = _ref.bubbles
        const bubbles = _ref$bubbles === void 0 ? true : _ref$bubbles
        const _ref$cancelable = _ref.cancelable
        const cancelable = _ref$cancelable === void 0 ? true : _ref$cancelable
        const _ref$composed = _ref.composed
        const composed = _ref$composed === void 0 ? true : _ref$composed

        _classCallCheck(this, PseudoEvent)

        let properties = {
          bubbles: bubbles,
          cancelable: cancelable,
          composed: composed,
          currentTarget: function currentTarget () {
            return undefined
          },
          defaultPrevented: false,
          immediatePropagationStopped: false,
          propagationStopped: false,
          eventPhase: '',
          target: function target () {
            return undefined
          },
          timeStamp: Math.floor(Date.now() / 1000),
          type: typeArg,
          isTrusted: true
        }

        this.setReadOnlyProperties = function () {
          const updateProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
          properties = Object.assign({}, properties, updateProps)

          _this.getReadOnlyProperties = (function (properties) {
            return function () {
              const name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''
              return properties[name]
            }
          }(properties))

          return properties
        }

        this.setReadOnlyProperties()
        Object.keys(properties).map(function (propKey) {
          return Object.defineProperty(_this, propKey, {
            enumerable: true,
            get: function get () {
              return _this.getReadOnlyProperties(propKey)
            }
          })
        })
      }
      /**
   * A selector function for retrieving existing parent PseudoNode from the given child item.
   * This function will check all the parents starting from node, and scan the attributes
   * property for matches. The return array contains all matching parent ancestors.
   * WARNING: This is a recursive function.
   * @param {string} attr
   * @param {number|string} value
   * @param {PseudoNode} node
   * @returns {Array.<PseudoNode>}
   */

      _createClass(PseudoEvent, [{
        key: 'composedPath',
        value:
    /**
     * Return an array of targets that will have the event executed open them. The order is based on the eventPhase
     * @method
     * @returns {Array.<PseudoEventTarget>}
     */
    function composedPath () {
      switch (this.eventPhase) {
        case PseudoEvent.CAPTURING_PHASE:
          return PseudoEvent.getParentNodes(this.target)

        case PseudoEvent.BUBBLING_PHASE:
          return PseudoEvent.getParentNodes(this.target).slice().reverse()

        case PseudoEvent.AT_TARGET:
          return [this.target]

        default:
          return []
      }
    }
    /**
     * Cancels the event (if it is cancelable).
     * @method
     * @returns {null}
     */

      }, {
        key: 'preventDefault',
        value: function preventDefault () {
          this.setReadOnlyProperties({
            defaultPrevented: true
          })
          return null
        }
        /**
     * For this particular event, no other listener will be called.
     * Neither those attached on the same element, nor those attached on elements which will be traversed later (in
     * capture phase, for instance)
     * @method
     * @returns {null}
     */

      }, {
        key: 'stopImmediatePropagation',
        value: function stopImmediatePropagation () {
          this.setReadOnlyProperties({
            immediatePropagationStopped: true
          })
          return null
        }
        /**
     * Stops the propagation of events further along in the Dom.
     * @method
     * @returns {null}
     */

      }, {
        key: 'stopPropagation',
        value: function stopPropagation () {
          this.setReadOnlyProperties({
            propagationStopped: true
          })
          return null
        }
      }], [{
        key: 'getParentNodesFromAttribute',
        value: function getParentNodesFromAttribute (attr, value, node) {
          return Object.keys(node.parent).length ? (node.parent[attr] || false) === value ? PseudoEvent.getParentNodesFromAttribute(attr, value, node.parent).concat([node.parent]) : PseudoEvent.getParentNodesFromAttribute(attr, value, node.parent) : []
        }
        /**
     * A helper selector function for retrieving all parent PseudoNode for the given child node.
     * @param {PseudoNode} node
     * @returns {Array.<PseudoNode>}
     */

      }, {
        key: 'getParentNodes',
        value: function getParentNodes () {
          return curry(PseudoEvent.getParentNodesFromAttribute)('', false)()
        }
      }])

      return PseudoEvent
    }()); // Set up the class constants

    ['NONE', 'CAPTURING_PHASE', 'AT_TARGET', 'BUBBLING_PHASE'].reduce(function (phases, phase, key) {
      Object.defineProperty(PseudoEvent, phase, {
        value: key,
        writable: false,
        static: {
          get: function get () {
            return key
          }
        }
      })
      return Object.assign({}, phases, _defineProperty({}, ''.concat(phase), key))
    }, {})
    module.exports = PseudoEvent
  }, { '../../core/core.js': 5 }],
  12: [function (require, module, exports) {
    /**
 * @file Substitute for the DOM EventEventListener Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    'use strict'

    const PseudoEvent = require('./PseudoEvent')
    /**
 * Handle events as they are stored and implemented.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {string} eventTypes
 * @property {Object} eventOptions
 * @property {boolean} isDefault
 */

    const PseudoEventListener = {
      eventType: '',
      eventOptions: {
        capture: false,
        once: false,
        passive: false
      },
      isDefault: false,

      /**
   * @method
   * @name PseudoEventListener#handleEvent
   * @param {PseudoEvent} event
   * @returns {undefined}
   */
      handleEvent: function handleEvent (event) {
        return undefined
      },

      /**
   * @method
   * @name PseudoEventListener#doCapturePhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      doCapturePhase: function doCapturePhase (event) {
        return event.eventPhase === PseudoEvent.CAPTURING_PHASE && this.eventOptions.capture
      },

      /**
   * @method
   * @name PseudoEventListener#doTargetPhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      doTargetPhase: function doTargetPhase (event) {
        return event.eventPhase === PseudoEvent.AT_TARGET
      },

      /**
   * @method
   * @name PseudoEventListener#doBubblePhase
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
      doBubblePhase: function doBubblePhase (event) {
        return event.eventPhase === PseudoEvent.BUBBLING_PHASE && (event.bubbles || !this.eventOptions.capture)
      },

      /**
   * @method
   * @name PseudoEventListener#skipPhase
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      skipPhase: function skipPhase (event) {
        return !this.doCapturePhase(event) && !this.doTargetPhase(event) && !this.doBubblePhase(event)
      },

      /**
   * @method
   * @name PseudoEventListener#skipDefault
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
      skipDefault: function skipDefault (event) {
        return this.isDefault && event.defaultPrevented
      },

      /**
   * @method
   * @name PseudoEventListener#stopPropagation
   * @param {PseudoEvent} event
   * @returns {boolean}
   */
      stopPropagation: function stopPropagation (event) {
        return !this.doTargetPhase(event) && event.propagationStopped
      },

      /**
   * @method
   * @name PseudoEventListener#nonPassiveHalt
   * @param {PseudoEvent} event
   * @returns {boolean|*}
   */
      nonPassiveHalt: function nonPassiveHalt (event) {
        return !this.eventOptions.passive && (this.skipDefault(event) || event.immediatePropagationStopped || this.stopPropagation(event))
      },

      /**
   * @method
   * @name PseudoEventListener#rejectEvent
   * @param {PseudoEvent} event
   * @returns {*|boolean}
   */
      rejectEvent: function rejectEvent (event) {
        return this.nonPassiveHalt(event) || this.skipPhase(event)
      }
    }
    module.exports = PseudoEventListener
  }, { './PseudoEvent': 11 }],
  13: [function (require, module, exports) {
    /**
 * @file Substitute for the DOM EventTarget Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    'use strict'

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

    function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor }

    const PseudoEvent = require('./PseudoEvent')

    const PseudoEventListener = require('./PseudoEventListener')
    /**
 * Simulate the behaviour of the EventTarget Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {Object.<string, Array.<PseudoEventListener>>} listeners
 * @property {function} addEventListener
 * @property {function} removeEventListener
 * @property {function} dispatchEvent
 */

    const PseudoEventTarget = /* #__PURE__ */(function () {
      /**
   * @constructor
   */
      function PseudoEventTarget () {
        _classCallCheck(this, PseudoEventTarget)

        this.listeners = []
        this.defaultEvent = []
      }
      /**
   *
   * @param {PseudoEvent} event
   * @returns {boolean}
   */

      _createClass(PseudoEventTarget, [{
        key: 'runEvents',
        value: function runEvents (event) {
          if (!(event.type in this.listeners)) {
            return true
          }
          /**
       *
       * @type {Array<PseudoEventListener>}
       */

          const stack = this.listeners[event.type]
          let eventReturn = null
          this.listeners[event.type] = stack.reduce(
          /**
       *
       * @param {Array<PseudoEventListener>} listeners
       * @param {PseudoEventListener} listener
       * @returns {Array<PseudoEventListener>}
       */
            function (listeners, listener) {
              if (event.immediatePropagationStopped || listener.rejectEvent(event)) {
                return listeners.concat(listener)
              }

              eventReturn = listener.handleEvent(event)

              if (listener.eventOptions.once) {
                event.currentTarget.removeEventListener(event.eventType, event.handleEvent)
                return listeners
              }

              return listeners.concat(listener)
            }, [])
          return eventReturn
        }
        /**
     *
     * @param {string} type
     * @param {Function} callback
     */

      }, {
        key: 'setDefaultEvent',
        value: function setDefaultEvent (type, callback) {
          const _this = this

          if (!(type in this.listeners)) {
            this[type] = function () {
              return _this.startEvents(type)
            }

            this.listeners[type] = []
          }

          this.defaultEvent[type] = callback
        }
        /**
     *
     * @param {PseudoEvent} event
     * @returns {boolean}
     */

      }, {
        key: 'runDefaultEvent',
        value: function runDefaultEvent (event) {
          if (event.defaultPrevented) {
            return false
          }

          this.defaultEvent[event.type](event)
        }
        /**
     *
     * @param {PseudoEvent} eventType
     * @returns {boolean}
     */

      }, {
        key: 'startEvents',
        value: function startEvents (eventType) {
          const _this2 = this

          /**
       * type PseudoEvent
       */
          const event = new PseudoEvent(eventType)
          event.setReadOnlyProperties({
            target: this
          })
          console.log('startEvents', event.type, event.target);
          [PseudoEvent.CAPTURING_PHASE, PseudoEvent.AT_TARGET, PseudoEvent.BUBBLING_PHASE].forEach(function (phase) {
            let continueEvents = null

            if (phase === PseudoEvent.AT_TARGET || !event.propagationStopped) {
              event.setReadOnlyProperties({
                eventPhase: phase
              })
              event.composedPath().forEach(function (target) {
                event.setReadOnlyProperties({
                  currentTarget: target
                })
                continueEvents = event.currentTarget.runEvents(event)
              })
            }

            if (event.eventPhase === PseudoEvent.AT_TARGET && typeof continueEvents !== 'boolean' && _this2.defaultEvent[eventType]) {
              _this2.runDefaultEvent(event)
            }
          })
          return true
        }
        /**
     *
     * @param {string} type
     * @param {function|Object} callback
     * @param {boolean|Object} [useCapture=false]
     */

      }, {
        key: 'addEventListener',
        value: function addEventListener (type, callback) {
          const _this3 = this

          const useCapture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false
          let options = {
            capture: false,
            once: false,
            passive: false
          }

          if (_typeof(useCapture) === 'object') {
            options = Object.keys(useCapture).reduce(function (opts, opt) {
              opts[opt] = useCapture[opt]
              return opts
            }, options)
          } else {
            options.capture = useCapture
          }

          if (!(type in this.listeners)) {
            this[type] = function () {
              return _this3.startEvents(type)
            }

            this.listeners[type] = []
          }

          this.listeners[type] = this.listeners[type].concat([Object.assign(Object.create(PseudoEventListener), PseudoEventListener, {
            eventType: type,
            eventOptions: Object.assign({}, PseudoEventListener.eventOptions, options),
            handleEvent: (callback.handleEvent || callback).bind(this)
          })])
          const groupedDefault = this.listeners[type].reduce(function (listeners, listener) {
            return listener.isDefault
              ? Object.assign({}, listeners, {
                default: listeners.default.concat([listener])
              })
              : Object.assign({}, listeners, {
                explicit: listeners.explicit.concat([listener])
              })
          }, {
            explicit: [],
            default: []
          })
          this.listeners[type] = [].concat(groupedDefault.explicit, groupedDefault.default)
        }
        /**
     *
     * @param {string} type
     * @param {function} callback
     */

      }, {
        key: 'removeEventListener',
        value: function removeEventListener (type, callback) {
          if (!(type in this.listeners)) {
            return
          }

          const stack = this.listeners[type]

          for (let i = 0, l = stack.length; i < l; i++) {
            if (stack[i].handleEvent === callback && !stack[i].isDefault) {
              stack.splice(i, 1)
              return
            }
          }
        }
        /**
     *
     * @param {Event|PseudoEvent} event
     * @param {EventTarget|PseudoEventTarget} target
     * @returns {boolean}
     */

      }, {
        key: 'dispatchEvent',
        value: function dispatchEvent (event) {
          const target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this
          event.setReadOnlyProperties({
            target: target
          })

          if (!(event.type in this.listeners)) {
            return true
          }

          this.runEvents(event)
          return !event.defaultPrevented
        }
      }])

      return PseudoEventTarget
    }())

    module.exports = PseudoEventTarget
  }, { './PseudoEvent': 11, './PseudoEventListener': 12 }],
  14: [function (require, module, exports) {
    /**
 * @file Substitute for the DOM HTMLDocument Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    'use strict'
    /**
 *
 * @type {PseudoHTMLElement}
 */

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

    function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor }

    function _inherits (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function') } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass) }

    function _setPrototypeOf (o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) { o.__proto__ = p; return o }; return _setPrototypeOf(o, p) }

    function _createSuper (Derived) { const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget) } else { result = Super.apply(this, arguments) } return _possibleConstructorReturn(this, result) } }

    function _possibleConstructorReturn (self, call) { if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call } return _assertThisInitialized(self) }

    function _assertThisInitialized (self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return self }

    function _isNativeReflectConstruct () { if (typeof Reflect === 'undefined' || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === 'function') return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true } catch (e) { return false } }

    function _getPrototypeOf (o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf (o) { return o.__proto__ || Object.getPrototypeOf(o) }; return _getPrototypeOf(o) }

    const PseudoHTMLElement = require('./PseudoHTMLElement')
    /**
 * Simulate the behaviour of the HTMLDocument Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoHTMLElement
 * @property {PseudoHTMLElement} head - A reference to the Head child element
 * @property {PseudoHTMLElement} body - A reference to the Body child element
 * @property {function} createElement - Generate a new PseudoHTMLElement with parent of document
 */

    const PseudoHTMLDocument = /* #__PURE__ */(function (_PseudoHTMLElement) {
      _inherits(PseudoHTMLDocument, _PseudoHTMLElement)

      const _super = _createSuper(PseudoHTMLDocument)

      /**
   * The root HTML element is acts as the parent to all HTML elements in the document.
   * @returns {PseudoHTMLDocument}
   * @constructor
   */
      function PseudoHTMLDocument () {
        let _this

        _classCallCheck(this, PseudoHTMLDocument)

        _this = _super.call(this)
        const html = new PseudoHTMLElement({
          tagName: 'html',
          parent: _assertThisInitialized(_this)
        })
        /**
     * Create document head element
     * @type {PseudoHTMLElement}
     */

        _this.head = new PseudoHTMLElement({
          tagName: 'head',
          parent: html
        })
        /**
     * Create document body element
     * @type {PseudoHTMLElement}
     */

        _this.body = new PseudoHTMLElement({
          tagName: 'body',
          parent: html
        })
        html.children = [_this.head, _this.body]
        /**
     * Create document child element
     * @type {PseudoHTMLElement[]}
     */

        _this.children = [html]
        return _this
      }
      /**
   * Create and return a PseudoHTMLElement
   * @param {string} tagName - Tag Name is a string representing the type of Dom element this represents
   * @returns {PseudoHTMLElement}
   */

      _createClass(PseudoHTMLDocument, [{
        key: 'createElement',
        value: function createElement () {
          const tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div'
          const returnElement = new PseudoHTMLElement({
            tagName: tagName
          })
          returnElement.parent = this
          return returnElement
        }
      }])

      return PseudoHTMLDocument
    }(PseudoHTMLElement))

    module.exports = PseudoHTMLDocument
  }, { './PseudoHTMLElement': 15 }],
  15: [function (require, module, exports) {
    /**
 * @file Substitute for the DOM HTMLElement Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    'use strict'
    /**
 * Simulate the behaviour of the HTMLElement Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @augments PseudoElement
 * @property {boolean} hidden - State of whether element is visible
 * @property {number} offsetHeight - The height of the element as offset by the parent element
 * @property {number} offsetLeft - The position of the left side of the element based on the parent element
 * @property {PseudoHTMLElement} offsetParent - A reference to the closest positioned parent element
 * @property {number} offsetTop - The position of the top side of the element based on the parent element
 * @property {number} offsetWidth - The width of the element as offset by the parent element
 * @property {Object} style - A container to define all applied inline-styles
 * @property {string} title - The title attribute which affects the text visible on hover
 */

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

    function _inherits (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function') } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass) }

    function _setPrototypeOf (o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) { o.__proto__ = p; return o }; return _setPrototypeOf(o, p) }

    function _createSuper (Derived) { const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget) } else { result = Super.apply(this, arguments) } return _possibleConstructorReturn(this, result) } }

    function _possibleConstructorReturn (self, call) { if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call } return _assertThisInitialized(self) }

    function _assertThisInitialized (self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return self }

    function _isNativeReflectConstruct () { if (typeof Reflect === 'undefined' || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === 'function') return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true } catch (e) { return false } }

    function _getPrototypeOf (o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf (o) { return o.__proto__ || Object.getPrototypeOf(o) }; return _getPrototypeOf(o) }

    const PseudoHTMLElement = /* #__PURE__ */(function (_require) {
      _inherits(PseudoHTMLElement, _require)

      const _super = _createSuper(PseudoHTMLElement)

      /**
   * Simulate the HTMLELement object when the Dom is not available
   * @param {string} [tagName=''] - The
   * @param {PseudoNode|Object} [parent={}]
   * @param {Array} [children=[]]
   * @returns {PseudoHTMLElement}
   * @constructor
   */
      function PseudoHTMLElement () {
        const _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        const _ref$tagName = _ref.tagName
        const tagName = _ref$tagName === void 0 ? '' : _ref$tagName
        const _ref$parent = _ref.parent
        const parent = _ref$parent === void 0 ? {} : _ref$parent
        const _ref$children = _ref.children
        const children = _ref$children === void 0 ? [] : _ref$children

        _classCallCheck(this, PseudoHTMLElement)

        return _super.call(this, {
          tagName: tagName,
          attributes: [{
            name: 'hidden',
            value: false
          }, {
            name: 'offsetHeight',
            value: 0
          }, {
            name: 'offsetLeft',
            value: 0
          }, {
            name: 'offsetParent',
            value: null
          }, {
            name: 'offsetTop',
            value: 0
          }, {
            name: 'offsetWidth',
            value: 0
          }, {
            name: 'style',
            value: {}
          }, {
            name: 'title',
            value: ''
          }],
          parent: parent,
          children: children
        })
      }

      return PseudoHTMLElement
    }(require('./PseudoElement')))

    module.exports = PseudoHTMLElement
  }, { './PseudoElement': 10 }],
  16: [function (require, module, exports) {
    /**
 * @file Substitute for the DOM Node Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    'use strict'

    function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor) } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor }

    function _typeof (obj) { '@babel/helpers - typeof'; if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') { _typeof = function _typeof (obj) { return typeof obj } } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj } } return _typeof(obj) }

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

    function _inherits (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function') } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass) }

    function _setPrototypeOf (o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) { o.__proto__ = p; return o }; return _setPrototypeOf(o, p) }

    function _createSuper (Derived) { const hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { const Super = _getPrototypeOf(Derived); let result; if (hasNativeReflectConstruct) { const NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget) } else { result = Super.apply(this, arguments) } return _possibleConstructorReturn(this, result) } }

    function _possibleConstructorReturn (self, call) { if (call && (_typeof(call) === 'object' || typeof call === 'function')) { return call } return _assertThisInitialized(self) }

    function _assertThisInitialized (self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called") } return self }

    function _isNativeReflectConstruct () { if (typeof Reflect === 'undefined' || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === 'function') return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true } catch (e) { return false } }

    function _getPrototypeOf (o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf (o) { return o.__proto__ || Object.getPrototypeOf(o) }; return _getPrototypeOf(o) }

    const TreeLinker = require('../../collections/TreeLinker')

    const PseudoEventTarget = require('./PseudoEventTarget')

    const NodeFactory = /* #__PURE__ */(function (_TreeLinker) {
      _inherits(NodeFactory, _TreeLinker)

      const _super = _createSuper(NodeFactory)

      function NodeFactory () {
        _classCallCheck(this, NodeFactory)

        return _super.apply(this, arguments)
      }

      return NodeFactory
    }(TreeLinker))

    module.exports.generateNode = function () {
      NodeFactory.fromArray = function () {
        const values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
        const LinkerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NodeFactory
        return values.reduce(function (list, element) {
          if (_typeof(element) !== 'object') {
            element = {
              data: element
            }
          }

          let newList = false

          if (list === null) {
            newList = true
            list = new LinkerClass(Object.assign({}, element, {
              prev: list
            }))
          }
          /**
       * Simulate the behaviour of the Node Class when there is no DOM available.
       * @author Joshua Heagle <joshuaheagle@gmail.com>
       * @class
       * @augments PseudoEventTarget
       * @property {string} name
       * @property {function} appendChild
       * @property {function} removeChild
       */

          const PseudoNode = /* #__PURE__ */(function (_PseudoEventTarget) {
            _inherits(PseudoNode, _PseudoEventTarget)

            const _super2 = _createSuper(PseudoNode)

            /**
         *
         * @constructor
         */
            function PseudoNode () {
              let _this

              _classCallCheck(this, PseudoNode)

              _this = _super2.call(this)
              _this.nodeValue = element.data
              _this.textContext = ''
              return _this
            }

            _createClass(PseudoNode, [{
              key: 'baseURI',
              get: function get () {
                return window.location || '/'
              }
            }, {
              key: 'childNodes',
              get: function get () {
                return list.children
              }
            }, {
              key: 'firstChild',
              get: function get () {
                return list.children.first.data
              }
            }, {
              key: 'isConnected',
              get: function get () {
                return list.parent !== null
              }
            }, {
              key: 'lastChild',
              get: function get () {
                return list.children.last.data
              }
            }, {
              key: 'nextSibling',
              get: function get () {
                return list.next.data
              }
            }, {
              key: 'nodeName',
              get: function get () {
                return this.name || ''
              }
            }, {
              key: 'nodeType',
              get: function get () {
                const typeName = 'DEFAULT_NODE'
                const nodeTypes = ['DEFAULT_NODE', 'ELEMENT_NODE', 'ATTRIBUTE_NODE', 'TEXT_NODE', 'CDATA_SECTION_NODE', 'ENTITY_REFERENCE_NODE', 'ENTITY_NODE', 'PROCESSING_INSTRUCTION_NODE', 'COMMENT_NODE', 'DOCUMENT_NODE', 'DOCUMENT_TYPE_NODE', 'DOCUMENT_FRAGMENT_NODE', 'NOTATION_NODE']
                return nodeTypes.indexOf(typeName)
              }
            }, {
              key: 'ownerDocument',
              get: function get () {
                return list.rootParent
              }
            }, {
              key: 'parentNode',
              get: function get () {
                return list.parent
              }
            }, {
              key: 'parentElement',
              get: function get () {
                return list.parent.nodeType === 1 ? list.parent : null
              }
            }, {
              key: 'previousSibling',
              get: function get () {
                return list.prev
              }
              /**
           *
           * @param {PseudoNode} childNode
           * @returns {PseudoNode}
           */

            }, {
              key: 'appendChild',
              value: function appendChild (childNode) {
                list.after(list, [childNode])
                return childNode
              }
            }, {
              key: 'cloneNode',
              value: function cloneNode () {}
            }, {
              key: 'compareDocumentPosition',
              value: function compareDocumentPosition () {}
            }, {
              key: 'contains',
              value: function contains () {}
            }, {
              key: 'getRootNode',
              value: function getRootNode () {
                return list.rootParent
              }
            }, {
              key: 'hasChildNodes',
              value: function hasChildNodes () {}
            }, {
              key: 'insertBefore',
              value: function insertBefore () {}
            }, {
              key: 'isDefaultNamespace',
              value: function isDefaultNamespace () {}
            }, {
              key: 'isEqualNode',
              value: function isEqualNode () {}
            }, {
              key: 'isSameNode',
              value: function isSameNode () {}
            }, {
              key: 'lookupPrefix',
              value: function lookupPrefix () {}
            }, {
              key: 'lookupNamespaceURI',
              value: function lookupNamespaceURI () {}
            }, {
              key: 'normalize',
              value: function normalize () {}
              /**
           *
           * @param {PseudoNode} childElement
           * @returns {PseudoNode}
           */

            }, {
              key: 'removeChild',
              value: function removeChild (childElement) {
                return this.children.splice(this.children.indexOf(childElement), 1)[0]
              }
            }, {
              key: 'replaceChild',
              value: function replaceChild () {}
            }])

            return PseudoNode
          }(PseudoEventTarget))

          module.exports.PseudoNode = PseudoNode

          if (newList) {
            list.data = new PseudoNode()
            return list
          }

          element.data = new PseudoNode()
          return TreeLinker.prototype.after.apply(list, [element])
        }, null)
      }

      return NodeFactory
    }

    module.exports.NodeFactory = NodeFactory
  }, { '../../collections/TreeLinker': 4, './PseudoEventTarget': 13 }],
  17: [function (require, module, exports) {
    /**
 * @file All of the Pseudo Dom Helper Objects functions for simulating parts of the DOM when running scripts in NodeJs.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
    'use strict';

    (function () {
      /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
      const root = this || {}
      /**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */

      const previousJDomPseudoDom = root.jDomPseudoDom || {}
      /**
   * All methods exported from this module are encapsulated within jDomPseudoDom.
   * @author Joshua Heagle <joshuaheagle@gmail.com>
   * @typedef {Object} jDomPseudoDom
   * @module jDom/pseudoDom/objects
   */

      const jDomPseudoDom = {}
      root.jDomPseudoDom = jDomPseudoDom
      /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {jDomPseudoDom}
   */

      jDomPseudoDom.noConflict = function () {
        root.jDomPseudoDom = previousJDomPseudoDom
        return jDomPseudoDom
      }
      /**
   * @type {PseudoEvent}
   */

      jDomPseudoDom.PseudoEvent = require('./class/PseudoEvent')
      /**
   * @type {PseudoEventTarget}
   */

      jDomPseudoDom.PseudoEventTarget = require('./class/PseudoEventTarget')
      /**
   * @type {PseudoNode}
   */

      jDomPseudoDom.PseudoNode = require('./class/PseudoNode')
      /**
   * @type {PseudoElement}
   */

      jDomPseudoDom.PseudoElement = require('./class/PseudoElement')
      /**
   * @type {PseudoHTMLElement}
   */

      jDomPseudoDom.PseudoHTMLElement = require('./class/PseudoHTMLElement')
      /**
   * @type {PseudoHTMLDocument}
   */

      jDomPseudoDom.PseudoHTMLDocument = require('./class/PseudoHTMLDocument')
      /**
   * Construct the Pseudo Dom to provide access to Dom objects which are otherwise not available outside of the browser
   * context.
   * @function generate
   * @param {Object} context
   * @returns {Window|PseudoEventTarget}
   */

      jDomPseudoDom.generate = function () {
        const context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

        /**
     *
     * @type {Window|PseudoEventTarget}
     */
        const window = typeof root.document === 'undefined' ? root : new jDomPseudoDom.PseudoEventTarget()
        /**
     * @type {Node|PseudoNode}
     */

        const Node = root.Node || new jDomPseudoDom.PseudoNode()

        if (typeof window.Node === 'undefined') {
          window.Node = Node
        }
        /**
     *
     * @type {Element|PseudoElement}
     */

        const Element = root.Element || new jDomPseudoDom.PseudoElement()

        if (typeof window.Element === 'undefined') {
          window.Element = Element
        }
        /**
     * Create an instance of HTMLElement if not available
     * @type {HTMLElement|PseudoHTMLElement}
     */

        const HTMLElement = root.HTMLElement || new jDomPseudoDom.PseudoHTMLElement()

        if (typeof window.HTMLElement === 'undefined') {
          window.HTMLElement = HTMLElement
        }
        /**
     * Define document when not available
     * @type {Document|PseudoHTMLDocument}
     */

        const document = root.document || new jDomPseudoDom.PseudoHTMLDocument()

        if (typeof window.document === 'undefined') {
          window.document = document
        }

        return context ? Object.assign(context, jDomPseudoDom, window) : Object.assign(root, window)
      }
      /**
   * Either export all functions to be exported, or assign to the Window context
   */

      if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
          exports = module.exports = jDomPseudoDom
        }

        exports = Object.assign(exports, jDomPseudoDom)
      }
    }).call(void 0 || window || {}) // Use the external context to assign this, which will be Window if rendered via browser
  }, { './class/PseudoElement': 10, './class/PseudoEvent': 11, './class/PseudoEventTarget': 13, './class/PseudoHTMLDocument': 14, './class/PseudoHTMLElement': 15, './class/PseudoNode': 16 }],
  18: [function (require, module, exports) {
    'use strict';

    (function () {
      /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
      const root = this || {}
      /**
   * Store reference to any pre-existing module of the same name
   * @type {gameLayout|*}
   */

      const previousGameLayout = root.gameLayout || {}
      /**
   * A reference to all functions to be used globally / exported
   * @typedef {Object} gameLayout
   * @module game/layout
   */

      const gameLayout = {}
      root.gameLayout = gameLayout
      /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {gameLayout}
   */

      gameLayout.noConflict = function () {
        root.gameLayout = previousGameLayout
        return gameLayout
      }
      /**
   * Verify availability of jDomCore
   * @typedef {*|module:jDom/core/dom/objects} jDomObjects
   */

      let jDomObjects = root.jDomObjects
      /**
   * If jDomObjects remains undefined, attempt to retrieve it as a module
   */

      if (typeof jDomObjects === 'undefined') {
        if (typeof require !== 'undefined') {
          jDomObjects = require('./jDom/core/dom/objects.js')
        } else {
          console.error('layout.js requires jDomObjects')
        }
      }
      /**
   * This will be the main menu for the game.
   * @function mainMenu
   * @returns {module:jDom/core/dom/objects.DomItem}
   */

      gameLayout.mainMenu = function () {
        return jDomObjects.createDomItem({
          tagName: 'div',
          attributes: {
            className: 'main-menu'
          },
          children: [{
            tagName: 'div',
            attributes: {
              className: 'content'
            },
            children: [{
              tagName: 'form',
              attributes: {
                name: 'mainMenuForm',
                className: 'main-menu-form'
              },
              eventListeners: {
                submit: {
                  listenerFunc: 'beginRound',
                  listenerArgs: {},
                  listenerOptions: false
                }
              },
              children: [{
                tagName: 'div',
                attributes: {
                  className: 'form-group'
                },
                children: [{
                  tagName: 'label',
                  attributes: {
                    for: 'human-players',
                    innerText: 'Humans'
                  }
                }, {
                  tagName: 'input',
                  attributes: {
                    id: 'human-players',
                    name: 'human-players',
                    type: 'number',
                    value: 0,
                    min: 0,
                    max: 100,
                    required: ''
                  }
                }]
              }, {
                tagName: 'div',
                attributes: {
                  className: 'form-group'
                },
                children: [{
                  tagName: 'label',
                  attributes: {
                    for: 'robot-players',
                    innerText: 'Robots'
                  }
                }, {
                  tagName: 'input',
                  attributes: {
                    id: 'robot-players',
                    name: 'robot-players',
                    type: 'number',
                    value: 0,
                    min: 0,
                    max: 100,
                    required: ''
                  }
                }]
              }, {
                tagName: 'label',
                attributes: {
                  for: 'first-go-first',
                  innerText: 'First Player Starts'
                }
              }, {
                tagName: 'input',
                attributes: {
                  id: 'first-go-first',
                  name: 'first-go-first',
                  type: 'checkbox'
                }
              }, {
                tagName: 'input',
                attributes: {
                  type: 'submit',
                  value: 'Start'
                }
              }]
            }]
          }]
        })
      }
      /**
   * Wrapper div for player data / boards
   * @function boards
   * @param {Array} [players=[]]
   * @returns {module:jDom/core/dom/objects.DomItem}
   */

      gameLayout.boards = function () {
        const players = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []
        return jDomObjects.createDomItem({
          tagName: 'div',
          attributes: {
            className: 'boards'
          },
          children: players
        })
      }
      /**
   * Display the final scores after a game has ended and have a button to restart.
   * @function finalScore
   * @param {Array} players
   * @returns {module:jDom/core/dom/objects.DomItem}
   */

      gameLayout.finalScore = function (players) {
        return jDomObjects.createDomItem({
          tagName: 'div',
          attributes: {
            className: 'final-scores'
          },
          children: [{
            tagName: 'div',
            attributes: {
              className: 'score-cards'
            },
            children: players.map(function (player) {
              return {
                tagName: 'div',
                attributes: {
                  className: 'score-card',
                  innerHTML: '<strong>'.concat(player.name, '</strong><hr><br></strong><strong>Status:</strong> ').concat(Math.round(player.status * 100) / 100, '%, <strong>Sunk:</strong> ').concat(player.attacks.sunk, '<br><strong>Hit:</strong> ').concat(player.attacks.hit, ' / <strong>Miss:</strong> ').concat(player.attacks.miss, '<br><strong>Turns:</strong> ').concat(player.turnCnt)
                }
              }
            })
          }, {
            tagName: 'input',
            attributes: {
              type: 'button',
              value: 'Restart'
            },
            eventListeners: {
              click: {
                listenerFunc: 'restart',
                listenerArgs: {},
                listenerOptions: false
              }
            }
          }]
        })
      }
      /**
   * Either export all functions to be exported, or assign to the Window context
   */

      if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
          exports = module.exports = gameLayout
        }

        exports = Object.assign(exports, gameLayout)
      }
    }).call(void 0 || window || {}) // Use the external context to assign this, which will be Window if rendered via browser
  }, { './jDom/core/dom/objects.js': 7 }],
  19: [function (require, module, exports) {
    'use strict';

    (function () {
      /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
      const root = this || {}
      /**
   * Store reference to any pre-existing module of the same name
   * @type {gameMain|*}
   */

      const previousGameMain = root.gameMain || {}
      /**
   * A reference to all functions to be used globally / exported
   * @typedef (Object) gameMain
   * @module game/main
   */

      const gameMain = {}
      root.gameMain = gameMain
      /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {gameMain}
   */

      gameMain.noConflict = function () {
        root.gameMain = previousGameMain
        return gameMain
      }
      /**
   * Verify availability of jDomObjects
   * @typedef {*|module:jDom/core/dom/objects} jDomObjects
   */

      let jDomObjects = root.jDomObjects
      /**
   * If jDomObjects remains undefined, attempt to retrieve it as a module
   */

      if (typeof jDomObjects === 'undefined') {
        if (typeof require !== 'undefined') {
          jDomObjects = require('./jDom/core/dom/objects.js')
        } else {
          console.error('main.js requires jDom/core/dom/objects')
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
          jDomCoreDom = require('./jDom/core/dom/core.js')
        } else {
          console.error('main.js requires jDom/core/dom/core')
        }
      }
      /**
   * Verify availability of gameActions
   * @typedef {*|module:game/actions} gameActions
   */

      let gameActions = root.gameActions
      /**
   * If gameUtils remains undefined, attempt to retrieve it as a module
   */

      if (typeof gameActions === 'undefined') {
        if (typeof require !== 'undefined') {
          gameActions = require('./actions.js')
        } else {
          console.error('main.js requires game/actions')
        }
      }
      /**
   * Verify availability of gameStart
   * @typedef {*|module:game/setup} gameStart
   */

      let gameStart = root.gameStart
      /**
   * If jDomCoreDom remains undefined, attempt to retrieve it as a module
   */

      if (typeof gameStart === 'undefined') {
        if (typeof require !== 'undefined') {
          gameStart = require('./setup.js')
        } else {
          console.error('main.js requires game/setup')
        }
      }
      /**
   * Create new private reference to the document
   * @typedef {module:jDom/core/dom/objects.documentItem} documentItem
   */

      const documentItem = gameStart.main(jDomObjects.documentDomItem({
        beginRound: gameStart.beginRound,
        attackListener: gameActions.attackListener,
        restart: gameStart.restart
      }))
      console.log('Document Item: ', documentItem) // eslint-disable-next-line no-undef

      if (typeof document === 'undefined' || !(document instanceof HTMLDocument)) {
        // Trigger game to start if running as node module
        const form = jDomCoreDom.getChildrenByClass('main-menu-form', documentItem.body)[0]
        const submitBtn = jDomCoreDom.getChildrenFromAttribute('type', 'submit', form)
        submitBtn[0].element.click()
      }
      /**
   * Either export all functions to be exported, or assign to the Window context
   */

      if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
          exports = module.exports = gameMain
        }

        exports = Object.assign(exports, gameMain)
      }
    }).call(void 0 || window || {}) // Use the external context to assign this, which will be Window if rendered via browser
  }, { './actions.js': 1, './jDom/core/dom/core.js': 6, './jDom/core/dom/objects.js': 7, './setup.js': 21 }],
  20: [function (require, module, exports) {
    'use strict';

    (function () {
      /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
      const root = this || {}
      /**
   * Store reference to any pre-existing module of the same name
   * @type {gamePieces|*}
   */

      const previousGamePieces = root.gamePieces || {}
      /**
   * A reference to all functions to be used globally / exported
   * @typedef (Object) gamePieces
   * @module game/pieces
   */

      const gamePieces = {}
      root.gamePieces = gamePieces
      /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {gamePieces}
   */

      gamePieces.noConflict = function () {
        root.gamePieces = previousGamePieces
        return gamePieces
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
          jDomCore = require('./jDom/core/core.js')
        } else {
          console.error('pieces.js requires jDom/core/core')
        }
      }
      /**
   * Verify availability of jDomObjects
   * @typedef {*|module:jDom/core/dom/objects} jDomObjects
   */

      let jDomObjects = root.jDomObjects
      /**
   * If jDomObjects remains undefined, attempt to retrieve it as a module
   */

      if (typeof jDomObjects === 'undefined') {
        if (typeof require !== 'undefined') {
          jDomObjects = require('./jDom/core/dom/objects.js')
        } else {
          console.error('setup.js requires jDom/core/dom/objects')
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
          jDomMatrixObjects = require('./jDom/matrix/objects.js')
        } else {
          console.error('pieces.js requires jDom/matrix/objects')
        }
      }
      /**
   * Default properties for a tile in the battleship game.
   * @returns {module:jDom/core/dom/objects.DomItem}
   */

      const gameTile = function gameTile () {
        return jDomObjects.createDomItem({
          hasShip: false,
          isHit: false
        })
      }
      /**
   * Set the style for tiles representing water.
   * @function waterTile
   * @returns {{hasShip: boolean, isHit: boolean, eventListeners: {click: {listenerFunc: attackListener, listenerArgs: {}, listenerOptions: boolean}}, point: {}}}
   */

      gamePieces.waterTile = function () {
        return jDomCore.mergeObjects(gameTile(), jDomMatrixObjects.tile())
      }
      /**
   * Set status and custom properties for tiles that have a ship
   * @function shipTile
   * @returns {{hasShip: boolean}}
   */

      gamePieces.shipTile = function () {
        return {
          hasShip: true
        }
      }
      /**
   * Store properties of a ship which includes an array of all associated ship tiles.
   * @function ship
   * @param {string} name
   * @returns {{name: string, status: number, parts: Array}}
   */

      gamePieces.ship = function () {
        const name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''
        return {
          name: name,
          status: 100,
          parts: []
        }
      }
      /**
   * Set the status of the tile to hit.
   * @function hitTile
   * @returns {{isHit: boolean}}
   */

      gamePieces.hitTile = function () {
        return {
          isHit: true
        }
      }
      /**
   * Store the player attributes.
   * @function playerSet
   * @param {Object} board
   * @param {string} name
   * @returns {Object}
   */

      gamePieces.playerSet = function () {
        const board = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        const name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ''
        return {
          name: name,
          isRobot: false,
          status: 100,
          turnCnt: 0,
          attacker: false,
          attacks: {
            hit: 0,
            miss: 0,
            sunk: 0
          },
          board: board,
          shipFleet: [],
          playerStats: {},
          tagName: 'div',
          attributes: {
            className: 'player'
          },
          children: [board]
        }
      }
      /**
   * The defined attributes for each player
   * @function playerStats
   * @param {Object} [player={}]
   * @param {Object} [status=]
   * @returns {Object}
   */

      gamePieces.playerStats = function () {
        const player = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
        const status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ''
        return {
          tagName: 'div',
          attributes: {},
          children: [{
            tagName: 'span',
            attributes: {
              innerHTML: '<strong>'.concat(player.name, '</strong>: ').concat(status)
            }
          }, {
            tagName: 'ul',
            attributes: {},
            children: player.shipFleet.map(function (ship) {
              return {
                tagName: 'li',
                attributes: {
                  innerHTML: '<strong>'.concat(ship.name, ' (').concat(ship.parts.length, '):</strong> ').concat(Math.round(ship.status * 100) / 100, '%')
                }
              }
            })
          }]
        }
      }
      /**
   * Either export all functions to be exported, or assign to the Window context
   */

      if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
          exports = module.exports = gamePieces
        }

        exports = Object.assign(exports, gamePieces)
      }
    }).call(void 0 || window || base || {}) // Use the external context to assign this, which will be Window if rendered via browser
  }, { './jDom/core/core.js': 5, './jDom/core/dom/objects.js': 7, './jDom/matrix/objects.js': 9 }],
  21: [function (require, module, exports) {
    'use strict'

    function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread() }

    function _nonIterableSpread () { throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.') }

    function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === 'string') return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === 'Object' && o.constructor) n = o.constructor.name; if (n === 'Map' || n === 'Set') return Array.from(o); if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen) }

    function _iterableToArray (iter) { if (typeof Symbol !== 'undefined' && iter[Symbol.iterator] != null || iter['@@iterator'] != null) return Array.from(iter) }

    function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr) }

    function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i] } return arr2 }

    (function () {
      /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
      const root = this || {}
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

      gameStart.noConflict = function () {
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
          jDomCore = require('./jDom/core/core.js')
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
          jDomCoreDom = require('./jDom/core/dom/core.js')
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
          jDomMatrixCore = require('./jDom/matrix/core.js')
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
          jDomMatrixObjects = require('./jDom/matrix/objects.js')
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

      const buildShip = function buildShip (shipInfo, line, matrix) {
        const view = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false
        return jDomCore.mergeObjects(gamePieces.ship(shipInfo.name), {
          parts: line.map(function (p) {
            return gameActions.setShip(matrix, p, view)
          })
        })
      }
      /**
   *
   * @param lengths
   * @param shipLength
   */

      const selectShipDirection = function selectShipDirection (lengths, shipLength) {
        return jDomMatrixCore.randDirection([jDomMatrixObjects.point(1, 0, 0), jDomMatrixObjects.point(0, 1, 0), jDomMatrixObjects.point(0, 0, 1)].filter(function (p) {
          return lengths[jDomMatrixCore.getFirstAxisOfCoordinate(p, 1)] > shipLength
        }))
      }
      /**
   *
   * @param lengths
   * @param shipLength
   * @param dir
   * @returns {{start: {x: number, y: number, z: number}, dir}}
   */

      const randomStartDir = function randomStartDir (lengths, shipLength) {
        const dir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : selectShipDirection(lengths, shipLength)
        return {
          start: jDomMatrixCore.randomStart(shipLength, dir, lengths),
          dir: dir
        }
      }
      /**
   * Get a qualifying start and direction point for a ship of specified length
   * WARNING: This is a recursive function.
   * @param matrix
   * @param shipLength
   * @param lengths
   * @param startDir
   * @returns {Array}
   */

      const generateStartEnd = function generateStartEnd (matrix, shipLength, lengths) {
        let _jDomMatrixCore

        const startDir = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : randomStartDir(lengths, shipLength)
        return jDomMatrixCore.getHighestAbsoluteCoordinate(startDir.dir) === 0 ? [jDomMatrixObjects.point(0, 0, 0), jDomMatrixObjects.point(0, 0, 0)] : (_jDomMatrixCore = jDomMatrixCore).checkInBetween.apply(_jDomMatrixCore, [startDir.start, jDomMatrixCore.lineEndPoint(startDir.start, shipLength, startDir.dir)].concat([matrix, gameUtils.checkIfShipCell])) ? generateStartEnd(matrix, shipLength, lengths) : [startDir.start, jDomMatrixCore.lineEndPoint(startDir.start, shipLength, startDir.dir)]
      }
      /**
   * Create a series of randomly placed ships based on the provided shipLengths.
   * The optional parameter view will set the visibility of the ships.
   * @param {Array} ships
   * @param {Object} matrix
   * @param {boolean} [view=false]
   * @returns {Array}
   */

      const generateRandomFleet = function generateRandomFleet (ships, matrix) {
        const view = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false
        return ships.map(function (ship) {
          let _jDomMatrixCore2

          return buildShip(ship, (_jDomMatrixCore2 = jDomMatrixCore).getPointsLine.apply(_jDomMatrixCore2, _toConsumableArray(generateStartEnd(matrix, ship.size, jDomMatrixCore.getAxisLengths(matrix)))), matrix, view)
        })
      }
      /**
   * Create a default fleet using the standard battleship lengths.
   * @param {Object} matrix
   * @param {boolean} [view=false]
   * @returns {Array}
   */

      const defaultFleet = jDomCore.curry(generateRandomFleet)([{
        name: 'Aircraft Carrier',
        size: 5
      }, {
        name: 'Battleship',
        size: 4
      }, {
        name: 'Submarine',
        size: 3
      }, {
        name: 'Cruiser',
        size: 3
      }, {
        name: 'Destroyer',
        size: 2
      }])
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

      const buildPlayers = function buildPlayers (humans) {
        let robots = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0
        const players = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : []

        if (humans < 1 && robots < 1) {
          return players
        }

        const player = gamePieces.playerSet({}, 'Player '.concat(players.length + 1))
        player.isRobot = humans <= 0
        player.board = jDomMatrixCore.bindPointData(jDomMatrixObjects.square({
          x: [gamePieces.waterTile(player, players)],
          matrixProps: [{
            eventListeners: {
              click: {
                listenerFunc: 'attackListener',
                listenerArgs: {},
                listenerOptions: false
              }
            }
          }]
        }, 10))
        player.shipFleet = defaultFleet(player.board, false) // generate fleet of ships

        player.playerStats = gamePieces.playerStats(player, ''.concat(Math.round(player.status * 100) / 100, '%'))
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

      gameStart.beginRound = function (e, mainForm) {
        if (e.eventPhase !== 2) {
          return false
        }

        console.log('beginRound', e.eventPhase, e.type)
        e.preventDefault()
        const parent = jDomCoreDom.getTopParentItem(mainForm)
        let humans = parseInt(jDomCoreDom.getChildrenByName('human-players', mainForm)[0].element.value)
        let robots = parseInt(jDomCoreDom.getChildrenByName('robot-players', mainForm)[0].element.value)

        if (humans < 0 || humans > 100 || robots < 0 || robots > 100) {
          return false
        }

        const firstGoesFirst = jDomCoreDom.getChildrenByName('first-go-first', mainForm)[0].element.checked
        humans = humans < 0 ? 0 : humans

        if (humans === 0) {
          robots = robots < 2 ? 2 : robots
        }

        if (humans === 1) {
          robots = robots < 1 ? 1 : robots
        }

        jDomCoreDom.removeChild(jDomCoreDom.getChildrenByClass('main-menu', parent.body)[0], parent.body)
        const players = jDomCoreDom.renderHTML(gameLayout.boards(buildPlayers(humans, robots)), parent).children
        const firstAttacker = gameActions.updatePlayer(firstGoesFirst ? players[0] : players[jDomCore.randomInteger(players.length)])

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

      gameStart.main = function (parent) {
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

      gameStart.restart = function (e, button) {
        return gameStart.main(jDomCoreDom.getTopParentItem(button))
      }
      /**
   * Either export all functions to be exported, or assign to the Window context
   */

      if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
          exports = module.exports = gameStart
        }

        exports = Object.assign(exports, gameStart)
      }
    }).call(void 0 || window || {}) // Use the external context to assign this, which will be Window if rendered via browser
  }, { './actions.js': 1, './functions.js': 2, './jDom/core/core.js': 5, './jDom/core/dom/core.js': 6, './jDom/matrix/core.js': 8, './jDom/matrix/objects.js': 9, './layout.js': 18, './pieces.js': 20 }]
}, {}, [19])
