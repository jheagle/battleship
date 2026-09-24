/**
 * @jest-environment jsdom
 */
import waterTile from './waterTile'

describe('waterTile', () => {
  test('a water tile has no ship and has not been hit', () => {
    const tile = waterTile()
    expect(tile.hasShip).toBe(false)
    expect(tile.isHit).toBe(false)
  })

  test('each water tile is its own object', () => {
    const [first, second] = [waterTile(), waterTile()]
    expect(first).not.toBe(second)
    first.hasShip = true
    expect(second.hasShip).toBe(false)
  })
})
