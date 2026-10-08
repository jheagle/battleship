import type { DomItemConfig } from 'json-dom/dist/domItem/types'

const listener = (listenerFunc: string) => [{ listenerFunc, listenerArgs: {}, listenerOptions: false }]

/**
 * Each player's own placement controls, rendered as part of their own subtree (not one shared panel at the body
 * level, like local hot-seat's placementPanel) - so every connected player places their own ships on their own
 * board whenever they want, with no "look away" handoff. Redacted per viewer (see redactGameState.ts): only the
 * owning player's own copy is ever enabled - everyone else's is always disabled, showing only ready/not-ready.
 */
const remotePlacementPanel = (): DomItemConfig => ({
  nodeName: 'div',
  attributes: { className: 'remote-placement-panel' },
  children: [
    { nodeName: 'p', attributes: { className: 'remote-placement-message', innerHTML: '' } },
    {
      nodeName: 'button',
      attributes: { className: 'remote-placement-randomise', type: 'button', innerHTML: 'Randomise' },
      eventListeners: { click: listener('remotePlacementListener') }
    },
    {
      nodeName: 'button',
      attributes: { className: 'remote-placement-ready', type: 'button', innerHTML: 'Ready', disabled: true },
      eventListeners: { click: listener('remotePlacementListener') }
    }
  ]
})

export default remotePlacementPanel
