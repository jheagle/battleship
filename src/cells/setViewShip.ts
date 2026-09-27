import siFunciona from 'si-funciona'
import shipTile from '../components/pieces/shipTile'
import update3dCell from './update3dCell'

import type { Board, Tile } from '../types'

/**
 * Set a visible ship part at the given coordinates (shown with a grey background).
 */
const setViewShip: (matrix: Board, x: number, y: number, z: number, isRobot?: boolean) => Tile = siFunciona.curry(update3dCell)(siFunciona.mergeObjects(shipTile(), { attributes: { style: { backgroundColor: '#777' } } }))

export default setViewShip
