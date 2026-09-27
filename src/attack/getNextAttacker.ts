import findNextAttacker from './findNextAttacker'
import updatePlayer from './updatePlayer'
import type { Player } from '../types'

/**
 * Based on the current attacker and list of players, return the next attacker.
 * @param attacker
 * @param players
 * @param hitShip
 */
const getNextAttacker = (attacker: Player, players: Player[], hitShip: boolean): Player => {
  // This is a house-rule, playing again after successful hit. Hasbro official rules do not have this, and even discourage this rule.
  // Maybe add as an optional house rule in the future.
  // if (hitShip) {
  //   return attacker
  // }
  return updatePlayer(findNextAttacker(attacker, players, players.indexOf(attacker)), hitShip)
}

export default getNextAttacker
