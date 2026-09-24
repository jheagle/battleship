import siFunciona from 'si-funciona'
import hitTile from '../components/pieces/hitTile'
import update3dCell from './update3dCell'

/**
 *
 */
const setHit = siFunciona.curry(update3dCell)(hitTile())

export default setHit
