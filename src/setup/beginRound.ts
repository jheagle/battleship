import jsonDom from 'json-dom'
import siFunciona from 'si-funciona'
import boards from '../components/layout/boards'
import buildPlayers from './buildPlayers'
import computerAttack from '../robot/computerAttack'
import updatePlayer from '../attack/updatePlayer'
import { startPlacement } from './placement'
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
  if (humans < 0 || humans > 100 || robots < 0 || robots > 100) {
    return false
  }
  const firstGoesFirst = (jsonDom.getChildrenByName('first-go-first', mainForm)[0].element as HTMLInputElement).checked
  if (humans === 0) {
    robots = robots < 2 ? 2 : robots
  }
  if (humans === 1) {
    robots = robots < 1 ? 1 : robots
  }
  jsonDom.removeChild(parent.body, jsonDom.getChildrenByClass('main-menu', parent.body)[0])
  const players = jsonDom.renderHtml(boards(buildPlayers(humans, robots)), parent.body).children as Player[]
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
