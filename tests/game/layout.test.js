const jDomCoreDom = require('../../src/js/jDom/core/dom/core.js')
const jDomLayout = require('../../src/js/game/layout.js')

// boards
// finalScore
// mainMenu
it('successfully rendered with parent of body', () => {
  expect(jDomCoreDom.renderHTML(jDomLayout.mainMenu()).parentItem.tagName).toBe('body')
})

// noConflict