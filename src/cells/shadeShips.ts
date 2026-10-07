import jsonDom from 'json-dom'
import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'
import checkIfShipCell from '../utils/checkIfShipCell'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Player, Tile } from '../types'

/**
 * Show or hide a player's ships on their board. Ships which have been hit keep the colour they were given when hit, so
 * only the parts not yet hit change.
 * @param player
 * @param shown
 */
const shadeShips = (player: Player, shown: boolean): void => {
  matrixDom.getAllPoints(player.board).filter(p => p.z === 0).forEach(p => {
    if (!checkIfShipCell(p, player.board)) {
      return
    }
    const tile = matrixDom.getDomItemFromPoint(p, player.board) as Tile
    if (!tile.isHit) {
      jsonDom.updateElement(siFunciona.mergeObjectsMutable(tile as unknown as DomItem, { attributes: { style: { backgroundColor: shown ? '#777' : '' } } }) as DomItem)
    }
  })
}

export default shadeShips
