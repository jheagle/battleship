import jsonDom from 'json-dom'
import { gamePresets } from './gamePresets'
import { show, showLobby } from './showLobby'
import type { DomItem } from 'json-dom/dist/domItem/types'

/**
 * The game types on the entry screen. Each reveals the lobby for that type (see showLobby). Back hides the lobby
 * again. Presets (and Back) are told apart by their class names, so one listener handles all of them.
 * @param e
 * @param target
 */
const presetListener = (e: Event, target: DomItem): void => {
  const className = (e.target as HTMLElement).className
  const menu = jsonDom.getChildrenByClass('main-menu', jsonDom.getTopParentItem(target).body)[0]
  const preset = Object.keys(gamePresets).find(name => className.includes(name))
  if (preset) {
    showLobby(menu, gamePresets[preset])
  } else if (className.includes('lobby-back')) {
    show(jsonDom.getChildrenByClass('main-menu-form', menu)[0], false)
    show(jsonDom.getChildrenByClass('presets', menu)[0], true)
  }
}

export default presetListener
