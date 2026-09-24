import siFunciona from 'si-funciona'
import configureHtml from './configureHtml'

/**
 * Given a cell and new config data, update the data of the cell
 * @param config
 * @param matrix
 * @param x
 * @param y
 * @param z
 * @param isRobot
 */
const update3dCell = (config, matrix, x, y, z, isRobot = false) => configureHtml(siFunciona.mergeObjectsMutable(matrix.children[z].children[y].children[x], config), isRobot)

export default update3dCell
