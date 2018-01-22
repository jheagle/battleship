const jDomCoreDom = require('../src/js/core-dom.js')
const jDomLayout = require('../src/js/layout.js')

test('successfully rendered with parent of body', () => {
  expect(jDomCoreDom.renderHTML(jDomLayout.mainMenu()).parentItem.tagName).toBe('body')
})