import type { DomItemConfig } from 'json-dom/dist/domItem/types'

/**
 * The panel shown during the placement phase: a message for whoever is placing, and their buttons. Each button has one
 * class name, which is how the layer finds it and how one listener tells them apart (see placementListener).
 * @param message
 */
const placementPanel = (message: string = ''): DomItemConfig => ({
  nodeName: 'div',
  attributes: {
    className: 'placement'
  },
  children: [
    {
      nodeName: 'p',
      attributes: {
        className: 'placement-message',
        innerHTML: message
      }
    },
    {
      nodeName: 'input',
      attributes: {
        className: 'placement-name',
        type: 'text',
        maxLength: 20,
        placeholder: 'Your name'
      }
    },
    ...[
      { action: 'placement-continue', label: 'Continue' },
      { action: 'placement-randomise', label: 'Randomise' },
      { action: 'placement-done', label: 'Done' },
      { action: 'begin-random', label: 'Random' },
      { action: 'begin-order', label: 'Set order' }
    ].map(({ action, label }) => ({
      nodeName: 'button',
      attributes: {
        className: action,
        type: 'button',
        innerHTML: label
      },
      eventListeners: {
        click: [{ listenerFunc: 'placementListener', listenerArgs: {}, listenerOptions: false }]
      }
    }))
  ]
})

export default placementPanel
