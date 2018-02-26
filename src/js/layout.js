'use strict'
// Custom layout objects leveraging the DOMItem object
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this

  /**
   * Store reference to any pre-existing module of the same name
   * @type {jDomLayout|*}
   */
  const previousJDomLayout = root.jDomLayout

  /**
   * All methods exported from this module are encapsulated within jDomLayout.
   * @typedef {Object} jDomLayout
   * @property {jDomLayout} jDomLayout
   * @property {function} boards
   * @property {function} finalScore
   * @property {function} mainMenu
   * @property {function} noConflict
   */

  /**
   * A reference to all functions to be used globally / exported
   * @type {jDomLayout}
   */
  const exportFunctions = {
    noConflict: () => {
      root.jDomLayout = previousJDomLayout
      return exportFunctions
    }
  }

  /**
   * This will be the main menu for the game.
   * @param {Object} parent
   * @returns {DOMIem}
   */
  const mainMenu = (parent = {}) => ({
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
  exportFunctions.mainMenu = mainMenu

  /**
   * Wrapper div for player data / boards
   * @param {Array} [players=[]]
   * @returns {DOMIem}
   */
  const boards = (players = []) => ({
    tagName: 'div',
    attributes: {
      className: 'boards'
    },
    children: players
  })
  exportFunctions.boards = boards

  /**
   * Display the final scores after a game has ended and have a button to restart.
   * @param {Array} players
   * @param {Object} [parent={}]
   * @returns {DOMIem}
   */
  const finalScore = (players, parent = {}) => ({
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
          click: {listenerFunc: 'restart', listenerArgs: {}, listenerOptions: false}
        }
      }
    ]
  })
  exportFunctions.finalScore = finalScore

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
    exportFunctions.jDomLayout = exportFunctions
    root = Object.assign(root, exportFunctions)
  }
}).call(this) // Use the external context to assign this, which will be Window if rendered via browser
