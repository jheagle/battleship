/**
 * @jest-environment jsdom
 */
import jsonDom from 'json-dom'
import jDomMatrix from 'matrix-dom'
import gameStart from './setup.js'
import { startGame, getPlayers, cells, shipCells, attacker, makeBoard, useGameLifecycle } from '../../tests/helpers/game'

useGameLifecycle()

const fleetSizes = [5, 4, 3, 3, 2]
const fleetNames = ['Aircraft Carrier', 'Battleship', 'Submarine', 'Cruiser', 'Destroyer']

describe('setup: generateStartEnd', () => {
  test('able to get a start and end point for ship length 7', () => {
    const shipLength = 7
    const matrix = jDomMatrix.buildMatrix(jDomMatrix.point(10, 10, 1))
    const [start, end] = gameStart.generateStartEnd(matrix, shipLength)
    const startEndDiff = jDomMatrix.pointDifference(start, end)
    // The diff indicates that the correct start and end were found, diff will be one less than length (ex: 0-6 would be 7 points)
    expect(jDomMatrix.getHighestAbsoluteCoordinate(startEndDiff)).toEqual(shipLength - 1)
  })

  test.each([2, 3, 4, 5])('a ship of length %i is always a straight, horizontal or vertical line inside the board', length => {
    const board = makeBoard()
    for (let i = 0; i < 100; i++) {
      const [start, end] = gameStart.generateStartEnd(board, length)
      const diff = jDomMatrix.pointDifference(start, end)
      expect(diff.z).toBe(0)
      expect([Math.abs(diff.x), Math.abs(diff.y)].sort()).toEqual([0, length - 1])
      ;[start, end].forEach(point => {
        expect(point.x).toBeGreaterThanOrEqual(0)
        expect(point.x).toBeLessThanOrEqual(9)
        expect(point.y).toBeGreaterThanOrEqual(0)
        expect(point.y).toBeLessThanOrEqual(9)
        expect(point.z).toBe(0)
      })
    }
  })

  test('never overlaps a ship which is already on the board', () => {
    const board = makeBoard()
    // A wall of ships across the middle rows leaves only the outer rows and columns free for a long ship
    for (let x = 0; x < 10; x++) {
      board.children[0].children[4].children[x].hasShip = true
    }
    for (let i = 0; i < 100; i++) {
      const [start, end] = gameStart.generateStartEnd(board, 5)
      const points = jDomMatrix.getLinePoints(start, end)
      expect(points).toHaveLength(5)
      points.forEach(point => expect(board.children[0].children[point.y].children[point.x].hasShip).toBe(false))
    }
  })
})

describe('setup: main menu', () => {
  test('main puts the menu on an otherwise empty page and returns the document', () => {
    const doc = jsonDom.documentDomItem({ beginRound: gameStart.beginRound })
    doc.body.children.push()
    const result = gameStart.main(doc)
    expect(result).toBe(doc)
    expect(doc.body.children).toHaveLength(1)
    expect(jsonDom.getChildrenByClass('main-menu', doc.body)).toHaveLength(1)
  })

  test('main clears whatever was on the page before, so calling it again starts over', () => {
    const { doc } = startGame({ humans: 2 })
    expect(jsonDom.getChildrenByClass('boards', doc.body)).toHaveLength(1)
    gameStart.main(doc)
    expect(jsonDom.getChildrenByClass('boards', doc.body)).toHaveLength(0)
    expect(jsonDom.getChildrenByClass('main-menu', doc.body)).toHaveLength(1)
  })

  test('the form starts at 0 humans, 0 robots', () => {
    const doc = gameStart.main(jsonDom.documentDomItem({ beginRound: gameStart.beginRound }))
    const form = jsonDom.getChildrenByClass('main-menu-form', doc.body)[0]
    expect(jsonDom.getChildrenByName('human-players', form)[0].element.value).toBe('0')
    expect(jsonDom.getChildrenByName('robot-players', form)[0].element.value).toBe('0')
    expect(jsonDom.getChildrenByName('first-go-first', form)[0].element.checked).toBe(false)
  })
})

describe('setup: choosing the players', () => {
  test.each([
    // humans, robots -> [humans expected, robots expected]
    [2, 0, 2, 0],
    [1, 1, 1, 1],
    [1, 0, 1, 1], // a lone human always gets a robot to play
    [0, 0, 0, 2], // nobody chosen means two robots play each other
    [0, 1, 0, 2],
    [0, 3, 0, 3],
    [3, 2, 3, 2]
  ])('%i humans and %i robots start a game of %i humans and %i robots', (humans, robots, expectedHumans, expectedRobots) => {
    const { players } = startGame({ humans, robots })
    expect(players).toHaveLength(expectedHumans + expectedRobots)
    expect(players.filter(player => !player.isRobot)).toHaveLength(expectedHumans)
    expect(players.filter(player => player.isRobot)).toHaveLength(expectedRobots)
    expect(players.map(player => player.name)).toEqual(players.map((player, i) => `Player ${i + 1}`))
    // Humans always come first
    expect(players.map(player => player.isRobot)).toEqual([...Array(expectedHumans).fill(false), ...Array(expectedRobots).fill(true)])
  })

  test.each([[101, 0], [0, 101], [-1, 2], [2, -1]])('%i humans and %i robots is refused and leaves the menu showing', (humans, robots) => {
    const { doc, players } = startGame({ humans, robots })
    expect(players).toHaveLength(0)
    expect(jsonDom.getChildrenByClass('main-menu', doc.body)).toHaveLength(1)
  })

  test('starting the game removes the menu', () => {
    const { doc } = startGame({ humans: 2 })
    expect(jsonDom.getChildrenByClass('main-menu', doc.body)).toHaveLength(0)
    expect(getPlayers(doc)).toHaveLength(2)
  })
})

describe('setup: who goes first', () => {
  test('with "first player starts" ticked, player 1 attacks first, every time', () => {
    for (let i = 0; i < 10; i++) {
      const { players } = startGame({ humans: 3, firstGoesFirst: true })
      expect(players.map(player => player.attacker)).toEqual([true, false, false])
      expect(players[0].turnCnt).toBe(1)
    }
  })

  test('otherwise exactly one player attacks first, and every player has a chance', () => {
    const firsts = new Set()
    for (let i = 0; i < 60; i++) {
      const { players } = startGame({ humans: 3, firstGoesFirst: false })
      expect(players.filter(player => player.attacker)).toHaveLength(1)
      firsts.add(attacker(players).name)
    }
    expect(firsts.size).toBe(3)
  })
})

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

describe('setup: beginRound', () => {
  test('ignores a submit which is not aimed at the form itself (an event which only bubbled through)', () => {
    const doc = gameStart.main(jsonDom.documentDomItem({ beginRound: gameStart.beginRound }))
    const form = jsonDom.getChildrenByClass('main-menu-form', doc.body)[0]
    const preventDefault = jest.fn()
    expect(gameStart.beginRound({ eventPhase: 3, type: 'submit', preventDefault }, form)).toBe(false)
    expect(gameStart.beginRound({ eventPhase: 1, type: 'submit', preventDefault }, form)).toBe(false)
    expect(preventDefault).not.toHaveBeenCalled()
    expect(jsonDom.getChildrenByClass('main-menu', doc.body)).toHaveLength(1)
    expect(getPlayers(doc)).toHaveLength(0)
  })
})
