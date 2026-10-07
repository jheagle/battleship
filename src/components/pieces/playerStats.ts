import { getGameMode, getHintSetting } from '../../setup/gameOptions'
import type { DomItemConfig } from 'json-dom/dist/domItem/types'
import type { Player } from '../../types'

/**
 * The defined attributes for each player. The name and status run across the top; the player's checkboxes are stacked
 * on the left, and the ship list is on the right.
 * @param player
 * @param status
 */
const playerStats = (player: Player, status: string = ''): DomItemConfig => {
  const hintControl = player.isRobot || getHintSetting() !== 'optional' ? [] : [{
    nodeName: 'label',
    attributes: { className: 'stats-control' },
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
  }]
  const ownShipsControl = player.isRobot || getGameMode() !== 'solo' ? [] : [{
    nodeName: 'label',
    attributes: { className: 'stats-control' },
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
  }]
  const controls = [...hintControl, ...ownShipsControl]
  return {
    nodeName: 'div',
    attributes: {
      className: 'player-stats'
    },
    children: [
      {
        nodeName: 'span',
        attributes: {
          className: 'player-name',
          innerHTML: `<strong style="color: ${player.colour}">${player.name}</strong>: ${status}`
        }
      },
      ...(controls.length ? [{
        nodeName: 'div',
        attributes: {
          className: 'player-controls'
        },
        children: controls
      }] : []),
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
  }
}

export default playerStats
