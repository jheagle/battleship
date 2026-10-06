/**
 * @jest-environment jsdom
 */

import jDomMatrix from 'matrix-dom'
import { useGameLifecycle, makeBoard } from '../../tests/helpers/game'
import { isValidPlacement, placeShip } from './placeShip'

useGameLifecycle()

describe('placing a ship by hand', () => {
  const at = (x, y) => jDomMatrix.point(x, y, 0)
  const carrier = { name: 'Aircraft Carrier', size: 5 }

  test('a straight horizontal or vertical line of the right length is valid', () => {
    const board = makeBoard()
    expect(isValidPlacement(board, at(0, 0), at(4, 0), 5)).toBe(true)
    expect(isValidPlacement(board, at(3, 2), at(3, 6), 5)).toBe(true)
  })

  test('a diagonal, a line of the wrong length, or one off the board is not valid', () => {
    const board = makeBoard()
    expect(isValidPlacement(board, at(0, 0), at(4, 4), 5)).toBe(false)
    expect(isValidPlacement(board, at(0, 0), at(3, 0), 5)).toBe(false)
    expect(isValidPlacement(board, at(0, 0), at(5, 0), 5)).toBe(false)
    expect(isValidPlacement(board, at(8, 0), at(12, 0), 5)).toBe(false)
  })

  test('a ship cannot touch one already on the board', () => {
    const board = makeBoard()
    board.children[0].children[0].children[2].hasShip = true
    expect(isValidPlacement(board, at(0, 0), at(4, 0), 5)).toBe(false)
    expect(isValidPlacement(board, at(0, 1), at(4, 1), 5)).toBe(true)
  })

  test('a valid placement puts the ship on the board, and an invalid one returns false', () => {
    const board = makeBoard()
    const ship = placeShip(board, carrier, at(0, 0), at(4, 0))
    expect(ship.parts).toHaveLength(5)
    expect(board.children[0].children[0].children.slice(0, 5).every(tile => tile.hasShip)).toBe(true)
    expect(placeShip(board, carrier, at(0, 0), at(4, 4))).toBe(false)
  })
})
