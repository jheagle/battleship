/**
 * @jest-environment jsdom
 */
import jsonDom from 'json-dom'
import jDomLayout from './layout.js'

// boards
// finalScore
// mainMenu
test('successfully rendered with parent of body', () => {
  expect(jsonDom.renderHtml(jDomLayout.mainMenu()).parentItem.tagName).toBe('body')
})

// noConflict
