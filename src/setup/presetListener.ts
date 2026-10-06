import jsonDom from 'json-dom'
import siFunciona from 'si-funciona'
import type { DomItem } from 'json-dom/dist/domItem/types'

/**
 * The game types on the entry screen. Each fills in the lobby's humans and robots, and reveals the lobby. Back hides the
 * lobby again. Presets are told apart by their class names, so one listener handles all of them.
 * @param e
 * @param target
 */
const presetListener = (e: Event, target: DomItem): void => {
  const className = (e.target as HTMLElement).className
  const root = jsonDom.getTopParentItem(target)
  const menu = jsonDom.getChildrenByClass('main-menu', root.body)[0]
  const form = jsonDom.getChildrenByClass('main-menu-form', menu)[0]
  const presets = jsonDom.getChildrenByClass('presets', menu)[0]
  const show = (item: DomItem, shown: boolean): void => {
    jsonDom.updateElement(siFunciona.mergeObjectsMutable(item, { attributes: { style: { display: shown ? '' : 'none' } } }) as DomItem)
  }
  const presetValues: Record<string, [number, number]> = {
    'preset-solo': [1, 1],
    'preset-multi': [2, 0],
    'preset-robots': [0, 2]
  }
  const preset = Object.keys(presetValues).find(name => className.includes(name))
  if (preset) {
    const [humans, robots] = presetValues[preset]
    ;(jsonDom.getChildrenByName('human-players', form)[0].element as HTMLInputElement).value = String(humans)
    ;(jsonDom.getChildrenByName('robot-players', form)[0].element as HTMLInputElement).value = String(robots)
    show(presets, false)
    show(form, true)
  } else if (className.includes('lobby-back')) {
    show(form, false)
    show(presets, true)
  }
}

export default presetListener
