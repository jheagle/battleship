import type { DomItemConfig } from 'json-dom/dist/domItem/types'
import type { Player } from '../../types'

/**
 * The defined attributes for each player
 * @param player
 * @param status
 */
const playerStats = (player: Player, status: string = ''): DomItemConfig => ({
  nodeName: 'div',
  attributes: {},
  children: [
    {
      nodeName: 'span',
      attributes: {
        innerHTML: `<strong>${player.name}</strong>: ${status}`
      }
    },
    ...(player.isRobot ? [] : [{
      nodeName: 'label',
      attributes: {},
      children: [
        {
          nodeName: 'input',
          attributes: {
            type: 'checkbox',
            checked: Boolean(player.showHint)
          },
          eventListeners: {
            change: [{ listenerFunc: 'hintListener', listenerArgs: {}, listenerOptions: false }]
          }
        },
        {
          nodeName: 'span',
          attributes: {
            innerHTML: ' Show heat hint on my turn'
          }
        }
      ]
    }]),
    {
      nodeName: 'ul',
      attributes: {},
      children: player.shipFleet.map(ship => ({
        nodeName: 'li',
        attributes: {
          innerHTML: `<strong>${ship.name} (${ship.parts.length}):</strong> ${Math.round(ship.status * 100) / 100}%`
        }
      }))
    }
  ]
})

export default playerStats
