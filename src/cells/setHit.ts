import siFunciona from 'si-funciona'
import hitTile from '../components/pieces/hitTile'
import update3dCell from './update3dCell'

import type { Board, Tile } from '../types'

/**
 * Mark the cell at the given coordinates as hit.
 */
const setHit: (matrix: Board, x: number, y: number, z: number, isRobot?: boolean) => Tile = siFunciona.curry(update3dCell)(hitTile())

export default setHit
