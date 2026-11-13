import { colours } from '../theme'
import treeloom from 'treeloom'
import labelTile from './labelTile'
import treeloomMatrix from 'treeloom-matrix'
import siFunciona from 'si-funciona'
import checkIfShipCell from '../utils/checkIfShipCell'
import type { DomItem } from 'treeloom/dist/domItem/types'
import type { Player, Tile } from '../types'

/**
 * Show or hide a player's ships on their board. Ships which have been hit keep the colour they were given when hit, so
 * only the parts not yet hit change.
 * @param player
 * @param shown
 */
const shadeShips = (player: Player, shown: boolean): void => {
  treeloomMatrix.getLayerPoints(player.board, 0).forEach(p => {
    if (!checkIfShipCell(p, player.board)) {
      return
    }
    const tile = treeloomMatrix.getDomItemFromPoint(p, player.board) as Tile
    if (!tile.isHit) {
      treeloom.updateElement(labelTile(siFunciona.mergeObjectsMutable(tile as unknown as DomItem, { attributes: { style: { backgroundColor: shown ? colours.ship : '' } } }) as DomItem))
    }
  })
}

export default shadeShips
