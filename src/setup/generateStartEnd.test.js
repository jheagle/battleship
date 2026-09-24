/**
 * @jest-environment jsdom
 */

import jDomMatrix from 'matrix-dom'
import { useGameLifecycle, makeBoard } from '../../tests/helpers/game'
import generateStartEnd from './generateStartEnd'

useGameLifecycle()

describe('setup: generateStartEnd', () => {
  test('able to get a start and end point for ship length 7', () => {
    const shipLength = 7
    const matrix = jDomMatrix.buildMatrix(jDomMatrix.point(10, 10, 1))
    const [start, end] = generateStartEnd(matrix, shipLength)
    const startEndDiff = jDomMatrix.pointDifference(start, end)
    // The diff indicates that the correct start and end were found, diff will be one less than length (ex: 0-6 would be 7 points)
    expect(jDomMatrix.getHighestAbsoluteCoordinate(startEndDiff)).toEqual(shipLength - 1)
  })

  test.each([2, 3, 4, 5])('a ship of length %i is always a straight, horizontal or vertical line inside the board', length => {
    const board = makeBoard()
    for (let i = 0; i < 100; i++) {
      const [start, end] = generateStartEnd(board, length)
      const diff = jDomMatrix.pointDifference(start, end)
      expect(diff.z).toBe(0)
      expect([Math.abs(diff.x), Math.abs(diff.y)].sort()).toEqual([0, length - 1])
      ;[start, end].forEach(point => {
        expect(point.x).toBeGreaterThanOrEqual(0)
        expect(point.x).toBeLessThanOrEqual(9)
        expect(point.y).toBeGreaterThanOrEqual(0)
        expect(point.y).toBeLessThanOrEqual(9)
        expect(point.z).toBe(0)
      })
    }
  })

  test('never overlaps a ship which is already on the board', () => {
    const board = makeBoard()
    // A wall of ships across the middle rows leaves only the outer rows and columns free for a long ship
    for (let x = 0; x < 10; x++) {
      board.children[0].children[4].children[x].hasShip = true
    }
    for (let i = 0; i < 100; i++) {
      const [start, end] = generateStartEnd(board, 5)
      const points = jDomMatrix.getLinePoints(start, end)
      expect(points).toHaveLength(5)
      points.forEach(point => expect(board.children[0].children[point.y].children[point.x].hasShip).toBe(false))
    }
  })
})
