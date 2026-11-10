import jsonDom from 'json-dom'
import mainMenu from '../components/layout/mainMenu'
import { startIntroDemo } from '../intro/introDemo'
import type { DomItemRoot } from 'json-dom/dist/domItem/types'

/**
 * The entry function
 * @param parent
 */
const startMenu = (parent: DomItemRoot): DomItemRoot => {
  for (let i = parent.body.children.length - 1; i >= 0; --i) {
    jsonDom.removeChild(parent.body, parent.body.children[i])
  }
  jsonDom.renderHtml(mainMenu(), parent.body)
  // In the browser's page layout (gameRoot: the game in <main>, under the header), robots play behind the menu
  if (typeof document !== 'undefined' && (parent.body.element as Element | undefined)?.matches?.('main.game') && document.querySelector('header.game-header')) {
    startIntroDemo(parent.eventActions)
  }
  return parent
}

export default startMenu
