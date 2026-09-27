import jsonDom from 'json-dom'
import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'

/**
 *
 * @param data
 * @returns {void|Array|Object|*}
 */
const resetTargets = data => {
  data.victim.board.children.map(l => jsonDom.updateElement(siFunciona.mergeObjectsMutable(l, { attributes: { style: { borderColor: '#333' } } })))
  data.targets.forEach(t => jsonDom.updateElement(siFunciona.mergeObjectsMutable(matrixDom.getDomItemFromPoint(t, data.victim.board), { attributes: { style: { borderColor: '#333' } } })))
  if (!data.target) {
    data.victim.board.children.map(l => jsonDom.updateElement(siFunciona.mergeObjectsMutable(l, { attributes: { style: { borderColor: 'yellow' } } })))
    data.targets.forEach(t => jsonDom.updateElement(siFunciona.mergeObjectsMutable(matrixDom.getDomItemFromPoint(t, data.victim.board), { attributes: { style: { borderColor: 'yellow' } } })))
  }
  return data
}

export default resetTargets
