const jDomObjects = require('../src/js/objects-dom.js')

test('documentItem has valid head', () => {
  expect(jDomObjects.documentItem.children[0]).toBe(jDomObjects.documentItem.head)
})

test('documentItem has valid body', () => {
  expect(jDomObjects.documentItem.children[1]).toBe(jDomObjects.documentItem.body)
})