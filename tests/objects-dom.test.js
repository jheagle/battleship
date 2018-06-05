const jDomObjects = require('../src/js/jDom/core/dom/objects.js')

// documentItem
it('documentItem has valid head', () => {
  expect(jDomObjects.documentItem.children[0]).toBe(jDomObjects.documentItem.head)
})

it('documentItem has valid body', () => {
  expect(jDomObjects.documentItem.children[1]).toBe(jDomObjects.documentItem.body)
})

// DOMItem
// documentDOMItem
// noConflict