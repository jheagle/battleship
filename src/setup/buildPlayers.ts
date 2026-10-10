import jsonDom from 'json-dom'
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
 * @param root the game's own root, since a player isn't attached to it yet at this point - see playerStats
 * @param robots
 * @param players
 */
const buildPlayers = (humans: number, root: DomItem, robots: number = 0, players: Player[] = []): Player[] => {
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
  // Completed via createDomItem right here, not left as a plain config for later recursive discovery to pick
  // up: player already carries its own has map (battleship.player, set directly in playerSet.ts, not via
  // withTrait), so createCoreItem's "skip children which already look complete" check treats player itself
  // as already done whenever it is found as someone else's child (see boards.ts) - its own children, this one
  // included, would otherwise never get a real id/parentItem/has at all. updatePlayerStats's own later merges
  // depend on this: merging a freshly-built config's ship list onto an already-complete one (same length
  // every time - shipFleet never changes size) updates each <li>'s text in place; merging it onto a list that
  // was never completed in the first place falls back to using the fresh, incomplete items "as is" instead.
  // It is not attached to root yet either, so root is passed in for it to read the game's settings from instead.
  player.playerStats = jsonDom.createDomItem(playerStats(player, `${Math.round(player.status * 100) / 100}%`, root)) as unknown as DomItem
  player.children = [{ nodeName: 'div', attributes: { className: 'turn-badge' } } as unknown as DomItem, player.board, player.playerStats]
  players.push(player)
  return buildPlayers(--humans, root, humans < 0 ? --robots : robots, players)
}

export default buildPlayers
