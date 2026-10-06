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
    ...['placement-continue', 'placement-randomise', 'placement-done'].map(action => ({
      nodeName: 'button',
      attributes: {
        className: action,
        type: 'button'
      },
      eventListeners: {
        click: [{ listenerFunc: 'placementListener', listenerArgs: {}, listenerOptions: false }]
      }
    }))
  ]
})

export default placementPanel
