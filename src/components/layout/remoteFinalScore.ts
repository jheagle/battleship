import jsonDom from 'json-dom'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Player } from '../../types'

const listener = (listenerFunc: string) => [{ listenerFunc, listenerArgs: {}, listenerOptions: false }]

/**
 * The final score screen for a remote room's game: the same public score cards local hot-seat shows (see
 * finalScore.ts), plus a single host-only Play Again button (see remotePlayAgainListener.ts) - disabled on a
 * non-host's own redacted copy, same as the ordering panel (see redactGameState.ts). Change Settings and Main
 * Menu/leave-the-room are still not built - both assume one physical screen controlling the whole shared game,
 * which does not hold for several independent remote clients, and restarting with different settings or
 * leaving the room are each their own, separate feature.
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
        innerHTML: 'Game over! The host can start a new game with the same players below.'
      }
    },
    {
      nodeName: 'button',
      attributes: { className: 'remote-play-again', type: 'button', innerHTML: 'Play Again' },
      eventListeners: { click: listener('remotePlayAgainListener') }
    }
  ]
})

export default remoteFinalScore
