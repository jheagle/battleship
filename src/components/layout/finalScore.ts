import jsonDom from 'json-dom'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Player } from '../../types'

/**
 * Display the final scores after a game has ended, with three ways to go on: Play Again (same settings,
 * places ships again), Change Settings (back to the lobby, pre-filled with this game's settings), and Main Menu
 * (back to choosing the game type).
 * @param players
 */
const finalScore = (players: Player[] = []): DomItem => jsonDom.createDomItem({
  nodeName: 'div',
  attributes: {
    className: 'final-scores'
  },
  children: [
    {
      nodeName: 'div',
      attributes: {
        className: 'score-cards'
      },
      children: players.map(player => ({
        nodeName: 'div',
        attributes: {
          className: 'score-card',
          innerHTML: `<strong>${player.name}</strong><hr><br></strong><strong>Status:</strong> ${Math.round(player.status * 100) / 100}%, <strong>Sunk:</strong> ${player.attacks.sunk}<br><strong>Hit:</strong> ${player.attacks.hit} / <strong>Miss:</strong> ${player.attacks.miss}<br><strong>Turns:</strong> ${player.turnCnt}`
        }
      }))
    },
    {
      nodeName: 'div',
      attributes: {
        className: 'final-scores-actions'
      },
      children: [
        {
          nodeName: 'input',
          attributes: {
            className: 'play-again',
            type: 'button',
            value: 'Play Again'
          },
          eventListeners: {
            click: [
              { listenerFunc: 'playAgain', listenerArgs: {}, listenerOptions: false }
            ]
          }
        },
        {
          nodeName: 'input',
          attributes: {
            className: 'return-to-lobby',
            type: 'button',
            value: 'Change Settings'
          },
          eventListeners: {
            click: [
              { listenerFunc: 'returnToLobby', listenerArgs: {}, listenerOptions: false }
            ]
          }
        },
        {
          nodeName: 'input',
          attributes: {
            className: 'new-game',
            type: 'button',
            value: 'Main Menu'
          },
          eventListeners: {
            click: [
              { listenerFunc: 'restart', listenerArgs: {}, listenerOptions: false }
            ]
          }
        }
      ]
    }
  ]
})

export default finalScore
