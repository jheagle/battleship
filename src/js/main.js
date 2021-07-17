'use strict'

/**
 * Create new private reference to the document
 * @typedef {module:jDom/core/dom/objects.documentItem} documentItem
 */
const documentItem = gameStart.main(jsonDom.documentDomItem({
  beginRound: gameStart.beginRound,
  attackListener: gameActions.attackListener,
  restart: gameStart.restart
}))
console.log('Document Item: ', documentItem)

// eslint-disable-next-line no-undef
if (typeof document === 'undefined' || !(document instanceof HTMLDocument)) {
  // Trigger game to start if running as node module
  const form = jsonDom.getChildrenByClass('main-menu-form', documentItem.body)[0]
  const submitBtn = jsonDom.getChildrenFromAttribute('type', 'submit', form)
  submitBtn[0].element.click()
}
