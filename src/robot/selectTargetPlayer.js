import siFunciona from 'si-funciona'
import getBrokenShipsPlayers from '../utils/getBrokenShipsPlayers'
import getLowStatusItems from '../utils/getLowStatusItems'

/**
 * Choose which player to attack.
 * @param players
 * @returns {*}
 */
const selectTargetPlayer = (players) => {
  // Get a list of all players with broken ships or with lowest status.
  const victims = getBrokenShipsPlayers(players).length ? getBrokenShipsPlayers(players) : getLowStatusItems(players)
  // If more than one possible victim, select a random target, otherwise return the lowest status player.
  return victims.length === 1 ? victims[0] : victims[siFunciona.randomInteger(victims.length)]
}

export default selectTargetPlayer
