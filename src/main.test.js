/**
 * @jest-environment jsdom
 */
import gameActions from './functions/actions'
import gameUtils from './functions/functions'
import jsonDom from 'json-dom'
import {
  startGame, settle, click, playToTheEnd, cells, unhitWaterCells, useGameLifecycle
} from '../tests/helpers/game'

useGameLifecycle()

describe('the entry point', () => {
  test('in Node the game starts by itself: the menu is submitted for you and two robots play', async () => {
    const battleship = require('./main.js').default
    battleship()
    expect(document.querySelector('.main-menu')).toBeNull()
    expect(document.querySelectorAll('.player')).toHaveLength(2)
    await settle(60000)
  })

  test('in a browser the menu waits for the player', () => {
    jest.isolateModules(() => {
      jest.doMock('browser-or-node', () => ({ isNode: false }))
      const battleship = require('./main.js').default
      battleship()
    })
    expect(document.querySelector('.main-menu')).not.toBeNull()
    expect(document.querySelectorAll('.player')).toHaveLength(0)
  })
})

describe('a human against a robot', () => {
  test('the robot answers each of the human\'s attacks by itself, then it is the human\'s turn again', async () => {
    const { players: [human, robot] } = startGame({ humans: 1, robots: 1, firstGoesFirst: true })
    await settle()
    expect(human.attacker).toBe(true)
    for (let i = 1; i <= 5; i++) {
      await click(unhitWaterCells(robot)[0], 5000)
      expect(robot.attacks.hit + robot.attacks.miss).toBe(i)
      expect(human.attacks.hit + human.attacks.miss).toBe(i)
      expect(human.attacker).toBe(true)
      expect(robot.attacker).toBe(false)
    }
  })

  test('the robot goes first when it is chosen to', async () => {
    let robotFirst = 0
    for (let i = 0; i < 40 && robotFirst === 0; i++) {
      const { players } = startGame({ humans: 1, robots: 1, firstGoesFirst: false })
      await settle(5000)
      if (players[1].attacks.hit + players[1].attacks.miss > 0) {
        robotFirst++
        expect(players[0].attacker).toBe(true)
      }
    }
    expect(robotFirst).toBe(1)
  })
})

describe('robots playing each other', () => {
  const recordGame = async (options = { humans: 0, robots: 2 }) => {
    const attacks = []
    const original = gameActions.attackFleet
    jest.spyOn(gameActions, 'attackFleet').mockImplementation(function (target) {
      const victim = jsonDom.getParentsByClass('player', target)[0]
      const players = jsonDom.getParentsByClass('boards', target)[0].children
      const who = players.find(player => player.attacker)
      const before = {
        attacker: who,
        victim,
        cell: target,
        wasHit: Boolean(target.isHit),
        damaged: victim.shipFleet.filter(ship => ship.status > 0 && ship.status < 100),
        hitCells: cells(victim).filter(cell => cell.isHit)
      }
      const turnBefore = who && who.turnCnt
      const result = original.call(gameActions.attackFleet, target)
      attacks.push({ ...before, counted: Boolean(target.isHit), hasShip: target.hasShip, turnBefore })
      return result
    })
    const { players } = startGame(options)
    const finished = await playToTheEnd()
    return { players, attacks, finished }
  }

  const neighbours = (cell, victim) => cells(victim).filter(other => Math.abs(other.point.x - cell.point.x) + Math.abs(other.point.y - cell.point.y) === 1)

  const games = []
  beforeAll(async () => {
    for (let i = 0; i < 4; i++) {
      jest.useFakeTimers()
      jest.spyOn(console, 'log').mockImplementation(() => {})
      gameActions.attackFleet.isLocked = false
      games.push(await recordGame())
      await settle(60000)
      jest.restoreAllMocks()
      jest.useRealTimers()
      document.body.innerHTML = ''
    }
  }, 120000)

  test('every game finishes with a winner and the final scores', () => {
    games.forEach(({ finished, players }) => {
      expect(finished).toBe(true)
      expect(players.filter(player => player.status > 0)).toHaveLength(1)
    })
  })

  test('the loser has lost every ship and the winner has hit exactly the 17 ship cells', () => {
    games.forEach(({ players }) => {
      const [winner] = players.filter(player => player.status > 0)
      const [loser] = players.filter(player => player.status <= 0)
      loser.shipFleet.forEach(ship => expect(ship.status).toBe(0))
      expect(winner.attacks.hit).toBe(17)
      expect(winner.attacks.sunk).toBe(5)
      expect(cells(loser).filter(cell => cell.isHit && cell.hasShip)).toHaveLength(17)
    })
  })

  test('the winner is marked WINNER, and the final cards match each player\'s attacks', () => {
    games.forEach(({ players }) => {
      const [winner] = players.filter(player => player.status > 0)
      expect(winner.playerStats.element.textContent).toContain('WINNER')
    })
  })

  test('the attackers strictly take turns, and never attack a board more than once per cell', () => {
    games.forEach(({ attacks }) => {
      attacks.forEach((attack, i) => {
        if (i > 0) {
          expect(attack.attacker).not.toBe(attacks[i - 1].attacker)
        }
        expect(attack.wasHit).toBe(false)
        expect(attack.counted).toBe(true)
      })
      const keys = attacks.map(attack => `${attack.victim.name}:${attack.cell.point.x},${attack.cell.point.y}`)
      expect(new Set(keys).size).toBe(keys.length)
    })
  })

  test('a player\'s hit + miss counts add up to the attacks they made', () => {
    games.forEach(({ players, attacks }) => {
      players.forEach(player => {
        const made = attacks.filter(attack => attack.attacker === player)
        expect(player.attacks.hit + player.attacks.miss).toBe(made.length)
        expect(player.attacks.hit).toBe(made.filter(attack => attack.hasShip).length)
      })
    })
  })

  test('a game is never longer than the number of cells the two boards have', () => {
    games.forEach(({ attacks }) => expect(attacks.length).toBeLessThanOrEqual(200))
  })

  test('with no damaged ship to follow up, the robot searches in a checkerboard so every ship is found quickly', () => {
    games.forEach(({ attacks }) => {
      attacks.filter(attack => attack.damaged.length === 0).forEach(attack => {
        const checkerboardLeft = cells(attack.victim).some(cell => !attack.hitCells.includes(cell) && gameUtils.filterAdjacentPoints(cell.point))
        if (checkerboardLeft) {
          expect(gameUtils.filterAdjacentPoints(attack.cell.point)).toBe(true)
        }
      })
    })
  })

  test('after damaging a ship, the robot goes after the cells next to the hit parts', () => {
    let followUps = 0
    games.forEach(({ attacks }) => {
      attacks.filter(attack => attack.damaged.length > 0).forEach(attack => {
        const damagedParts = attack.damaged.flatMap(ship => ship.parts).filter(part => part.isHit || attack.hitCells.includes(part))
        const nextToDamage = damagedParts.flatMap(part => neighbours(part, attack.victim)).filter(cell => !attack.hitCells.includes(cell))
        if (nextToDamage.length > 0) {
          followUps++
          expect(nextToDamage).toContain(attack.cell)
        }
      })
    })
    expect(followUps).toBeGreaterThan(10)
  })

  test('the restart button after a robot game goes back to the menu', async () => {
    jest.useFakeTimers()
    jest.spyOn(console, 'log').mockImplementation(() => {})
    gameActions.attackFleet.isLocked = false
    startGame({ humans: 0, robots: 2 })
    await playToTheEnd()
    document.querySelector('.final-scores input[type=button]').click()
    await settle()
    expect(document.querySelector('.main-menu')).not.toBeNull()
  }, 60000)
})
