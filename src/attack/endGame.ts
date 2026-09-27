import jsonDom from 'json-dom'
import finalScore from '../components/layout/finalScore'
import updatePlayerStats from './updatePlayerStats'

/**
 * Final state once a game is won (only one player remains)
 * @param winner
 * @returns {Array.<*>}
 */
const endGame = (winner) => {
  const parent = jsonDom.getTopParentItem(winner)
  const players = winner.parentItem.children
  players.map(player => updatePlayerStats(player))
  winner = updatePlayerStats(winner, 'WINNER')
  jsonDom.renderHtml(finalScore(players), parent.body)
  return [winner]
}

export default endGame
