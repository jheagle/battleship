import matrixDom from 'matrix-dom'
import attackFleet from './attackFleet'

/**
 *
 * @function attackListener
 * @param e
 * @param target
 * @returns {*}
 */
const attackListener = (e, target) => attackFleet(matrixDom.getDomItemFromElement(e.target, target))

export default attackListener
