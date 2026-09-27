import siFunciona from 'si-funciona'
import shipTile from '../components/pieces/shipTile'
import update3dCell from './update3dCell'

import type { Board, Tile } from '../types'

/**
 * Set a hidden ship part at the given coordinates (not shown, the default cell styling still applies).
 */
const setHiddenShip: (matrix: Board, x: number, y: number, z: number, isRobot?: boolean) => Tile = siFunciona.curry(update3dCell)(shipTile())

export default setHiddenShip
