/**
 * @jest-environment jsdom
 */

import ship from './ship'

describe('ship', () => {
  test('starts undamaged with no parts', () => {
    expect(ship('Cruiser')).toEqual({ name: 'Cruiser', status: 100, parts: [] })
  })

  test('has an empty name unless given one', () => {
    expect(ship().name).toBe('')
  })
})
