/**
 * @jest-environment jsdom
 */
import getBrokenItems from './getBrokenItems'

const items = [{ name: 'a', status: 100 }, { name: 'b', status: 40 }, { name: 'c', status: 40 }, { name: 'd', status: 0 }]

describe('getBrokenItems', () => {
  test('keeps only items which are damaged but not sunk', () => {
    expect(getBrokenItems(items).map(item => item.name)).toEqual(['b', 'c'])
    expect(getBrokenItems([items[0], items[3]])).toEqual([])
  })
})
