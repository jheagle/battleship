import computerAttack from '../robot/computerAttack'
import endGame from './endGame'
import getNextAttacker from './getNextAttacker'
import queueTimeout from '../queue'
import updatePlayer from './updatePlayer'

/**
 * Update all game stats after each player round
 * @param hitShip
 * @param sunkShip
 * @param players
 * @returns {*}
 */
const updateScore = (hitShip, sunkShip, players) => {
  players = players.filter((p) => p.status > 0)
  let attacker = players.reduce((p1, p2) => p1.attacker ? p1 : p2)
  attacker = updatePlayer(attacker, hitShip, sunkShip)
  if (players.length < 2) {
    queueTimeout(() => endGame(players[0]), 200)
    return players
  }
  const nextAttacker = getNextAttacker(attacker, players, hitShip)
  if (nextAttacker.isRobot) {
    queueTimeout(computerAttack, 0, nextAttacker, players)
  }
  return players
}

export default updateScore
