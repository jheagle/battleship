import attackFleet from '../attack/attackFleet'
import attackLock from '../attack/attackLock'
import selectTargetCoordinate from './selectTargetCoordinate'
import selectTargetPlayer from './selectTargetPlayer'

/**
 * Main AI logic for computer to attack, selects a target then performs attack function.
 * @function computerAttack
 * @param player
 * @param players
 */
const computerAttack = (player, players) => {
  const victim = selectTargetPlayer(players.filter(p => !p.attacker))
  attackLock.isLocked = false
  return attackFleet(selectTargetCoordinate(victim))
}

export default computerAttack
