import computerAttack from '../robot/computerAttack'
import endGame from './endGame'
import getNextAttacker from './getNextAttacker'
import queueTimeout from '../queue'
import updatePlayer from './updatePlayer'
import type { Player } from '../types'

/**
 * Update all game stats after each player round
 * @param hitShip
 * @param sunkShip
 * @param players
 */
const updateScore = (hitShip: boolean, sunkShip: number, players: Player[]): Player[] => {
  players = players.filter((p) => p.status > 0)
  let attacker = players.reduce((p1, p2) => p1.attacker ? p1 : p2)
  attacker = updatePlayer(attacker, hitShip, sunkShip)
  if (players.length < 2) {
    queueTimeout(attacker, () => endGame(players[0]), 200)
    return players
  }
  const nextAttacker = getNextAttacker(attacker, players, hitShip)
  if (nextAttacker.isRobot) {
    queueTimeout(attacker, computerAttack, 0, nextAttacker, players)
  }
  return players
}

export default updateScore
