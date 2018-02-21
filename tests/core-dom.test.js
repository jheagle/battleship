const jDomCoreDom = require('../src/js/core-dom.js')

const coolFunc = () => 'hello'

it('can register a listener', () => {
  expect(jDomCoreDom.registerListener(coolFunc).coolFunc).toBe(coolFunc)
})