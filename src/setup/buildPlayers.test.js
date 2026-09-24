/**
 * @jest-environment jsdom
 */

import { useGameLifecycle, startGame, cells, shipCells } from '../../tests/helpers/game'

useGameLifecycle()

const fleetSizes = [5, 4, 3, 3, 2]

const fleetNames = ['Aircraft Carrier', 'Battleship', 'Submarine', 'Cruiser', 'Destroyer']

describe('setup: each board and fleet', () => {
  const games = []
  beforeAll(() => {
    jest.useFakeTimers()
    jest.spyOn(console, 'log').mockImplementation(() => {})
    for (let i = 0; i < 25; i++) {
      games.push(startGame({ humans: 2 }).players)
    }
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  test('every player gets a 10 x 10 board of 100 cells', () => {
    games.flat().forEach(player => {
      expect(player.board.children).toHaveLength(1)
      expect(player.board.children[0].children).toHaveLength(10)
      player.board.children[0].children.forEach(row => expect(row.children).toHaveLength(10))
      expect(cells(player)).toHaveLength(100)
    })
  })

  test('every cell knows its own point', () => {
    games.flat().forEach(player => {
      player.board.children[0].children.forEach((row, y) => row.children.forEach((cell, x) => {
        expect(cell.point).toMatchObject({ x, y, z: 0 })
      }))
    })
  })

  test('the fleet is a carrier, battleship, submarine, cruiser and destroyer', () => {
    games.flat().forEach(player => {
      expect(player.shipFleet.map(ship => ship.name)).toEqual(fleetNames)
      expect(player.shipFleet.map(ship => ship.parts.length)).toEqual(fleetSizes)
      player.shipFleet.forEach(ship => expect(ship.status).toBe(100))
    })
  })

  test('each ship is a straight, unbroken horizontal or vertical line', () => {
    games.flat().forEach(player => player.shipFleet.forEach(ship => {
      const points = ship.parts.map(part => part.point)
      const xs = new Set(points.map(point => point.x))
      const ys = new Set(points.map(point => point.y))
      expect(xs.size === 1 || ys.size === 1).toBe(true)
      const along = (xs.size === 1 ? points.map(point => point.y) : points.map(point => point.x)).sort((a, b) => a - b)
      along.forEach((value, i) => expect(value).toBe(along[0] + i))
    }))
  })

  test('the ships never overlap and never leave the board: 17 separate cells hold ships, and only those', () => {
    games.flat().forEach(player => {
      const partKeys = player.shipFleet.flatMap(ship => ship.parts.map(part => `${part.point.x},${part.point.y}`))
      expect(partKeys).toHaveLength(17)
      expect(new Set(partKeys).size).toBe(17)
      partKeys.forEach(key => {
        const [x, y] = key.split(',').map(Number)
        expect(x >= 0 && x <= 9 && y >= 0 && y <= 9).toBe(true)
      })
      expect(shipCells(player)).toHaveLength(17)
      shipCells(player).forEach(cell => expect(partKeys).toContain(`${cell.point.x},${cell.point.y}`))
    })
  })

  test('nothing starts out hit, and every player starts at full health with no attacks', () => {
    games.flat().forEach(player => {
      expect(cells(player).filter(cell => cell.isHit)).toHaveLength(0)
      expect(player.status).toBe(100)
      expect(player.attacks).toEqual({ hit: 0, miss: 0, sunk: 0 })
    })
  })

  test('each player has a board and a stats panel, and the stats list every ship', () => {
    games.flat().forEach(player => {
      expect(player.children).toHaveLength(2)
      expect(player.children[0]).toBe(player.board)
      const text = player.playerStats.element.textContent
      expect(text).toContain(player.name)
      fleetNames.forEach((name, i) => expect(text).toContain(`${name} (${fleetSizes[i]}): 100%`))
    })
  })

  test('the ships end up in different places from game to game', () => {
    const layouts = new Set(games.map(players => shipCells(players[0]).map(cell => `${cell.point.x},${cell.point.y}`).join('|')))
    expect(layouts.size).toBeGreaterThan(20)
  })
})
