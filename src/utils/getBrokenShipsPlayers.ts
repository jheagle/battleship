import getBrokenItems from './getBrokenItems'
import type { Player } from '../types'

/**
 * Return all of the players which have broken ships.
 * @param players
 */
const getBrokenShipsPlayers = (players: Player[]): Player[] => players.filter(p => getBrokenItems(p.shipFleet).length)

export default getBrokenShipsPlayers
