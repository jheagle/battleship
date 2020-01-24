const TreeLinker = require('../../src/js/jDom/collections/TreeLinker')

const sampleArrayData = () => ([
  {
    data: 'one',
    children: [
      {
        data: 'four',
        children: [
          {
            data: 'ten',
            children: []
          },
          {
            data: 'eleven',
            children: []
          },
          {
            data: 'twelve',
            children: []
          }
        ]
      }
    ]
  },
  {
    data: 'two',
    children: [
      {
        data: 'five',
        children: []
      },
      {
        data: 'six',
        children: []
      }
    ]
  },
  {
    data: 'three',
    children: [
      {
        data: 'seven',
        children: []
      },
      {
        data: 'eight',
        children: []
      },
      {
        data: 'nine',
        children: []
      }
    ]
  }
])

test('TreeLinker prev and next values contain correct data', () => {
  const arrayData = ['one', 'two', 'three']
  const linkerTail = TreeLinker.fromArray(arrayData, TreeLinker)
  const linkerHead = linkerTail.prev.prev
  expect(linkerHead.data).toBe(arrayData[0])
  expect(linkerHead.next.data).toBe(arrayData[1])
  expect(linkerHead.next.next.data).toBe(arrayData[2])
  expect(linkerHead.next.next.next).toBeNull()
  expect(linkerTail.data).toBe(arrayData[2])
  expect(linkerTail.prev.data).toBe(arrayData[1])
  expect(linkerTail.prev.prev.data).toBe(arrayData[0])
  expect(linkerTail.prev.prev.prev).toBeNull()
})

test('TreeLinker prev and next data set from objects', () => {
  const arrayData = sampleArrayData()
  const linkerTail = TreeLinker.fromArray(arrayData, TreeLinker)
  const linkerHead = linkerTail.prev.prev
  expect(linkerHead.data).toBe(arrayData[0].data)
  expect(linkerHead.next.data).toBe(arrayData[1].data)
  expect(linkerHead.next.next.data).toBe(arrayData[2].data)
  expect(linkerHead.next.next.next).toBeNull()
  expect(linkerTail.data).toBe(arrayData[2].data)
  expect(linkerTail.prev.data).toBe(arrayData[1].data)
  expect(linkerTail.prev.prev.data).toBe(arrayData[0].data)
  expect(linkerTail.prev.prev.prev).toBeNull()
})

test('TreeLinker has children set for each of the Linkers', () => {
  const arrayData = sampleArrayData()
  const linkerTail = TreeLinker.fromArray(arrayData, TreeLinker)
  expect(linkerTail.children.next).toBeNull()
  expect(linkerTail.children.data).toBe(arrayData[2].children[2].data)
  expect(linkerTail.children.parent).toBe(linkerTail)
  expect(linkerTail.children.prev.next).toBe(linkerTail.children)
  expect(linkerTail.children.prev.data).toBe(arrayData[2].children[1].data)
  expect(linkerTail.children.prev.parent).toBe(linkerTail)
  expect(linkerTail.children.prev.prev.next).toBe(linkerTail.children.prev)
  expect(linkerTail.children.prev.prev.data).toBe(arrayData[2].children[0].data)
  expect(linkerTail.children.prev.prev.parent).toBe(linkerTail)
  expect(linkerTail.children.prev.prev.prev).toBeNull()

  expect(linkerTail.prev.children.next).toBeNull()
  expect(linkerTail.prev.children.data).toBe(arrayData[1].children[1].data)
  expect(linkerTail.prev.children.parent).toBe(linkerTail.prev)
  expect(linkerTail.prev.children.prev.next).toBe(linkerTail.prev.children)
  expect(linkerTail.prev.children.prev.data).toBe(arrayData[1].children[0].data)
  expect(linkerTail.prev.children.prev.parent).toBe(linkerTail.prev)
  expect(linkerTail.prev.children.prev.prev).toBeNull()

  expect(linkerTail.prev.prev.children.next).toBeNull()
  expect(linkerTail.prev.prev.children.data).toBe(arrayData[0].children[0].data)
  expect(linkerTail.prev.prev.children.parent).toBe(linkerTail.prev.prev)
  expect(linkerTail.prev.prev.children.prev).toBeNull()
})

test('TreeLinker children can have children', () => {
  const arrayData = sampleArrayData()
  const linkerTail = TreeLinker.fromArray(arrayData, TreeLinker)
  const linkerHead = linkerTail.prev.prev
  expect(linkerHead.children.next).toBeNull()
  expect(linkerHead.children.data).toBe(arrayData[0].children[0].data)
  expect(linkerHead.children.parent).toBe(linkerHead)
  expect(linkerHead.children.parent.children).toBe(linkerHead.children)
  expect(linkerHead.children.children.next).toBeNull()
  expect(linkerHead.children.children.data).toBe(arrayData[0].children[0].children[2].data)
  expect(linkerHead.children.children.parent).toBe(linkerHead.children)
  expect(linkerHead.children.children.parent.children).toBe(linkerHead.children.children)
  expect(linkerHead.children.children.prev.next).toBe(linkerHead.children.children)
  expect(linkerHead.children.children.prev.data).toBe(arrayData[0].children[0].children[1].data)
  expect(linkerHead.children.children.prev.parent).toBe(linkerHead.children)
  expect(linkerHead.children.children.prev.parent.children).toBe(linkerHead.children.children)
  expect(linkerHead.children.children.prev.prev.next).toBe(linkerHead.children.children.prev)
  expect(linkerHead.children.children.prev.prev.data).toBe(arrayData[0].children[0].children[0].data)
  expect(linkerHead.children.children.prev.prev.parent).toBe(linkerHead.children)
  expect(linkerHead.children.children.prev.prev.parent.children).toBe(linkerHead.children.children)
  expect(linkerHead.children.children.prev.prev.prev).toBeNull()
  expect(linkerHead.children.prev).toBeNull()
})

test('TreeLinker children can be added from array', () => {
  const arrayData = ['one', 'two', 'three']
  const linkerTail = TreeLinker.fromArray(arrayData, TreeLinker)
  const arrayChildData = sampleArrayData()
  const linkerHead = linkerTail.prev.prev
  linkerHead.children = linkerHead.childrenFromArray(arrayChildData[0].children)
  linkerHead.next.children = linkerHead.next.childrenFromArray(arrayChildData[1].children)
  linkerHead.next.next.children = linkerHead.next.next.childrenFromArray(arrayChildData[2].children)

  expect(linkerHead.children.next).toBeNull()
  expect(linkerHead.children.data).toBe(arrayChildData[0].children[0].data)
  expect(linkerHead.children.parent).toBe(linkerHead)
  expect(linkerHead.children.prev).toBeNull()

  expect(linkerHead.next.children.next).toBeNull()
  expect(linkerHead.next.children.data).toBe(arrayChildData[1].children[1].data)
  expect(linkerHead.next.children.parent).toBe(linkerHead.next)
  expect(linkerHead.next.children.prev.next).toBe(linkerHead.next.children)
  expect(linkerHead.next.children.prev.data).toBe(arrayChildData[1].children[0].data)
  expect(linkerHead.next.children.prev.parent).toBe(linkerHead.next)
  expect(linkerHead.next.children.prev.prev).toBeNull()

  expect(linkerHead.next.next.children.next).toBeNull()
  expect(linkerHead.next.next.children.data).toBe(arrayChildData[2].children[2].data)
  expect(linkerHead.next.next.children.parent).toBe(linkerHead.next.next)
  expect(linkerHead.next.next.children.prev.next).toBe(linkerHead.next.next.children)
  expect(linkerHead.next.next.children.prev.data).toBe(arrayChildData[2].children[1].data)
  expect(linkerHead.next.next.children.prev.parent).toBe(linkerHead.next.next)
  expect(linkerHead.next.next.children.prev.prev.next).toBe(linkerHead.next.next.children.prev)
  expect(linkerHead.next.next.children.prev.prev.data).toBe(arrayChildData[2].children[0].data)
  expect(linkerHead.next.next.children.prev.prev.parent).toBe(linkerHead.next.next)
  expect(linkerHead.next.next.children.prev.prev.prev).toBeNull()
})
