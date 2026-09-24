import jDomMatrix from 'matrix-dom'
import defaultFleet from './defaultFleet'
import playerSet from '../components/pieces/playerSet'
import playerStats from '../components/pieces/playerStats'
import waterTile from '../components/pieces/waterTile'

/**
 * Create players and associated properties.
 * Takes an integer for the number of players to generate.
 * Returns an array of players.
 * WARNING: This is a recursive function.
 * @param humans
 * @param robots
 * @param players
 * @returns {Array}
 */
const buildPlayers = (humans, robots = 0, players = []) => {
  if (humans < 1 && robots < 1) {
    return players
  }
  const player = playerSet({}, `Player ${players.length + 1}`)
  player.isRobot = humans <= 0
  // square() takes single objects here (matrix-dom's JSDoc says arrays, but arrays get merged in under a '0' key)
  player.board = jDomMatrix.updateMatrixPoints(jDomMatrix.square({
    x: waterTile(player, players),
    matrix: {
      eventListeners: {
        click: [{ listenerFunc: 'attackListener', listenerArgs: {}, listenerOptions: false }]
      }
    }
  }, 10))
  player.shipFleet = defaultFleet(player.board, false) // generate fleet of ships
  player.playerStats = playerStats(player, `${Math.round(player.status * 100) / 100}%`)
  player.children = [player.board, player.playerStats]
  players.push(player)
  return buildPlayers(--humans, humans < 0 ? --robots : robots, players)
}

export default buildPlayers
