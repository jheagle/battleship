const jDomCore = require('../src/js/core.js')

// buildArray
// buildArrayOfReferences
// cloneObject
// compare
// compareArrays
// curry
// filterObject
// getMax
it('2 is greater than 1', () => {
  expect(jDomCore.getMax(1, 2)).toBe(2)
})

// getMaxOrMin
// getMin
it('1 is less than 2', () => {
  expect(jDomCore.getMin(1, 2)).toBe(1)
})

// inArray
// mapObject
// mergeObjects
// mergeObjectsMutable
// notEmptyObjectOrArray
// pipe
// queueTimeout
// randomInteger
// randomNumber
// reduceObject
// trace