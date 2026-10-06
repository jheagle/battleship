import jsonDom from 'json-dom'
import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Player, Tile } from '../types'

/**
 * Mark the cells of a board which can still be attacked: the ones not yet hit. The class is what the stylesheet uses to
 * show a target cursor and a highlight when hovered. Tiles keep their own class ('column'), so only this is added.
 * @param victim
 * @param attackable
 */
const markBoard = (victim: Player, attackable: boolean): void => {
  matrixDom.getAllPoints(victim.board).filter(point => point.z === 0).forEach(point => {
    const tile = matrixDom.getDomItemFromPoint(point, victim.board) as Tile
    const className = attackable && !tile.isHit ? 'column valid-target' : 'column'
    jsonDom.updateElement(siFunciona.mergeObjectsMutable(tile as unknown as DomItem, { attributes: { className } }) as DomItem)
  })
}

/**
 * Show a human which cells of the board they are attacking can still be hit.
 * @param victim
 */
export const showValidTargets = (victim: Player): void => markBoard(victim, true)

/**
 * Remove the markers when the turn passes.
 * @param victim
 */
export const clearValidTargets = (victim: Player): void => markBoard(victim, false)
