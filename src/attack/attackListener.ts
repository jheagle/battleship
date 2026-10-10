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
  const tile = matrixDom.getDomItemFromElement(e.target as Node, board) as Tile | false
  // getDomItemFromElement resolves the real click target's position *within this board's own real DOM
  // ancestry* (matrix-dom's own getPointFromElement - still position-based, unrelated to json-dom's own id
  // work) - false when e.target does not sit where a tile of this specific board is expected. Every caller
  // downstream (attackFleet, placeCell, handleRemoteBoardClick) assumes a real Tile and would otherwise throw
  // on the bare boolean several calls deep (getSession/getTopParentItem reading .parentItem off it) - a
  // malformed or unexpected click should be silently ignored here, not crash the whole server for everyone.
  if (!tile) {
    return []
  }
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
