import jsonDom from 'json-dom'
import siFunciona from 'si-funciona'
import attackLock from './attackLock'
import queueTimeout from '../queue'
import updatePlayerStats from './updatePlayerStats'
import { clearHeatHint, showHeatHint, victimsOf } from './heatHint'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Player } from '../types'

/**
 * Track player stats such as attacks and turns
 * @param player
 * @param hitShip
 * @param sunkShip
 */
const updatePlayer = (player: Player, hitShip?: boolean, sunkShip: number = 0): Player => {
  if (player.attacker) {
    if (hitShip) {
      ++player.attacks.hit
    } else {
      ++player.attacks.miss
    }
    if (sunkShip) {
      ++player.attacks.sunk
    }
  }
  // If we add house rules options, enable replay on successful hit here
  // if (hitShip) {
  //   queueTimeout(() => updatePlayerStats(player, player.attacker ? 'ATTACKER' : `${Math.round(player.status * 100) / 100}%`), 0)
  //   return player
  // }
  player.attacker = !player.attacker
  attackLock.isLocked = true
  // A human's heat-map hint shows on the boards they attack for the length of their turn
  if (!player.isRobot && player.showHint) {
    queueTimeout(() => victimsOf(player).forEach(victim => player.attacker ? showHeatHint(victim) : clearHeatHint(victim)), 0)
  }
  if (player.attacker) {
    if (!player.isRobot) {
      queueTimeout(() => {
        attackLock.isLocked = false
        return player.board.children.map(l => l.children.map(r => r.children.map(c => jsonDom.updateElement(siFunciona.mergeObjectsMutable(c, {
          attributes: {
            style: {
              width: '17px',
              height: '17px'
            }
          }
        }) as DomItem))))
      }, 400)
    }
    ++player.turnCnt
  } else {
    queueTimeout(() => {
      attackLock.isLocked = false
      return player.board.children.map(l => l.children.map(r => r.children.map(c => jsonDom.updateElement(siFunciona.mergeObjectsMutable(c, {
        attributes: {
          style: {
            width: '35px',
            height: '35px'
          }
        }
      }) as DomItem))))
    }, 0)
  }
  queueTimeout(() => updatePlayerStats(player, player.attacker ? 'ATTACKER' : `${Math.round(player.status * 100) / 100}%`), 0)
  return player
}

export default updatePlayer
