/**
 * @jest-environment jsdom
 */
import jDomMatrix from 'matrix-dom'
import gameStart from './setup.js'

// Some better tests need to be added, and probably this file can be formatted or split better.
// Just needed to get this generateStartEnd working for now to unblock progress.
describe('setup: generateStartEnd', () => {
  test('able to get a start and end point for ship length 7', () => {
    const shipLength = 7
    const matrix = jDomMatrix.buildMatrix(jDomMatrix.point(10, 10, 1))
    const [start, end] = gameStart.generateStartEnd(matrix, shipLength)
    const startEndDiff = jDomMatrix.pointDifference(start, end)
    // The diff indicates that the correct start and end were found, diff will be one less than length (ex: 0-6 would be 7 points)
    expect(jDomMatrix.getHighestAbsoluteCoordinate(startEndDiff)).toEqual(shipLength-1)
  })
})