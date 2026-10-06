/**
 * @jest-environment jsdom
 */

import { useGameLifecycle, makeBoard } from '../../tests/helpers/game'
import defaultFleet from './defaultFleet'

useGameLifecycle()

describe('defaultFleet', () => {
  test('always fits the standard fleet on the board, with no ship overlapping another', () => {
    for (let i = 0; i < 300; i++) {
      const board = makeBoard()
      const fleet = defaultFleet(board)
      expect(fleet.map(ship => ship.parts.length)).toEqual([5, 4, 3, 3, 2])
      const cells = fleet.flatMap(ship => ship.parts.map(part => `${part.point.x},${part.point.y}`))
      expect(new Set(cells).size).toBe(cells.length)
    }
  })
})
