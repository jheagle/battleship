import treeloom from 'treeloom'
import startMenu from './startMenu'
import type { DomItem, DomItemRoot } from 'treeloom/dist/domItem/types'

/**
 * @param e
 * @param button
 */
const restart = (e: Event, button: DomItem): DomItemRoot => startMenu(treeloom.getTopParentItem(button))

export default restart
