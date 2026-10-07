import jsonDom from 'json-dom'
import shadeShips from '../cells/shadeShips'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Player } from '../types'

/**
 * The ship toggles. A player's own checkbox (one-player game) shows or hides their ships. The all-ships control
 * (robots-only game) does the same for every board at once.
 * @param e
 * @param target
 */
const shipsListener = (e: Event, target: DomItem): void => {
  const input = e.target as HTMLInputElement
  const set = (player: Player): void => {
    player.showShips = input.checked
    shadeShips(player, input.checked)
  }
  if (input.className.includes('own-ships')) {
    set(jsonDom.getParentsByClass('player', target)[0] as unknown as Player)
  } else if (input.className.includes('all-ships')) {
    const root = jsonDom.getTopParentItem(target)
    const boards = jsonDom.getChildrenByClass('boards', root.body)[0] as unknown as { children: Player[] }
    boards.children.forEach(set)
  }
}

export default shipsListener
