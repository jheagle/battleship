import jsonDom from 'json-dom'
import { startNewGame } from './startNewGame'
import { getGameMode, setGameSettings } from './gameOptions'
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
  // Up to four humans on one screen, up to four robots, and six players in all so the boards still fit
  if (humans < 0 || humans > 4 || robots < 0 || robots > 4 || humans + robots > 6) {
    return false
  }
  // Each game type has its own limits: one human; two to four humans; or no humans
  const mode = getGameMode()
  if ((mode === 'solo' && humans !== 1) || (mode === 'multi' && (humans < 2 || humans > 4)) || (mode === 'robots' && humans !== 0)) {
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
  setGameSettings({ humans, robots, firstGoesFirst })
  startNewGame(parent, humans, robots, firstGoesFirst, hints)
  return false
}

export default beginRound
