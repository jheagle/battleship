/**
 * @jest-environment jsdom
 */
import checkIfHitCell from './checkIfHitCell'
import { makeBoard } from '../../tests/helpers/game'

const at = (board, x, y, z = 0) => board.children[z].children[y].children[x]
const pnt = (x, y, z = 0) => ({ x, y, z })

describe('checkIfHitCell', () => {
  test('a fresh board has nothing hit', () => {
    expect(checkIfHitCell(pnt(3, 4), makeBoard())).toBeFalsy()
  })

  test('reads the tile at that point', () => {
    const board = makeBoard()
    at(board, 5, 6).isHit = true
    expect(checkIfHitCell(pnt(5, 6), board)).toBe(true)
    expect(checkIfHitCell(pnt(6, 5), board)).toBeFalsy()
  })
})
