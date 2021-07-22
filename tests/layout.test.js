/**
 * @jest-environment jsdom
 */
import jsonDom from 'json-dom'
const jDomLayout = require('../src/js/layout.js')

// boards
// finalScore
// mainMenu
test('successfully rendered with parent of body', () => {
  expect(jsonDom.renderHTML(jDomLayout.mainMenu()).parentItem.tagName).toBe('body')
})

// noConflict
