import type { DomItemConfig } from 'json-dom/dist/domItem/types'

const listener = (listenerFunc: string) => [{ listenerFunc, listenerArgs: {}, listenerOptions: false }]

/**
 * How the turn order is decided once every player has placed: the host picks Random or Set order (clicking each
 * player's board in turn); everyone else sees the exact same status message, with no controls of their own.
 * Enforced server-side (see server/lobbyServer.ts's gameAction handler, which rejects a non-host's action during
 * any stage but placing), not just by these buttons being disabled on a non-host's own redacted copy.
 */
const remoteOrderingPanel = (): DomItemConfig => ({
  nodeName: 'div',
  attributes: { className: 'remote-ordering', style: { display: 'none' } },
  children: [
    { nodeName: 'p', attributes: { className: 'remote-ordering-message', innerHTML: '' } },
    {
      nodeName: 'button',
      attributes: { className: 'remote-order-random', type: 'button', innerHTML: 'Random' },
      eventListeners: { click: listener('remotePlacementListener') }
    },
    {
      nodeName: 'button',
      attributes: { className: 'remote-order-set', type: 'button', innerHTML: 'Set order' },
      eventListeners: { click: listener('remotePlacementListener') }
    }
  ]
})

export default remoteOrderingPanel
