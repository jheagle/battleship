import jsonDom from 'json-dom'
import mainMenu from '../components/layout/mainMenu'
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
  return parent
}

export default startMenu
