import jsonDom from 'json-dom'
import { startNewGame } from './startNewGame'
import { getGameMode, setGameSettings } from './gameOptions'
import { presetForMode } from './gamePresets'
import type { HintSetting } from './gameOptions'
import type { DomItem } from 'json-dom/dist/domItem/types'

/**
 * Logic for setting up and starting a new round from the lobby form.
 * @param e
 * @param mainForm
 */
const beginRound = (e: Event, mainForm: DomItem): boolean => {
  if (e.eventPhase !== 2) {
    return false
  }
  console.log('beginRound', e.eventPhase, e.type)
  e.preventDefault()
  const parent = jsonDom.getTopParentItem(mainForm)
  const humans = parseInt((jsonDom.getChildrenByName('human-players', mainForm)[0].element as HTMLInputElement).value)
  let robots = parseInt((jsonDom.getChildrenByName('robot-players', mainForm)[0].element as HTMLInputElement).value)
  // Each game type has its own upper limits on both fields, from the same preset showLobby used to set the
  // form's own min/max in the first place - one human; two to four humans; or no humans, plus each mode's own
  // robot ceiling and total. robotsMin is deliberately NOT enforced here: the form's own native HTML validation
  // (robot-players' min attribute) already blocks submitting below it when the lobby was actually used, and the
  // self-starting Node path (main.ts) submits the raw form with no preset/lobby involved at all - its own 0/0
  // defaults rely on the bump-up below to reach a valid minimum, not a reject here.
  const mode = getGameMode(parent)
  const preset = presetForMode(mode)
  if (humans < preset.humansRange[0] || humans > preset.humansRange[1] || robots < 0 || robots > preset.robotsMax || humans + robots > preset.totalMax) {
    return false
  }
  const firstGoesFirst = (jsonDom.getChildrenByName('first-go-first', mainForm)[0].element as HTMLInputElement).checked
  const hints = (jsonDom.getChildrenByName('hint-setting', mainForm)[0].element as HTMLSelectElement).value as HintSetting
  if (humans === 0) {
    robots = robots < 2 ? 2 : robots
  }
  if (humans === 1) {
    robots = robots < 1 ? 1 : robots
  }
  setGameSettings(parent, { humans, robots, firstGoesFirst })
  startNewGame(parent, humans, robots, firstGoesFirst, hints)
  return false
}

export default beginRound
