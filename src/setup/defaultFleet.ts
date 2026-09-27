import siFunciona from 'si-funciona'
import generateRandomFleet from './generateRandomFleet'

/**
 * Create a default fleet using the standard battleship lengths.
 * @param {Object} matrix
 * @param {boolean} [view=false]
 * @returns {Array}
 */
const defaultFleet = siFunciona.curry(generateRandomFleet)([{ name: 'Aircraft Carrier', size: 5 }, {
  name: 'Battleship',
  size: 4
}, { name: 'Submarine', size: 3 }, { name: 'Cruiser', size: 3 }, { name: 'Destroyer', size: 2 }])

export default defaultFleet
