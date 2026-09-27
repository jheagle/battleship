import matrixDom from 'matrix-dom'
import attackFleet from './attackFleet'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Board, Player, Tile } from '../types'

/**
 * target is the board the listener was attached to (see buildPlayers): a DomItem here, like every listener's target,
 * but really always a Board.
 * @param e
 * @param target
 */
const attackListener = (e: Event, target: DomItem): Player[] => attackFleet(matrixDom.getDomItemFromElement(e.target as Node, target as unknown as Board) as Tile)

export default attackListener
