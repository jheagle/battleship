const PseudoEventTarget = require('../../../src/js/jDom/pseudoDom/class/PseudoEventTarget')

let testEventTarget = new PseudoEventTarget()

test('event target has listeners', () => {
  expect(testEventTarget.listeners).toStrictEqual([])
})