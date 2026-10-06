import siFunciona from 'si-funciona'
import { bestHitChance } from './densityTargets'
import type { Player } from '../types'

/**
 * A rule for choosing which player the robot attacks. The game uses eliminationRule; other game styles can pass another.
 */
export type VictimRule = (players: Player[]) => Player

/**
 * The hits still needed to sink a player's unsunk ships: the unhit parts of every ship which is not yet sunk.
 * @param player
 */
export const remainingHitPoints = (player: Player): number => player.shipFleet
  .filter(ship => ship.status > 0)
  .reduce((total, ship) => total + ship.parts.filter(part => !part.isHit).length, 0)

/**
 * The players with the lowest score, or with the highest when `highest` is set.
 * @param players
 * @param score
 * @param highest
 */
const best = (players: Player[], score: (player: Player) => number, highest: boolean = false): Player[] => {
  const scores = players.map(score)
  const top = highest ? Math.max(...scores) : Math.min(...scores)
  return players.filter((_, i) => scores[i] === top)
}

/**
 * The players still afloat, or everyone when none is.
 * @param players
 */
const afloat = (players: Player[]): Player[] => {
  const alive = players.filter(p => p.status > 0)
  return alive.length ? alive : players
}

const pickOne = (players: Player[]): Player => players[siFunciona.randomInteger(players.length)]

/**
 * Elimination first: attack the player with the fewest hits still needed to sink everything they have left, so the
 * robot knocks them out soonest. Ties are picked at random. This is the rule the game uses.
 * @param players
 */
export const eliminationRule: VictimRule = players => pickOne(best(afloat(players), remainingHitPoints))

/**
 * Hit chance first: attack the player whose best cell has the highest chance of holding a ship part. Not used by the game
 * yet. In simulation it prolongs games, because it favours boards with more ship left, but a game style which scores hits
 * may want it.
 * @param players
 */
export const hitChanceRule: VictimRule = players => pickOne(best(afloat(players), bestHitChance, true))
