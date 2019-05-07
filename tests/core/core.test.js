const jDomCore = require('../../src/js/jDom/core/core.js')

// noConflict
// curry
// pipe
// setValue
// setAndReturnValue
// mapObject
// mapProperty
// filterObject
// reduceObject
// notEmptyObjectOrArray
// cloneObject
// mergeObjects
// mergeObjectsMutable
// buildArray
// buildArrayOfReferences
// inArray
it('inArray returns true', () => {
  expect(jDomCore.inArray([1, 2, 3, 4, 5], 4)).toBe(true)
})
// getAbsoluteMax
// getAbsoluteMin
// randomNumber
// randomInteger
// compare
// compareArrays
// trace
// queueTimeout