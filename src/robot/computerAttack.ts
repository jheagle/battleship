import attackFleet from '../attack/attackFleet'
import attackLock from '../attack/attackLock'
import queueTimeout from '../queue'
import { STAGE_MS, clearTargets } from './displayTargets'
import selectTargetCoordinate from './selectTargetCoordinate'
import selectTargetPlayer from './selectTargetPlayer'
import type { Player, Tile } from '../types'

/**
 * Main AI logic for computer to attack, selects a target then performs attack function.
 * @param player
 * @param players
 */
const computerAttack = (player: Player, players: Player[]): Player[] => {
  const opponents = players.filter(p => !p.attacker)
  const victim = selectTargetPlayer(opponents)
  // The lock stays on while the robot's thinking is shown, so nothing can be attacked in the meantime
  attackLock.isLocked = true
  const target = selectTargetCoordinate(victim, opponents) as Tile
  queueTimeout(() => {
    clearTargets(victim, opponents)
    attackLock.isLocked = false
    return attackFleet(target)
  }, STAGE_MS)
  return players
}

export default computerAttack
