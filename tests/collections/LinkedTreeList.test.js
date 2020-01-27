const LinkedTreeList = require('../../src/js/jDom/collections/LinkedTreeList')

test('LinkedTreeList can store elements', () => {
  const arrayData = ['one', 'two', 'three', 'four']
  const someList = LinkedTreeList.fromArray(arrayData)
  expect(someList.length).toBe(4)
  expect(Array.from(someList)).toEqual(arrayData)
})

test('LinkedTreeList can set the parent item, and parent children match this list', () => {
  const parentData = ['one']
  const parentList = LinkedTreeList.fromArray(parentData)
  const childData = ['two', 'three', 'four', 'five']
  const childList = LinkedTreeList.fromArray(childData)
  childList.parent = parentList.first
  const firstItem = childList.first
  expect(firstItem.data).toBe(childData[0])
  expect(firstItem.parent.data).toBe(parentData[0])
  expect(firstItem.parent.children.first.data).toBe(childData[0])
  expect(firstItem.next.data).toBe(childData[1])
  expect(firstItem.next.parent.data).toBe(parentData[0])
  expect(firstItem.next.parent.children.item(1).data).toBe(childData[1])
  expect(firstItem.next.next.data).toBe(childData[2])
  expect(firstItem.next.next.parent.data).toBe(parentData[0])
  expect(firstItem.next.next.parent.children.item(2).data).toBe(childData[2])
  expect(firstItem.next.next.next.data).toBe(childData[3])
  expect(firstItem.next.next.next.parent.data).toBe(parentData[0])
  expect(firstItem.next.next.next.parent.children.last.data).toBe(childData[3])
})
