import jsonDom from 'json-dom'
import siFunciona from 'si-funciona'
import { setGameMode } from './gameOptions'
import type { GameMode } from './gameOptions'
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
  const update = (item: DomItem, attributes: object): void => {
    jsonDom.updateElement(siFunciona.mergeObjectsMutable(item, { attributes }) as DomItem)
  }
  const show = (item: DomItem, shown: boolean): void => update(item, { style: { display: shown ? '' : 'none' } })
  const presetValues: Record<string, { mode: GameMode, title: string, humans: number, robots: number, humansShown: boolean, humansRange: [number, number], robotsMin: number }> = {
    'preset-solo': { mode: 'solo', title: 'Lobby: Player vs Robots', humans: 1, robots: 1, humansShown: false, humansRange: [1, 1], robotsMin: 1 },
    'preset-multi': { mode: 'multi', title: 'Lobby: 2-4 Multiplayer', humans: 2, robots: 0, humansShown: true, humansRange: [2, 4], robotsMin: 0 },
    'preset-robots': { mode: 'robots', title: 'Lobby: Robot Battle', humans: 0, robots: 2, humansShown: false, humansRange: [0, 0], robotsMin: 2 }
  }
  const preset = Object.keys(presetValues).find(name => className.includes(name))
  if (preset) {
    const choice = presetValues[preset]
    setGameMode(choice.mode)
    const humanInput = jsonDom.getChildrenByName('human-players', form)[0]
    const robotInput = jsonDom.getChildrenByName('robot-players', form)[0]
    // Limits first: updating an input re-applies its stored value, so the values are set after them
    update(humanInput, { min: choice.humansRange[0], max: choice.humansRange[1] })
    update(robotInput, { min: choice.robotsMin })
    ;(humanInput.element as HTMLInputElement).value = String(choice.humans)
    ;(robotInput.element as HTMLInputElement).value = String(choice.robots)
    update(jsonDom.getChildrenByClass('human-group', form)[0], { style: { display: choice.humansShown ? '' : 'none' } })
    update(jsonDom.getChildrenByClass('lobby-title', menu)[0], { innerHTML: choice.title })
    show(presets, false)
    show(form, true)
  } else if (className.includes('lobby-back')) {
    show(form, false)
    show(presets, true)
  }
}

export default presetListener
