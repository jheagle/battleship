import jsonDom from 'json-dom'
import siFunciona from 'si-funciona'
import { setGameMode } from './gameOptions'
import type { GamePreset } from './gamePresets'
import type { HintSetting } from './gameOptions'
import type { DomItem } from 'json-dom/dist/domItem/types'

/**
 * Update an item's attributes in place on the real element.
 * @param item
 * @param attributes
 */
export const update = (item: DomItem, attributes: object): void => {
  jsonDom.updateElement(siFunciona.mergeObjectsMutable(item, { attributes }) as DomItem)
}

/**
 * Show or hide an item by its display style.
 * @param item
 * @param shown
 */
export const show = (item: DomItem, shown: boolean): void => update(item, { style: { display: shown ? '' : 'none' } })

/** The values a lobby is shown with: a preset's own defaults, unless told otherwise. */
export interface LobbyValues {
  humans?: number
  robots?: number
  firstGoesFirst?: boolean
  hints?: HintSetting
}

/**
 * Show the lobby for a game type, inside an already-rendered main menu: sets its title and field limits from the
 * preset, fills in the given values (or the preset's own defaults), and reveals it in place of the game types.
 * @param menu
 * @param preset
 * @param values
 */
export const showLobby = (menu: DomItem, preset: GamePreset, values: LobbyValues = {}): void => {
  const form = jsonDom.getChildrenByClass('main-menu-form', menu)[0]
  const presets = jsonDom.getChildrenByClass('presets', menu)[0]
  setGameMode(preset.mode)
  const humanInput = jsonDom.getChildrenByName('human-players', form)[0]
  const robotInput = jsonDom.getChildrenByName('robot-players', form)[0]
  // Limits first: updating an input re-applies its stored value, so the values are set after them
  update(humanInput, { min: preset.humansRange[0], max: preset.humansRange[1] })
  update(robotInput, { min: preset.robotsMin })
  ;(humanInput.element as HTMLInputElement).value = String(values.humans ?? preset.humans)
  ;(robotInput.element as HTMLInputElement).value = String(values.robots ?? preset.robots)
  ;(jsonDom.getChildrenByName('first-go-first', form)[0].element as HTMLInputElement).checked = values.firstGoesFirst ?? true
  ;(jsonDom.getChildrenByName('hint-setting', form)[0].element as HTMLSelectElement).value = values.hints ?? 'optional'
  update(jsonDom.getChildrenByClass('human-group', form)[0], { style: { display: preset.humansShown ? '' : 'none' } })
  update(jsonDom.getChildrenByClass('lobby-title', menu)[0], { innerHTML: preset.title })
  update(jsonDom.getChildrenByClass('first-group', form)[0], { style: { display: preset.firstShown ? '' : 'none' } })
  show(presets, false)
  show(form, true)
}
