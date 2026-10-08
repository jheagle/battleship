import jsonDom from 'json-dom'
import finalScore from '../components/layout/finalScore'
import updatePlayerStats from './updatePlayerStats'
import { getSession } from '../setup/gameSession'
import type { DomItem, DomItemRoot } from 'json-dom/dist/domItem/types'
import type { Player } from '../types'

/**
 * Final state once a game is won (only one player remains). Local hot-seat's own finalScore screen (Play Again,
 * Change Settings, Main Menu) assumes one physical screen controlling the whole game - a remote room's own game
 * session overrides this via onGameOver (see gameSession.ts, server/gameplay.ts) with something that makes
 * sense for several independent, already-forwarding clients instead.
 * @param winner
 */
const endGame = (winner: Player): Player[] => {
  const parent = jsonDom.getTopParentItem(winner) as DomItemRoot
  const players = (winner.parentItem as DomItem).children as Player[]
  players.map(player => updatePlayerStats(player))
  winner = updatePlayerStats(winner, 'WINNER')
  const onGameOver = getSession(parent).onGameOver
  if (onGameOver) {
    onGameOver(players, parent)
  } else {
    jsonDom.renderHtml(finalScore(players), parent.body)
  }
  return [winner]
}

export default endGame
