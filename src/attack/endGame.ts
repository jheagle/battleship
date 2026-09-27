import jsonDom from 'json-dom'
import finalScore from '../components/layout/finalScore'
import updatePlayerStats from './updatePlayerStats'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Player } from '../types'

/**
 * Final state once a game is won (only one player remains)
 * @param winner
 */
const endGame = (winner: Player): Player[] => {
  const parent = jsonDom.getTopParentItem(winner)
  const players = (winner.parentItem as DomItem).children as Player[]
  players.map(player => updatePlayerStats(player))
  winner = updatePlayerStats(winner, 'WINNER')
  jsonDom.renderHtml(finalScore(players), parent.body)
  return [winner]
}

export default endGame
