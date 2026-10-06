import jsonDom from 'json-dom'
import siFunciona from 'si-funciona'
import attackLock from './attackLock'
import queueTimeout from '../queue'
import updatePlayerStats from './updatePlayerStats'
import { clearHeatHint, showHeatHint, victimsOf } from './heatHint'
import { clearValidTargets, showValidTargets } from './validTargets'
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
  // A human sees which cells of the boards they attack can still be hit
  if (!player.isRobot) {
    queueTimeout(() => victimsOf(player).forEach(victim => player.attacker ? showValidTargets(victim) : clearValidTargets(victim)), 0)
  }
  if (!player.isRobot && player.showHint) {
    queueTimeout(() => victimsOf(player).forEach(victim => player.attacker ? showHeatHint(victim) : clearHeatHint(victim)), 0)
  }
  if (player.attacker) {
    if (!player.isRobot) {
      queueTimeout(() => { attackLock.isLocked = false }, 400)
    }
    ++player.turnCnt
  } else {
    queueTimeout(() => { attackLock.isLocked = false }, 0)
  }
  // Every board keeps its size. The player whose turn it is is marked with a yellow outline on their panel. The players
  // they can attack glow in that player's colour, so the target is clear
  queueTimeout(() => {
    jsonDom.updateElement(siFunciona.mergeObjectsMutable(player, { attributes: { style: { outline: player.attacker ? '3px solid yellow' : 'none' } } }) as DomItem)
    victimsOf(player).forEach(victim => jsonDom.updateElement(siFunciona.mergeObjectsMutable(victim, { attributes: { style: { 'box-shadow': player.attacker ? `0 0 0 6px ${player.colour}` : 'none' } } }) as DomItem))
  }, 0)
  queueTimeout(() => updatePlayerStats(player, player.attacker ? 'ATTACKER' : `${Math.round(player.status * 100) / 100}%`), 0)
  return player
}

export default updatePlayer
