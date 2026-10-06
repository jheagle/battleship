import jDomMatrix from 'matrix-dom'
import defaultFleet from './defaultFleet'
import playerColour from './playerColours'
import playerSet from '../components/pieces/playerSet'
import playerStats from '../components/pieces/playerStats'
import waterTile from '../components/pieces/waterTile'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Player } from '../types'

/**
 * Create players and associated properties.
 * Takes an integer for the number of players to generate.
 * Returns an array of players.
 * WARNING: This is a recursive function.
 * @param humans
 * @param robots
 * @param players
 */
const buildPlayers = (humans: number, robots: number = 0, players: Player[] = []): Player[] => {
  if (humans < 1 && robots < 1) {
    return players
  }
  const player = playerSet({}, `Player ${players.length + 1}`)
  player.isRobot = humans <= 0
  player.colour = playerColour(players.length)
  player.attributes = { ...player.attributes, style: { borderColor: player.colour } }
  // square() takes single objects here (matrix-dom's JSDoc says arrays, but arrays get merged in under a '0' key)
  player.board = jDomMatrix.updateMatrixPoints(jDomMatrix.square({
    x: waterTile(),
    matrix: {
      eventListeners: {
        click: [{ listenerFunc: 'attackListener', listenerArgs: {}, listenerOptions: false }]
      }
    }
  }, 10))
  // Robots get a random fleet now. Humans place their own during the placement phase (see placement.ts)
  player.shipFleet = player.isRobot ? defaultFleet(player.board, false) : []
  // playerStats is a plain config at this point; it becomes a real item once the player is rendered (see beginRound)
  player.playerStats = playerStats(player, `${Math.round(player.status * 100) / 100}%`) as unknown as DomItem
  player.children = [player.board, player.playerStats]
  players.push(player)
  return buildPlayers(--humans, humans < 0 ? --robots : robots, players)
}

export default buildPlayers
