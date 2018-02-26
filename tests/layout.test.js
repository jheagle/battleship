const jDomCoreDom = require('../src/js/core-dom.js')
const jDomLayout = require('../src/js/layout.js')

// boards
// finalScore
// mainMenu
it('successfully rendered with parent of body', () => {
  expect(jDomCoreDom.renderHTML(jDomLayout.mainMenu()).parentItem.tagName).toBe('body')
})

// noConflict
