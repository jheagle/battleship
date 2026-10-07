import jsonDom from 'json-dom'
import { startNewGame } from './startNewGame'
import { getGameSettings, getHintSetting } from './gameOptions'
import type { DomItem } from 'json-dom/dist/domItem/types'

/**
 * Play again with the same settings as the game that just ended: the same humans, robots, who goes first, and hint
 * setting. Only the settings carry over, not the fleets or the board state - a new game still places its ships,
 * for multiplayer same as the first time.
 * @param e
 * @param button
 */
const playAgain = (e: Event, button: DomItem): void => {
  const parent = jsonDom.getTopParentItem(button)
  const { humans, robots, firstGoesFirst } = getGameSettings(parent)
  startNewGame(parent, humans, robots, firstGoesFirst, getHintSetting(parent))
}

export default playAgain
