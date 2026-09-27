import attackFleet from '../attack/attackFleet'
import attackLock from '../attack/attackLock'
import selectTargetCoordinate from './selectTargetCoordinate'
import selectTargetPlayer from './selectTargetPlayer'
import type { Player, Tile } from '../types'

/**
 * Main AI logic for computer to attack, selects a target then performs attack function.
 * @param player
 * @param players
 */
const computerAttack = (player: Player, players: Player[]): Player[] => {
  const victim = selectTargetPlayer(players.filter(p => !p.attacker))
  attackLock.isLocked = false
  return attackFleet(selectTargetCoordinate(victim) as Tile)
}

export default computerAttack
