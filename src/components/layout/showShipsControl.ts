import type { DomItemConfig } from 'json-dom/dist/domItem/types'

/**
 * The one control for the robots-only game: a single checkbox to show every ship on every board, rather than one per
 * board. It sits above the boards.
 */
const showShipsControl = (): DomItemConfig => ({
  nodeName: 'label',
  attributes: {
    className: 'ships-control'
  },
  children: [
    {
      nodeName: 'input',
      attributes: {
        className: 'all-ships',
        type: 'checkbox'
      },
      eventListeners: {
        change: [{ listenerFunc: 'shipsListener', listenerArgs: {}, listenerOptions: false }]
      }
    },
    {
      nodeName: 'span',
      attributes: {
        innerHTML: ' Show all ships'
      }
    }
  ]
})

export default showShipsControl
