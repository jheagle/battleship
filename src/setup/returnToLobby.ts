import treeloom from 'treeloom'
import startMenu from './startMenu'
import { getGameMode, getGameSettings, getHintSetting } from './gameOptions'
import { presetForMode } from './gamePresets'
import { showLobby } from './showLobby'
import type { DomItemRoot } from 'treeloom/dist/domItem/types'
import type { DomItem } from 'treeloom/dist/domItem/types'

/**
 * Back to the lobby, with the settings from the game that just ended already filled in, so they can be changed
 * before playing again - unlike the main menu button, which goes all the way back to choosing the game type.
 * @param e
 * @param button
 */
const returnToLobby = (e: Event, button: DomItem): DomItemRoot => {
  const root = startMenu(treeloom.getTopParentItem(button))
  const menu = treeloom.getChildrenByClass('main-menu', root.body)[0]
  showLobby(menu, presetForMode(getGameMode(root)), { ...getGameSettings(root), hints: getHintSetting(root) })
  return root
}

export default returnToLobby
