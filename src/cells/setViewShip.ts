import siFunciona from 'si-funciona'
import shipTile from '../components/pieces/shipTile'
import update3dCell from './update3dCell'

/**
 *
 */
const setViewShip = siFunciona.curry(update3dCell)(siFunciona.mergeObjects(shipTile(), { attributes: { style: { backgroundColor: '#777' } } }))

export default setViewShip
