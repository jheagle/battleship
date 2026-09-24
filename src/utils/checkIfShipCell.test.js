/**
 * @jest-environment jsdom
 */
import checkIfShipCell from './checkIfShipCell'
import { makeBoard } from '../../tests/helpers/game'

const at = (board, x, y, z = 0) => board.children[z].children[y].children[x]
const pnt = (x, y, z = 0) => ({ x, y, z })

describe('checkIfShipCell', () => {
  test('a fresh board has no ships', () => {
    expect(checkIfShipCell(pnt(3, 4), makeBoard())).toBe(false)
  })

  test('reads the tile at that point', () => {
    const board = makeBoard()
    at(board, 3, 4).hasShip = true
    expect(checkIfShipCell(pnt(3, 4), board)).toBe(true)
    expect(checkIfShipCell(pnt(4, 3), board)).toBe(false)
  })

  test('a point off the board is not a ship cell', () => {
    const board = makeBoard()
    ;[pnt(10, 0), pnt(0, 10), pnt(-1, 0), pnt(0, -1), pnt(0, 0, 1), pnt(0, 0, -1)].forEach(point => {
      expect(checkIfShipCell(point, board)).toBe(false)
    })
  })
})
