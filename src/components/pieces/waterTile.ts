import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'
import gameTile from './gameTile'
import type { Tile } from '../../types'

/**
 * Set the style for tiles representing water: a default (unhit, shipless) tile with an empty point, ready to be given
 * its real point when the board is built.
 */
const waterTile = (): Tile => siFunciona.mergeObjects(gameTile(), matrixDom.tile())

export default waterTile
