import getBrokenItems from './getBrokenItems'

/**
 * Return all of the players which have broken ships.
 * @function getBrokenShipsPlayers
 * @param players
 * @returns {Array}
 */
const getBrokenShipsPlayers = players => players.filter(p => getBrokenItems(p.shipFleet).length)

export default getBrokenShipsPlayers
