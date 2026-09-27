/**
 *
 * @param attacker
 * @param players
 * @param attackerIndex
 * @returns {*}
 */
const findNextAttacker = (attacker, players, attackerIndex) => {
  const nextAttacker = (players.length > 1 && attackerIndex >= players.length - 1) ? players[0] : players[++attackerIndex]
  return nextAttacker.status > 0 ? nextAttacker : findNextAttacker(attacker, players, attackerIndex) // Only use players with a positive status
}

export default findNextAttacker
