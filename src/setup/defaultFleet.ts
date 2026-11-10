import siFunciona from 'si-funciona'
import generateRandomFleet from './generateRandomFleet'
import type { Board, Ship, ShipSpec } from '../types'

/**
 * Create a default fleet using the standard fleet lengths (5, 4, 3, 3, 2).
 * @param matrix
 * @param view
 */
export const defaultShipSpecs: ShipSpec[] = [{ name: 'Mothership', size: 5 }, { name: 'Dreadnought', size: 4 }, { name: 'Phantom', size: 3 }, { name: 'Cruiser', size: 3 }, { name: 'Scout', size: 2 }]

const defaultFleet: (matrix: Board, view?: boolean) => Ship[] = siFunciona.curry(generateRandomFleet)(defaultShipSpecs)

export default defaultFleet
