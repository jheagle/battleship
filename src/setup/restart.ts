import jsonDom from 'json-dom'
import startMenu from './startMenu'
import type { DomItem, DomItemRoot } from 'json-dom/dist/domItem/types'

/**
 * @param e
 * @param button
 */
const restart = (e: Event, button: DomItem): DomItemRoot => startMenu(jsonDom.getTopParentItem(button))

export default restart
