import jsonDom from 'json-dom'
import siFunciona from 'si-funciona'
import playerStats from '../components/pieces/playerStats'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Player } from '../types'

/**
 * @param player
 * @param status
 */
const updatePlayerStats = (player: Player, status: string = `${Math.round(player.status * 100) / 100}%`): Player => {
  player.playerStats = jsonDom.updateElements(siFunciona.mergeObjectsMutable(player.playerStats, playerStats(player, status)) as DomItem)
  return player
}

export default updatePlayerStats
