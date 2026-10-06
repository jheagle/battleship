import jsonDom from 'json-dom'
import { clearHeatHint, showHeatHint, victimsOf } from './heatHint'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Player } from '../types'

/**
 * The hint checkbox in a human's panel: switching it on shows the heat map at once if it is their turn.
 * @param e
 * @param target
 */
const hintListener = (e: Event, target: DomItem): void => {
  const player = jsonDom.getParentsByClass('player', target)[0] as unknown as Player
  player.showHint = (e.target as HTMLInputElement).checked
  if (!player.attacker) {
    return // The hint only shows during the player's own turn; updatePlayer shows it when the turn starts
  }
  victimsOf(player).forEach(victim => player.showHint ? showHeatHint(victim) : clearHeatHint(victim))
}

export default hintListener
