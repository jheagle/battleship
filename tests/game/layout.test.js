const jDomCore = require('json-dom').jDomCore
const jDomLayout = require('../../src/js/layout.js')

// boards
// finalScore
// mainMenu
test('successfully rendered with parent of body', () => {
  expect(jDomCore.renderHTML(jDomLayout.mainMenu()).parentItem.tagName).toBe('body')
})

// noConflict
