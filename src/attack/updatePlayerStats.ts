import treeloom from 'treeloom'
import siFunciona from 'si-funciona'
import playerStats from '../components/pieces/playerStats'
import { labelBoard } from '../cells/labelTile'
import type { DomItem } from 'treeloom/dist/domItem/types'
import type { Player } from '../types'

/**
 * @param player
 * @param status
 */
const updatePlayerStats = (player: Player, status: string = `${Math.round(player.status * 100) / 100}%`): Player => {
  // The board is named after the player, and the name can change here (placement's name field)
  if (player.board?.attributes) {
    labelBoard(player)
    if (player.board.element) {
      treeloom.updateElement(player.board as unknown as DomItem)
    }
  }
  player.playerStats = treeloom.updateElements(siFunciona.mergeObjectsMutable(player.playerStats, playerStats(player, status)) as DomItem)
  return player
}

export default updatePlayerStats
