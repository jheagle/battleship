import { getGameMode, getHintSetting } from '../../setup/gameOptions'
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
        innerHTML: `<strong style="color: ${player.colour}">${player.name}</strong>: ${status}`
      }
    },
    ...(player.isRobot || getHintSetting() !== 'optional' ? [] : [{
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
    ...(player.isRobot || getGameMode() !== 'solo' ? [] : [{
      nodeName: 'label',
      attributes: {},
      children: [
        {
          nodeName: 'input',
          attributes: {
            className: 'own-ships',
            type: 'checkbox',
            checked: Boolean(player.showShips)
          },
          eventListeners: {
            change: [{ listenerFunc: 'shipsListener', listenerArgs: {}, listenerOptions: false }]
          }
        },
        {
          nodeName: 'span',
          attributes: {
            innerHTML: ' Show my ships'
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
