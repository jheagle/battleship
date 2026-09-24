import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'
import gameTile from './gameTile'

/**
 * Set the style for tiles representing water.
 * @function waterTile
 * @returns {{hasShip: boolean, isHit: boolean, eventListeners: {click: {listenerFunc: attackListener, listenerArgs: {}, listenerOptions: boolean}}, point: {}}}
 */
const waterTile = () => siFunciona.mergeObjects(gameTile(), matrixDom.tile())

export default waterTile
