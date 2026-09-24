import siFunciona from 'si-funciona'
import shipTile from '../components/pieces/shipTile'
import update3dCell from './update3dCell'

/**
 *
 */
const setHiddenShip = siFunciona.curry(update3dCell)(shipTile())

export default setHiddenShip
