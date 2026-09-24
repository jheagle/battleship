import gameActions from './functions/actions.js'
import gameStart from './functions/setup.js'
import jsonDom from 'json-dom'
import { isNode } from 'browser-or-node'

const battleship = () => {
  /**
   * Create new private reference to the document
   * @typedef {module:jDom/core/dom/objects.documentItem} documentItem
   */
  const documentItem = gameStart.main(jsonDom.documentDomItem({
    beginRound: gameStart.beginRound,
    attackListener: gameActions.attackListener,
    restart: gameStart.restart
  }))

  // Trigger game to start if running as a Node module. This used to check
  // `!(document instanceof HTMLDocument)`, but pseudo-dom's installGlobal (which must already have run - see below -
  // for `document` to exist here at all) now correctly makes its document satisfy `instanceof HTMLDocument`, since
  // that is the whole point: code should not be able to tell a real document from pseudo-dom's. isNode checks the
  // runtime itself instead, which still works regardless of how close pseudo-dom's document gets to a real one.
  if (isNode) {
    const form = jsonDom.getChildrenByClass('main-menu-form', documentItem.body)[0]
    const submitBtn = jsonDom.getChildrenFromAttribute('type', 'submit', form)
    submitBtn[0].element.click()
  }
}

export default battleship

if (this) {
  // @ts-ignore
  this.battleship = battleship
} else if (typeof window !== 'undefined') {
  // @ts-ignore
  window.battleship = battleship
}
