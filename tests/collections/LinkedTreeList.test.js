const LinkedTreeList = require('../../src/js/jDom/collections/LinkedTreeList')

test('LinkedTreeList can store elements', () => {
  const arrayData = ['one', 'two', 'three', 'four']
  const someList = LinkedTreeList.fromArray(arrayData)
  expect(someList.length).toBe(4)
  expect(Array.from(someList).map(item => item.data)).toEqual(arrayData)
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

test('LinkedTreeList can set the children for a specified item', () => {
  const parentData = ['one']
  const parentList = LinkedTreeList.fromArray(parentData)
  const childData = ['two', 'three', 'four', 'five']
  parentList.setChildren(parentList.first, LinkedTreeList.fromArray(childData))
  const firstItemChildren = parentList.first.children
  const firstChildItem = firstItemChildren.first
  expect(firstChildItem.data).toBe(childData[0])
  expect(firstChildItem.parent.data).toBe(parentData[0])
  expect(firstChildItem.parent.children.first.data).toBe(childData[0])
  expect(firstChildItem.next.data).toBe(childData[1])
  expect(firstChildItem.next.parent.data).toBe(parentData[0])
  expect(firstChildItem.next.parent.children.item(1).data).toBe(childData[1])
  expect(firstChildItem.next.next.data).toBe(childData[2])
  expect(firstChildItem.next.next.parent.data).toBe(parentData[0])
  expect(firstChildItem.next.next.parent.children.item(2).data).toBe(childData[2])
  expect(firstChildItem.next.next.next.data).toBe(childData[3])
  expect(firstChildItem.next.next.next.parent.data).toBe(parentData[0])
  expect(firstChildItem.next.next.next.parent.children.last.data).toBe(childData[3])
})
