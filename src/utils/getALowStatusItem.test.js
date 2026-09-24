/**
 * @jest-environment jsdom
 */
import getALowStatusItem from './getALowStatusItem'

const items = [{ name: 'a', status: 100 }, { name: 'b', status: 40 }, { name: 'c', status: 40 }, { name: 'd', status: 0 }]

describe('getALowStatusItem', () => {
  test('gives the lowest, and the last one when there is a tie', () => {
    expect(getALowStatusItem([items[0], items[1]]).name).toBe('b')
    expect(getALowStatusItem([items[1], items[2]]).name).toBe('c')
    expect(getALowStatusItem(items).name).toBe('d')
  })
})
