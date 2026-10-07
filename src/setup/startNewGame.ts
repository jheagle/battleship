import jsonDom from 'json-dom'
import siFunciona from 'si-funciona'
import boards from '../components/layout/boards'
import buildPlayers from './buildPlayers'
import computerAttack from '../robot/computerAttack'
import updatePlayer from '../attack/updatePlayer'
import { startPlacement } from './placement'
import { getGameMode, setHintSetting } from './gameOptions'
import showShipsControl from '../components/layout/showShipsControl'
import type { HintSetting } from './gameOptions'
import type { DomItemRoot } from 'json-dom/dist/domItem/types'
import type { Player } from '../types'

/**
 * Remove everything from the page: whatever screen was showing (the menu, a finished game's final scores, or a game
 * in progress), so a new one can be built on a blank page.
 * @param parent
 */
const clearBody = (parent: DomItemRoot): void => {
  for (let i = parent.body.children.length - 1; i >= 0; --i) {
    jsonDom.removeChild(parent.body, parent.body.children[i])
  }
}

/**
 * Pick the first attacker, and let a robot start if it is one.
 * @param order
 * @param firstGoesFirst undefined when the order was chosen, so the first player of it goes first
 */
const startRound = (order: Player[], firstGoesFirst: boolean | undefined): void => {
  const firstAttacker = updatePlayer(firstGoesFirst === false ? order[siFunciona.randomInteger(order.length)] : order[0])
  if (firstAttacker.isRobot) {
    computerAttack(firstAttacker, order)
  }
}

/**
 * Build the players, place their ships, and start the round. Shared by beginRound (reading these settings from the
 * lobby form) and playAgain (reading them from the settings the last game was started with) - either way, this is
 * the one place a round actually begins.
 * @param parent
 * @param humans
 * @param robots
 * @param firstGoesFirst
 * @param hints
 */
export const startNewGame = (parent: DomItemRoot, humans: number, robots: number, firstGoesFirst: boolean, hints: HintSetting): void => {
  setHintSetting(parent, hints)
  clearBody(parent)
  // Robots only: one control above the boards shows every ship at once
  if (getGameMode(parent) === 'robots') {
    jsonDom.renderHtml(jsonDom.createDomItem(showShipsControl()), parent.body)
  }
  const players = jsonDom.renderHtml(boards(buildPlayers(humans, parent.body, robots)), parent.body).children as Player[]
  // With hints on for everyone, every human gets them on their turn; with them off or optional, nobody does by default
  players.filter(player => !player.isRobot).forEach(player => { player.showHint = hints === 'on' })
  startPlacement(players, parent.body, order => startRound(order, humans > 1 ? undefined : firstGoesFirst))
}
