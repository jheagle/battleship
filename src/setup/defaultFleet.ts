import siFunciona from 'si-funciona'
import generateRandomFleet from './generateRandomFleet'
import type { Board, Ship } from '../types'

/**
 * Create a default fleet using the standard battleship lengths.
 * @param matrix
 * @param view
 */
const defaultFleet: (matrix: Board, view?: boolean) => Ship[] = siFunciona.curry(generateRandomFleet)([{ name: 'Aircraft Carrier', size: 5 }, {
  name: 'Battleship',
  size: 4
}, { name: 'Submarine', size: 3 }, { name: 'Cruiser', size: 3 }, { name: 'Destroyer', size: 2 }])

export default defaultFleet
