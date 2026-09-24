/**
 * @jest-environment jsdom
 */

import { makeBoard } from '../../tests/helpers/game'
import getAllNonHitCells from './getAllNonHitCells'

const at = (board, x, y, z = 0) => board.children[z].children[y].children[x]

describe('getAllNonHitCells', () => {
  test('a fresh 10 x 10 board has 100 cells to attack', () => {
    expect(getAllNonHitCells(makeBoard())).toHaveLength(100)
  })

  test('hit cells are left out', () => {
    const board = makeBoard()
    at(board, 0, 0).isHit = true
    at(board, 9, 9).isHit = true
    const remaining = getAllNonHitCells(board)
    expect(remaining).toHaveLength(98)
    expect(remaining.some(point => point.x === 0 && point.y === 0)).toBe(false)
    expect(remaining.some(point => point.x === 9 && point.y === 9)).toBe(false)
  })
})
