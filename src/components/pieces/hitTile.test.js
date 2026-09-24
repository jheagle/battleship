/**
 * @jest-environment jsdom
 */
import hitTile from './hitTile'

describe('hitTile', () => {
  test('only says what changes: the tile has been hit', () => {
    expect(hitTile()).toEqual({ isHit: true })
  })
})
