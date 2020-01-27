const LinkedList = require('../../src/js/jDom/collections/LinkedList')

test('LinkedList can store elements', () => {
  const arrayData = ['one', 'two', 'three', 'four']
  const someList = LinkedList.fromArray(arrayData)
  expect(someList.length).toBe(4)
  expect(Array.from(someList)).toEqual(arrayData)
})

test('LinkedList first contains the head value', () => {
  const arrayData = ['one', 'two', 'three', 'four']
  const someList = LinkedList.fromArray(arrayData)
  expect(someList.first.data).toBe(arrayData[0])
})

test('LinkedList last contains the tail value', () => {
  const arrayData = ['one', 'two', 'three', 'four']
  const someList = LinkedList.fromArray(arrayData)
  expect(someList.last.data).toBe(arrayData[3])
})

test('LinkedList can iterate with for-of loop', () => {
  const arrayData = ['one', 'two', 'three', 'four']
  const someList = LinkedList.fromArray(arrayData)
  let count = -1
  for (const item of someList) {
    expect(item).toBe(arrayData[++count])
  }
  expect(count).toBe(3)
})

test('LinkedList can iterate with forEach loop', () => {
  const arrayData = ['one', 'two', 'three', 'four']
  const someList = LinkedList.fromArray(arrayData)
  let count = -1
  someList.forEach(item => {
    expect(item).toBe(arrayData[++count])
  })
  expect(count).toBe(3)
})

test('LinkedList can fetch an element by positive index from start', () => {
  const arrayData = ['one', 'two', 'three', 'four']
  const someList = LinkedList.fromArray(arrayData)
  expect(someList.item(0).data).toBe(arrayData[0])
  expect(someList.item(1).data).toBe(arrayData[1])
  expect(someList.item(2).data).toBe(arrayData[2])
  expect(someList.item(3).data).toBe(arrayData[3])
  expect(someList.item(4)).toBeNull()
})

test('LinkedList can fetch an element by negative index from end', () => {
  const arrayData = ['one', 'two', 'three', 'four']
  const someList = LinkedList.fromArray(arrayData)
  expect(someList.item(-1).data).toBe(arrayData[3])
  expect(someList.item(-2).data).toBe(arrayData[2])
  expect(someList.item(-3).data).toBe(arrayData[1])
  expect(someList.item(-4).data).toBe(arrayData[0])
  expect(someList.item(-5)).toBeNull()
})

test('LinkedList can prepend to the array', () => {
  const someList = LinkedList.fromArray(['one', 'two', 'three', 'four'])
  const LinkerClass = someList.LinkerClass
  const newNode = new LinkerClass({ data: 'zero' })
  let head = someList.prepend(newNode)
  expect(someList.length).toBe(5)
  expect(someList.first.data).toBe('zero')
  expect(head.data).toBe('zero')
  head = someList.prepend('negative one')
  expect(someList.length).toBe(6)
  expect(someList.first.data).toBe('negative one')
  expect(head.data).toBe('negative one')
})

test('LinkedList can append to the array', () => {
  const someList = LinkedList.fromArray(['one', 'two', 'three', 'four'])
  const LinkerClass = someList.LinkerClass
  const newNode = new LinkerClass({ data: 'five' })
  let head = someList.append(newNode)
  expect(someList.length).toBe(5)
  expect(someList.last.data).toBe('five')
  expect(head.data).toBe('one')
  head = someList.append('six')
  expect(someList.length).toBe(6)
  expect(someList.last.data).toBe('six')
  expect(head.data).toBe('one')
})
