import { colours } from '../theme'
import type { DomItem } from 'treeloom/dist/domItem/types'
import type { Board, Player, Tile } from '../types'

/**
 * What a tile's background colour shows, in words. The colours are the only state a player can see on a board (see
 * colourHitCell, setViewShip, shadeShips), so the words come from the colour, never from hasShip: a hidden ship must
 * not be announced to a screen reader any more than it is shown on screen.
 */
const colourWords: Record<string, string> = {
  [colours.hit]: 'hit',
  [colours.miss]: 'miss',
  [colours.ship]: 'ship'
}

/**
 * A tile's coordinate as players call it: the column as a letter, the row as a number, so (0, 0) is A1 and (9, 9) J10.
 * @param point
 */
export const coordinateName = (point: { x: number, y: number }): string => `${String.fromCharCode(65 + point.x)}${point.y + 1}`

/**
 * A tile's accessible name: its coordinate, then what its colour shows, e.g. "B4", "B4, miss", "C7, hit".
 * @param tile
 */
export const tileLabel = (tile: Tile): string => {
  const colour = (tile.attributes as { style?: { backgroundColor?: string } } | undefined)?.style?.backgroundColor ?? ''
  return [coordinateName(tile.point), colourWords[colour]].filter(Boolean).join(', ')
}

/**
 * Set a tile's accessible name from what it currently shows (call it before updateElement, so the element gets it).
 * @param tile
 */
const labelTile = <T extends DomItem | Tile>(tile: T): T => {
  const item = tile as unknown as Tile
  if (item.point && typeof item.point.x === 'number') {
    item.attributes['aria-label'] = tileLabel(item)
  }
  return tile
}

/**
 * Name every tile of a board.
 * @param board
 */
export const labelBoardTiles = (board: Board): Board => {
  board.children.forEach(layer => layer.children.forEach(row => row.children.forEach(tile => labelTile(tile))))
  return board
}

/**
 * Name a player's board after the player (the name can change during placement, see updatePlayerStats).
 * @param player
 */
export const labelBoard = (player: Player): Player => {
  player.board.attributes['aria-label'] = `${player.name}'s board`
  return player
}

export default labelTile
