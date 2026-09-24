import jsonDom from 'json-dom'
import startMenu from './startMenu'

/**
 * @function restart
 * @param e
 * @param button
 */
const restart = (e, button) => startMenu(jsonDom.getTopParentItem(button))

export default restart
