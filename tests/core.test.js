const jDomCore = require('../src/js/core.js')

it('2 is greater than 1', () => {
  expect(jDomCore.getMax(1, 2)).toBe(2);
})

it('1 is less than 2', () => {
  expect(jDomCore.getMin(1, 2)).toBe(1);
})