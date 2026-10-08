import jsonDom from 'json-dom'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Player } from '../../types'

/**
 * The final score screen for a remote room's game: the same public score cards local hot-seat shows (see
 * finalScore.ts), with no buttons of its own - Play Again, Change Settings and Main Menu all assume one
 * physical screen controlling the whole shared game, which does not hold for several independent remote
 * clients. Leaving/restarting a remote room is its own, not-yet-built feature; for now the game simply ends
 * and shows the real result to everyone.
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
        innerHTML: 'Game over! Leave this room and start a new one to play again.'
      }
    }
  ]
})

export default remoteFinalScore
