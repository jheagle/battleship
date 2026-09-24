import jsonDom from 'json-dom'
import mainMenu from '../components/layout/mainMenu'

/**
 * The entry function
 * @function startMenu
 * @param parent
 * @returns {module:jDom/core/dom/objects.documentItem}
 */
const startMenu = (parent) => {
  for (let i = parent.body.children.length - 1; i >= 0; --i) {
    jsonDom.removeChild(parent.body, parent.body.children[i])
  }
  jsonDom.renderHtml(mainMenu(), parent.body)
  return parent
}

export default startMenu
