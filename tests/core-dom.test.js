const jDomCoreDom = require('../src/js/core-dom.js')

const coolFunc = () => 'hello'

test('can register a listener', () => {
  expect(jDomCoreDom.registerListener(coolFunc).coolFunc).toBe(coolFunc)
})