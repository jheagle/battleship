const jDomCoreDom = require('../src/js/jDom/core/domItems/core.js')
const jDomLayout = require('../src/js/jDom/layouts/battleship.js')

// boards
// finalScore
// mainMenu
it('successfully rendered with parent of body', () => {
  expect(jDomCoreDom.renderHTML(jDomLayout.mainMenu()).parentItem.tagName).toBe('body')
})

// noConflict
