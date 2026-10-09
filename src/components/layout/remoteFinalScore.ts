import jsonDom from 'json-dom'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Player } from '../../types'

const listener = (listenerFunc: string) => [{ listenerFunc, listenerArgs: {}, listenerOptions: false }]

/**
 * The final score screen for a remote room's game: the same public score cards local hot-seat shows (see
 * finalScore.ts), plus Play Again (see remotePlayAgainListener.ts) and Leave (see remoteLeaveListener.ts) -
 * both open to every player, neither destructive, so there is no need to restrict who can press either one.
 * Local hot-seat's own separate "Change Settings" button has no remote equivalent: Play Again already returns
 * everyone to the waiting room, where the host can change the hint setting before starting again, so a second
 * button offering the same trip would be redundant.
 * @param players
 */
const remoteFinalScore = (players: Player[] = []): DomItem => jsonDom.createDomItem({
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
      nodeName: 'p',
      attributes: {
        className: 'remote-final-score-message',
        innerHTML: 'Game over! Click Play Again to return to the room and start a new game with the same players, or Leave to go back to the main menu.'
      }
    },
    {
      nodeName: 'div',
      attributes: { className: 'final-scores-actions' },
      children: [
        {
          nodeName: 'button',
          attributes: { className: 'remote-play-again', type: 'button', innerHTML: 'Play Again' },
          eventListeners: { click: listener('remotePlayAgainListener') }
        },
        {
          nodeName: 'button',
          attributes: { className: 'remote-leave', type: 'button', innerHTML: 'Leave' },
          eventListeners: { click: listener('remoteLeaveListener') }
        }
      ]
    }
  ]
})

export default remoteFinalScore
