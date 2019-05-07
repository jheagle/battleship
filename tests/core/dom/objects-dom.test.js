const jDomObjects = require('../../../src/js/jDom/core/dom/objects.js')

// documentItem
it('documentItem has valid head', () => {
  expect(jDomObjects.documentItem.children[0].tagName).toBe('head')
})

it('documentItem has valid body', () => {
  expect(jDomObjects.documentItem.children[1].tagName).toBe('body')
})

// DOMItem
// documentDOMItem
// noConflict