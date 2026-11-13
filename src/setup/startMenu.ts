import treeloom from 'treeloom'
import mainMenu from '../components/layout/mainMenu'
import { startIntroDemo } from '../intro/introDemo'
import type { DomItemRoot } from 'treeloom/dist/domItem/types'

/**
 * The entry function
 * @param parent
 */
const startMenu = (parent: DomItemRoot): DomItemRoot => {
  for (let i = parent.body.children.length - 1; i >= 0; --i) {
    treeloom.removeChild(parent.body, parent.body.children[i])
  }
  treeloom.renderHtml(mainMenu(), parent.body)
  // In the browser's page layout (gameRoot: the game in <main>, under the header), robots play behind the menu
  if (typeof document !== 'undefined' && (parent.body.element as Element | undefined)?.matches?.('main.game') && document.querySelector('header.game-header')) {
    startIntroDemo(parent.eventActions)
  }
  return parent
}

export default startMenu
