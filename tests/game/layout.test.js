/**
 * @jest-environment jsdom
 */
import jDomCore from 'json-dom'
import jDomLayout from '../../src/js/layout.js'

// boards
// finalScore
// mainMenu
test('successfully rendered with parent of body', () => {
  expect(jDomCore.renderHTML(jDomLayout.mainMenu()).parentItem.tagName).toBe('body')
})

// noConflict
