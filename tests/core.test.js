const jDomCore = require('../src/js/core.js')

test('2 is greater than 1', () => {
  expect(jDomCore.getMax(1, 2)).toBe(2);
})

test('1 is less than 2', () => {
  expect(jDomCore.getMin(1, 2)).toBe(1);
})