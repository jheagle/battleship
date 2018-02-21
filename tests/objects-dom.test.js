const jDomObjects = require('../src/js/objects-dom.js')

it('documentItem has valid head', () => {
  expect(jDomObjects.documentItem.children[0]).toBe(jDomObjects.documentItem.head)
})

it('documentItem has valid body', () => {
  expect(jDomObjects.documentItem.children[1]).toBe(jDomObjects.documentItem.body)
})