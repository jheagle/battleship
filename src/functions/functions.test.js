/**
 * @jest-environment jsdom
 */
import gameUtils from './functions'
import { makeBoard } from '../../tests/helpers/game'

const at = (board, x, y, z = 0) => board.children[z].children[y].children[x]
const pnt = (x, y, z = 0) => ({ x, y, z })

describe('checkIfShipCell / checkIfHitCell', () => {
  test('a fresh board has no ships and no hits', () => {
    const board = makeBoard()
    expect(gameUtils.checkIfShipCell(pnt(3, 4), board)).toBe(false)
    expect(gameUtils.checkIfHitCell(pnt(3, 4), board)).toBeFalsy()
  })

  test('they read the tile at that point', () => {
    const board = makeBoard()
    at(board, 3, 4).hasShip = true
    at(board, 5, 6).isHit = true
    expect(gameUtils.checkIfShipCell(pnt(3, 4), board)).toBe(true)
    expect(gameUtils.checkIfShipCell(pnt(4, 3), board)).toBe(false)
    expect(gameUtils.checkIfHitCell(pnt(5, 6), board)).toBe(true)
    expect(gameUtils.checkIfHitCell(pnt(6, 5), board)).toBeFalsy()
  })

  test('a point off the board is not a ship cell', () => {
    const board = makeBoard()
    ;[pnt(10, 0), pnt(0, 10), pnt(-1, 0), pnt(0, -1), pnt(0, 0, 1), pnt(0, 0, -1)].forEach(point => {
      expect(gameUtils.checkIfShipCell(point, board)).toBe(false)
    })
  })
})

describe('getAllNonHitCells', () => {
  test('a fresh 10 x 10 board has 100 cells to attack', () => {
    expect(gameUtils.getAllNonHitCells(makeBoard())).toHaveLength(100)
  })

  test('hit cells are left out', () => {
    const board = makeBoard()
    at(board, 0, 0).isHit = true
    at(board, 9, 9).isHit = true
    const remaining = gameUtils.getAllNonHitCells(board)
    expect(remaining).toHaveLength(98)
    expect(remaining.some(point => point.x === 0 && point.y === 0)).toBe(false)
    expect(remaining.some(point => point.x === 9 && point.y === 9)).toBe(false)
  })
})

describe('getAdjEdgeNonHitCells', () => {
  const sorted = points => points.map(point => `${point.x},${point.y}`).sort()

  test('a cell in the middle has the four cells it shares an edge with', () => {
    const adjacent = gameUtils.getAdjEdgeNonHitCells(pnt(5, 5), makeBoard())
    expect(sorted(adjacent)).toEqual(['4,5', '5,4', '5,6', '6,5'])
  })

  test('a corner only has two, and diagonals never count', () => {
    const adjacent = gameUtils.getAdjEdgeNonHitCells(pnt(0, 0), makeBoard())
    expect(sorted(adjacent)).toEqual(['0,1', '1,0'])
  })

  test('cells which are already hit are left out', () => {
    const board = makeBoard()
    at(board, 5, 4).isHit = true
    at(board, 6, 5).isHit = true
    expect(sorted(gameUtils.getAdjEdgeNonHitCells(pnt(5, 5), board))).toEqual(['4,5', '5,6'])
  })
})

describe('status helpers', () => {
  const items = [{ name: 'a', status: 100 }, { name: 'b', status: 40 }, { name: 'c', status: 40 }, { name: 'd', status: 0 }]

  test('getALowStatusItem gives the lowest, and the last one when there is a tie', () => {
    expect(gameUtils.getALowStatusItem([items[0], items[1]]).name).toBe('b')
    expect(gameUtils.getALowStatusItem([items[1], items[2]]).name).toBe('c')
    expect(gameUtils.getALowStatusItem(items).name).toBe('d')
  })

  test('getLowStatusItems gives every item tied for the lowest', () => {
    expect(gameUtils.getLowStatusItems(items.slice(0, 3)).map(item => item.name)).toEqual(['b', 'c'])
    expect(gameUtils.getLowStatusItems(items).map(item => item.name)).toEqual(['d'])
    expect(gameUtils.getLowStatusItems([items[0]]).map(item => item.name)).toEqual(['a'])
  })

  test('getBrokenItems keeps only items which are damaged but not sunk', () => {
    expect(gameUtils.getBrokenItems(items).map(item => item.name)).toEqual(['b', 'c'])
    expect(gameUtils.getBrokenItems([items[0], items[3]])).toEqual([])
  })

  test('getBrokenShipsPlayers keeps players with at least one damaged ship', () => {
    const players = [
      { name: 'healthy', shipFleet: [{ status: 100 }, { status: 100 }] },
      { name: 'damaged', shipFleet: [{ status: 100 }, { status: 60 }] },
      { name: 'sunk only', shipFleet: [{ status: 0 }, { status: 100 }] }
    ]
    expect(gameUtils.getBrokenShipsPlayers(players).map(player => player.name)).toEqual(['damaged'])
  })
})

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
    expect(gameUtils.numDamagedParts(total, status)).toBe(damaged)
  })
})

describe('filterAdjacentPoints (the checkerboard the computer searches with)', () => {
  const board = []
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      board.push(pnt(x, y))
    }
  }
  const chosen = board.filter(gameUtils.filterAdjacentPoints)
  const isChosen = (x, y) => gameUtils.filterAdjacentPoints(pnt(x, y))

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
