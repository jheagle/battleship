import type { Player } from '../types'

/**
 * @param attacker
 * @param players
 * @param attackerIndex
 */
const findNextAttacker = (attacker: Player, players: Player[], attackerIndex: number): Player => {
  const nextAttacker = (players.length > 1 && attackerIndex >= players.length - 1) ? players[0] : players[++attackerIndex]
  return nextAttacker.status > 0 ? nextAttacker : findNextAttacker(attacker, players, attackerIndex) // Only use players with a positive status
}

export default findNextAttacker
