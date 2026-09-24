/**
 * @jest-environment jsdom
 */

import filterAdjacentPoints from './filterAdjacentPoints'

const pnt = (x, y, z = 0) => ({ x, y, z })

describe('filterAdjacentPoints (the checkerboard the computer searches with)', () => {
  const board = []
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      board.push(pnt(x, y))
    }
  }
  const chosen = board.filter(filterAdjacentPoints)
  const isChosen = (x, y) => filterAdjacentPoints(pnt(x, y))

  test('picks exactly half of the cells', () => {
    expect(chosen).toHaveLength(50)
  })

  test('never picks two cells which share an edge, so every ship (2 or more long) is still found', () => {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        if (isChosen(x, y)) {
          expect(isChosen(x + 1, y)).toBe(false)
          expect(isChosen(x, y + 1)).toBe(false)
        }
      }
    }
  })

  test('every horizontal or vertical run of 2 cells contains a chosen cell', () => {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        expect(isChosen(x, y) || isChosen(x + 1, y)).toBe(true)
        expect(isChosen(y, x) || isChosen(y, x + 1)).toBe(true)
      }
    }
  })
})

describe('filterAdjacentPoints on a second layer', () => {
  test('the checkerboard flips on every other layer, so cells above each other are never both chosen', () => {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        expect(filterAdjacentPoints(pnt(x, y, 0))).not.toBe(filterAdjacentPoints(pnt(x, y, 1)))
      }
    }
    expect(filterAdjacentPoints(pnt(1, 0, 1))).toBe(true)
    expect(filterAdjacentPoints(pnt(0, 0, 1))).toBe(false)
  })
})
