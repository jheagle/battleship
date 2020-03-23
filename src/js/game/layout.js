'use strict'
// Custom layout objects leveraging the DomItem object
;(function () {
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
  gameLayout.noConflict = () => {
    root.gameLayout = previousGameLayout
    return gameLayout
  }

  /**
   * Verify availability of jDomCore
   * @typedef {*|module:jDom/core/dom/objects} jDomObjectsDom
   */
  let jDomObjectsDom = root.jDomObjectsDom

  /**
   * If jDomObjectsDom remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomObjectsDom === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomObjectsDom = require('../vendor/json-dom').default.default.domObjects
    } else {
      console.error('layout.js requires jDomObjectsDom')
    }
  }

  /**
   * This will be the main menu for the game.
   * @function mainMenu
   * @returns {module:jDom/core/dom/objects.DomItem}
   */
  gameLayout.mainMenu = () => jDomObjectsDom.createDomItem({
    tagName: 'div',
    attributes: {
      className: 'main-menu'
    },
    children: [
      {
        tagName: 'div',
        attributes: {
          className: 'content'
        },
        children: [
          {
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
            children: [
              {
                tagName: 'div',
                attributes: {
                  className: 'form-group'
                },
                children: [
                  {
                    tagName: 'label',
                    attributes: {
                      for: 'human-players',
                      innerText: 'Humans'
                    }
                  },
                  {
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
                  }
                ]
              },
              {
                tagName: 'div',
                attributes: {
                  className: 'form-group'
                },
                children: [
                  {
                    tagName: 'label',
                    attributes: {
                      for: 'robot-players',
                      innerText: 'Robots'
                    }
                  },
                  {
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
                  }
                ]
              },
              {
                tagName: 'label',
                attributes: {
                  for: 'first-go-first',
                  innerText: 'First Player Starts'
                }
              },
              {
                tagName: 'input',
                attributes: {
                  id: 'first-go-first',
                  name: 'first-go-first',
                  type: 'checkbox'
                }
              },
              {
                tagName: 'input',
                attributes: {
                  type: 'submit',
                  value: 'Start'
                }
              }
            ]
          }
        ]
      }
    ]
  })

  /**
   * Wrapper div for player data / boards
   * @function boards
   * @param {Array} [players=[]]
   * @returns {module:jDom/core/dom/objects.DomItem}
   */
  gameLayout.boards = (players = []) => jDomObjectsDom.createDomItem({
    tagName: 'div',
    attributes: {
      className: 'boards'
    },
    children: players
  })

  /**
   * Display the final scores after a game has ended and have a button to restart.
   * @function finalScore
   * @param {Array} players
   * @returns {module:jDom/core/dom/objects.DomItem}
   */
  gameLayout.finalScore = (players) => jDomObjectsDom.createDomItem({
    tagName: 'div',
    attributes: {
      className: 'final-scores'
    },
    children: [
      {
        tagName: 'div',
        attributes: {
          className: 'score-cards'
        },
        children: players.map(player => ({
          tagName: 'div',
          attributes: {
            className: 'score-card',
            innerHTML: `<strong>${player.name}</strong><hr><br></strong><strong>Status:</strong> ${Math.round(player.status * 100) / 100}%, <strong>Sunk:</strong> ${player.attacks.sunk}<br><strong>Hit:</strong> ${player.attacks.hit} / <strong>Miss:</strong> ${player.attacks.miss}<br><strong>Turns:</strong> ${player.turnCnt}`
          }
        }))
      },
      {
        tagName: 'input',
        attributes: {
          type: 'button',
          value: 'Restart'
        },
        eventListeners: {
          click: { listenerFunc: 'restart', listenerArgs: {}, listenerOptions: false }
        }
      }
    ]
  })

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = gameLayout
    }
    exports = Object.assign(exports, gameLayout)
  }
}).call(this || window || {}) // Use the external context to assign this, which will be Window if rendered via browser
