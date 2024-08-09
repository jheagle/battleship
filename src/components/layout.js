'use strict'
/**
 * A reference to all functions to be used globally / exported
 * @typedef {Object} gameLayout
 * @module game/layout
 */
const gameLayout = {}

/**
 * This will be the main menu for the game.
 * @function mainMenu
 * @returns {module:jDom/core/dom/objects.DomItem}
 */
gameLayout.mainMenu = () => jsonDom.createDomItem({
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
gameLayout.boards = (players = []) => jsonDom.createDomItem({
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
gameLayout.finalScore = (players) => jsonDom.createDomItem({
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

export default gameLayout
