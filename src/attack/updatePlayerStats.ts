import jsonDom from 'json-dom'
import siFunciona from 'si-funciona'
import playerStats from '../components/pieces/playerStats'

/**
 *
 * @param player
 * @param status
 * @returns {*}
 */
const updatePlayerStats = (player, status = `${Math.round(player.status * 100) / 100}%`) => {
  player.playerStats = jsonDom.updateElements(siFunciona.mergeObjectsMutable(player.playerStats, playerStats(player, status)))
  return player
}

export default updatePlayerStats
