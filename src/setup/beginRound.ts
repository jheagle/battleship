import jsonDom from 'json-dom'
import siFunciona from 'si-funciona'
import boards from '../components/layout/boards'
import buildPlayers from './buildPlayers'
import computerAttack from '../robot/computerAttack'
import updatePlayer from '../attack/updatePlayer'
import { startPlacement } from './placement'
import { getGameMode, setHintSetting } from './gameOptions'
import type { HintSetting } from './gameOptions'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Player } from '../types'

/**
 * Logic for setting up and starting a new round
 * (selects random start player and calls computer attack if it is AI starting)
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
  setHintSetting(hints)
  if (humans === 0) {
    robots = robots < 2 ? 2 : robots
  }
  if (humans === 1) {
    robots = robots < 1 ? 1 : robots
  }
  jsonDom.removeChild(parent.body, jsonDom.getChildrenByClass('main-menu', parent.body)[0])
  const players = jsonDom.renderHtml(boards(buildPlayers(humans, robots)), parent.body).children as Player[]
  // With hints on for everyone, every human gets them on their turn; with them off or optional, nobody does by default
  players.filter(player => !player.isRobot).forEach(player => { player.showHint = hints === 'on' })
  startPlacement(players, parent.body, () => startRound(players, firstGoesFirst))
  return false
}

/**
 * Pick the first attacker, and let a robot start if it is one.
 * @param players
 * @param firstGoesFirst
 */
const startRound = (players: Player[], firstGoesFirst: boolean): void => {
  const firstAttacker = updatePlayer(firstGoesFirst ? players[0] : players[siFunciona.randomInteger(players.length)])
  if (firstAttacker.isRobot) {
    computerAttack(firstAttacker, players)
  }
}

export default beginRound
