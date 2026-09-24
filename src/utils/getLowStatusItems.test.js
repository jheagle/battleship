/**
 * @jest-environment jsdom
 */
import getLowStatusItems from './getLowStatusItems'

const items = [{ name: 'a', status: 100 }, { name: 'b', status: 40 }, { name: 'c', status: 40 }, { name: 'd', status: 0 }]

describe('getLowStatusItems', () => {
  test('gives every item tied for the lowest', () => {
    expect(getLowStatusItems(items.slice(0, 3)).map(item => item.name)).toEqual(['b', 'c'])
    expect(getLowStatusItems(items).map(item => item.name)).toEqual(['d'])
    expect(getLowStatusItems([items[0]]).map(item => item.name)).toEqual(['a'])
  })
})
