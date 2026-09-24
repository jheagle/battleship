/**
 * @jest-environment jsdom
 */
import shipTile from './shipTile'

describe('shipTile', () => {
  test('only says what changes: there is a ship here', () => {
    expect(shipTile()).toEqual({ hasShip: true })
  })
})
