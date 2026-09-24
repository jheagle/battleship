/**
 * @jest-environment jsdom
 */

import numDamagedParts from './numDamagedParts'

describe('numDamagedParts', () => {
  test.each([
    [5, 100, 0],
    [5, 80, 1],
    [5, 60, 2],
    [5, 20, 4],
    [5, 0, 5],
    [4, 75, 1],
    [3, 100 * 2 / 3, 1],
    [3, 100 / 3, 2],
    [2, 50, 1]
  ])('a ship of %i parts at %d%% has %i damaged', (total, status, damaged) => {
    expect(numDamagedParts(total, status)).toBe(damaged)
  })
})
