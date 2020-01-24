const LinkedTreeList = require('../../src/js/jDom/collections/LinkedTreeList')

test('LinkedTreeList can store elements', () => {
  const arrayData = ['one', 'two', 'three', 'four']
  const someList = LinkedTreeList.fromArray(arrayData)
  expect(someList.length).toBe(4)
  expect(Array.from(someList)).toEqual(arrayData)
})
