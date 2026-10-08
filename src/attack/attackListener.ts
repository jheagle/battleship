import matrixDom from 'matrix-dom'
import attackFleet from './attackFleet'
import { isPlacing, placeCell } from '../setup/placement'
import { handleRemoteBoardClick, isRemoteSessionActive } from '../setup/remotePlacement'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Board, Player, Tile } from '../types'

/**
 * target is the board the listener was attached to (see buildPlayers): a DomItem here, like every listener's target,
 * but really always a Board. During the placement phase a click places a ship rather than attacking - local
 * hot-seat's own handoff-based placement, or (for a remote game) simultaneous per-player placement/ordering;
 * exactly one of the two is ever active for a given game, never both.
 * @param e
 * @param target
 */
const attackListener = (e: Event, target: DomItem): Player[] => {
  const board = target as unknown as Board
  const tile = matrixDom.getDomItemFromElement(e.target as Node, board) as Tile
  if (isRemoteSessionActive(target)) {
    handleRemoteBoardClick(tile, board)
    return []
  }
  if (isPlacing(target)) {
    placeCell(tile, board)
    return []
  }
  return attackFleet(tile)
}

export default attackListener
