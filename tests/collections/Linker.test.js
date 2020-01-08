const Linker = require('../../src/js/jDom/collections/Linker')

test('Linker can store data and pointer to next and previous linkers', () => {
  const arrayData = ['one', 'two', 'three']
  const linkerHead = new Linker({data: arrayData[0]})
  linkerHead.next = new Linker({data: arrayData[1], prev: linkerHead})
  const linkerTail = linkerHead.next.next = new Linker({data: arrayData[2], prev: linkerHead.next})
  expect(linkerHead.data).toBe(arrayData[0])
  expect(linkerHead.next.data).toBe(arrayData[1])
  expect(linkerHead.next.next.data).toBe(arrayData[2])
  expect(linkerHead.next.next.next).toBeNull()
  expect(linkerTail.data).toBe(arrayData[2])
  expect(linkerTail.prev.data).toBe(arrayData[1])
  expect(linkerTail.prev.prev.data).toBe(arrayData[0])
  expect(linkerTail.prev.prev.prev).toBeNull()
})

test('Linkers can be generated from an array', () => {
  const arrayData = ['one', 'two', 'three', 'four']
  const linkerTail = Linker.fromArray(arrayData)
  const linkerHead = linkerTail.prev.prev.prev
  expect(linkerHead.data).toBe(arrayData[0])
  expect(linkerHead.next.data).toBe(arrayData[1])
  expect(linkerHead.next.next.data).toBe(arrayData[2])
  expect(linkerHead.next.next.next.data).toBe(arrayData[3])
  expect(linkerHead.next.next.next.next).toBeNull()
  expect(linkerTail.data).toBe(arrayData[3])
  expect(linkerTail.prev.data).toBe(arrayData[2])
  expect(linkerTail.prev.prev.data).toBe(arrayData[1])
  expect(linkerTail.prev.prev.prev.data).toBe(arrayData[0])
  expect(linkerTail.prev.prev.prev.prev).toBeNull()
})

test('Linkers can assign next with after helper', () => {
  const arrayData = ['one', 'two', 'three']
  const linkerHead = new Linker({data: arrayData[0]})
  const linkerTail = linkerHead.after(arrayData[2])
  const linkerMiddle = linkerHead.after(new Linker({data: arrayData[1]}))
  expect(linkerHead.data).toBe(arrayData[0])
  expect(linkerHead.prev).toBeNull()
  expect(linkerHead.next).toBe(linkerMiddle)
  expect(linkerMiddle.data).toBe(arrayData[1])
  expect(linkerMiddle.prev).toBe(linkerHead)
  expect(linkerMiddle.next).toBe(linkerTail)
  expect(linkerTail.data).toBe(arrayData[2])
  expect(linkerTail.prev).toBe(linkerMiddle)
  expect(linkerTail.next).toBeNull()
})

test('Linkers can assign prev with before helper', () => {
  const arrayData = ['one', 'two', 'three']
  const linkerTail = new Linker({data: arrayData[2]})
  const linkerHead = linkerTail.before(arrayData[0])
  const linkerMiddle = linkerTail.before(new Linker({data: arrayData[1]}))
  expect(linkerTail.data).toBe(arrayData[2])
  expect(linkerTail.prev).toBe(linkerMiddle)
  expect(linkerTail.next).toBeNull()
  expect(linkerMiddle.data).toBe(arrayData[1])
  expect(linkerMiddle.prev).toBe(linkerHead)
  expect(linkerMiddle.next).toBe(linkerTail)
  expect(linkerHead.data).toBe(arrayData[0])
  expect(linkerHead.prev).toBeNull()
  expect(linkerHead.next).toBe(linkerMiddle)
})