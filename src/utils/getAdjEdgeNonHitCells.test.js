/**
 * @jest-environment jsdom
 */

import { makeBoard } from '../../tests/helpers/game'
import getAdjEdgeNonHitCells from './getAdjEdgeNonHitCells'

const at = (board, x, y, z = 0) => board.children[z].children[y].children[x]

const pnt = (x, y, z = 0) => ({ x, y, z })

describe('getAdjEdgeNonHitCells', () => {
  const sorted = points => points.map(point => `${point.x},${point.y}`).sort()

  test('a cell in the middle has the four cells it shares an edge with', () => {
    const adjacent = getAdjEdgeNonHitCells(pnt(5, 5), makeBoard())
    expect(sorted(adjacent)).toEqual(['4,5', '5,4', '5,6', '6,5'])
  })

  test('a corner only has two, and diagonals never count', () => {
    const adjacent = getAdjEdgeNonHitCells(pnt(0, 0), makeBoard())
    expect(sorted(adjacent)).toEqual(['0,1', '1,0'])
  })

  test('cells which are already hit are left out', () => {
    const board = makeBoard()
    at(board, 5, 4).isHit = true
    at(board, 6, 5).isHit = true
    expect(sorted(getAdjEdgeNonHitCells(pnt(5, 5), board))).toEqual(['4,5', '5,6'])
  })
})
