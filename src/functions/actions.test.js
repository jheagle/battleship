/**
 * @jest-environment jsdom
 */
import gameActions from './actions'
import {
  startGame, settle, click, attacker, victims, unhitShipCells, unhitWaterCells, hitCells, useGameLifecycle
} from '../../tests/helpers/game'

useGameLifecycle()

// Two humans, player 1 to attack. A "turn" is one click on the other player's board.
const twoHumans = async () => {
  const game = startGame({ humans: 2 })
  await settle()
  return game
}
const other = (players, player) => players.find(p => p !== player)
const colour = cell => cell.attributes.style && cell.attributes.style.backgroundColor

describe('attacking with a click', () => {
  test('hitting a ship marks the cell red, counts a hit and passes the turn (no free turn)', async () => {
    const { players: [one, two] } = await twoHumans()
    const cell = unhitShipCells(two)[0]
    await click(cell)
    expect(cell.isHit).toBe(true)
    expect(colour(cell)).toBe('red')
    expect(one.attacks).toEqual({ hit: 1, miss: 0, sunk: 0 })
    expect(one.attacker).toBe(false)
    expect(two.attacker).toBe(true)
    expect(two.turnCnt).toBe(1)
  })

  test('the colour is really on the page straight away, even for the first hit on a cell', async () => {
    const { players: [, two] } = await twoHumans()
    const [ship, water] = [unhitShipCells(two)[0], unhitWaterCells(two)[0]]
    // No time passes after the click: a player sees the result at once
    ship.element.click()
    expect(ship.element.style.backgroundColor).toBe('red')
    await settle()
    // (it is player 2's turn now, so player 1's board is next to be attacked - hit the same board again later)
    expect(ship.element.style.backgroundColor).toBe('red')
    expect(water.element.style.backgroundColor).toBe('')
  })

  test('every hit colours the element: red for ships, white for water, on both boards', async () => {
    const { players } = await twoHumans()
    const marked = []
    for (let i = 0; i < 6; i++) {
      const victim = other(players, attacker(players))
      const cell = i % 2 === 0 ? unhitShipCells(victim)[0] : unhitWaterCells(victim)[0]
      cell.element.click()
      marked.push([cell, i % 2 === 0 ? 'red' : 'white'])
      expect(cell.element.style.backgroundColor).toBe(i % 2 === 0 ? 'red' : 'white')
      await settle()
    }
    marked.forEach(([cell, expected]) => expect(cell.element.style.backgroundColor).toBe(expected))
  })

  test('missing marks the cell white, counts a miss and passes the turn', async () => {
    const { players: [one, two] } = await twoHumans()
    const cell = unhitWaterCells(two)[0]
    await click(cell)
    expect(cell.isHit).toBe(true)
    expect(colour(cell)).toBe('white')
    expect(one.attacks).toEqual({ hit: 0, miss: 1, sunk: 0 })
    expect(two.attacker).toBe(true)
  })

  test('the turns keep alternating whatever the result', async () => {
    const { players } = await twoHumans()
    const order = []
    for (let i = 0; i < 12; i++) {
      const current = attacker(players)
      order.push(current.name)
      const victim = other(players, current)
      // Alternate hits and misses so both kinds of turn are covered
      await click(i % 2 === 0 ? unhitShipCells(victim)[0] : unhitWaterCells(victim)[0])
    }
    expect(order).toEqual(Array.from({ length: 12 }, (_, i) => i % 2 === 0 ? 'Player 1' : 'Player 2'))
  })

  test('the turn count goes up each time a player becomes the attacker', async () => {
    const { players: [one, two] } = await twoHumans()
    for (let i = 0; i < 4; i++) {
      await click(unhitWaterCells(attacker([one, two]) === one ? two : one)[0])
    }
    // Player 1 starts on 1, player 2 gets their first go after the first click; four clicks later it is player 1's third go
    expect([one.turnCnt, two.turnCnt]).toEqual([3, 2])
  })

  test('you cannot attack your own board', async () => {
    const { players: [one, two] } = await twoHumans()
    const own = unhitWaterCells(one)[0]
    await click(own)
    expect(own.isHit).toBeFalsy()
    expect(one.attacker).toBe(true)
    expect(one.attacks).toEqual({ hit: 0, miss: 0, sunk: 0 })
    expect(hitCells(two)).toHaveLength(0)
  })

  test('a cell which was already hit cannot be attacked again', async () => {
    const { players: [one, two] } = await twoHumans()
    const cell = unhitShipCells(two)[0]
    await click(cell)
    await click(unhitWaterCells(one)[0])
    expect(one.attacker).toBe(true)
    const attacksBefore = { ...one.attacks }
    await click(cell)
    expect(one.attacks).toEqual(attacksBefore)
    expect(one.attacker).toBe(true)
    expect(two.attacker).toBe(false)
  })

  test('clicks while the turn is changing over are ignored', async () => {
    const { players: [one, two] } = await twoHumans()
    unhitShipCells(two)[0].element.click()
    // No time has passed, so the board is still locked for the change of turn
    unhitWaterCells(one)[0].element.click()
    expect(hitCells(one)).toHaveLength(0)
    expect(two.attacks).toEqual({ hit: 0, miss: 0, sunk: 0 })
    await settle()
    unhitWaterCells(one)[0].element.click()
    expect(hitCells(one)).toHaveLength(1)
  })
})

describe('ship and player health', () => {
  test('hitting one part of a ship lowers the ship and the player by the right amount', async () => {
    const { players: [one, two] } = await twoHumans()
    const carrier = two.shipFleet[0]
    await click(carrier.parts[0])
    expect(carrier.status).toBe(80)
    // Every other ship is still at 100%, so the player is (80 + 4 x 100) / 5
    expect(two.status).toBe(96)
    expect(one.status).toBe(100)
  })

  test('the stats panel shows the new health', async () => {
    const { players: [one, two] } = await twoHumans()
    await click(two.shipFleet[0].parts[0])
    expect(two.playerStats.element.textContent).toContain('Aircraft Carrier (5): 80%')
    expect(two.playerStats.element.textContent).toContain('Battleship (4): 100%')
    // The player whose turn it is shows ATTACKER instead of their health, and goes back to a percentage afterwards
    expect(two.playerStats.element.textContent).toContain('Player 2: ATTACKER')
    expect(one.playerStats.element.textContent).toContain('Player 1: 100%')
    await click(unhitWaterCells(one)[0])
    expect(two.playerStats.element.textContent).toContain('Player 2: 96%')
  })

  test('sinking a ship counts it as sunk once, and only when its last part goes', async () => {
    const { players: [one, two] } = await twoHumans()
    const destroyer = two.shipFleet[4]
    await click(destroyer.parts[0])
    await click(unhitWaterCells(one)[0])
    expect(one.attacks.sunk).toBe(0)
    expect(destroyer.status).toBe(50)
    await click(destroyer.parts[1])
    expect(destroyer.status).toBe(0)
    expect(one.attacks.sunk).toBe(1)
    expect(one.attacks.hit).toBe(2)
    expect(two.status).toBeCloseTo((100 * 4) / 5)
  })

  test('a miss changes nobody\'s health', async () => {
    const { players: [one, two] } = await twoHumans()
    await click(unhitWaterCells(two)[0])
    expect([one.status, two.status]).toEqual([100, 100])
    two.shipFleet.forEach(ship => expect(ship.status).toBe(100))
  })
})

describe('ending the game', () => {
  // Player 1 hits every ship cell of player 2; player 2 just misses.
  const winAsPlayerOne = async ({ players: [one, two] }) => {
    while (two.status > 0) {
      await click(unhitShipCells(two)[0])
      if (two.status > 0) {
        await click(unhitWaterCells(one)[0])
      }
    }
    await settle(2000)
  }

  test('sinking every ship ends the game and shows the final scores', async () => {
    const game = await twoHumans()
    await winAsPlayerOne(game)
    const [one, two] = game.players
    expect(two.status).toBe(0)
    expect(one.status).toBe(100)
    expect(document.querySelectorAll('.final-scores')).toHaveLength(1)
    expect(document.querySelectorAll('.score-card')).toHaveLength(2)
  })

  test('the winner is marked and the final cards have each player\'s numbers', async () => {
    const game = await twoHumans()
    await winAsPlayerOne(game)
    const [one, two] = game.players
    expect(one.playerStats.element.textContent).toContain('Player 1: WINNER')
    const cardText = [...document.querySelectorAll('.score-card')].map(card => card.textContent.replace(/\s+/g, ' '))
    expect(cardText[0]).toContain('Player 1')
    expect(cardText[0]).toContain(`Hit: ${one.attacks.hit} / Miss: ${one.attacks.miss}`)
    expect(cardText[0]).toContain(`Turns: ${one.turnCnt}`)
    expect(cardText[1]).toContain('Player 2')
    expect(cardText[1]).toContain('Status: 0%')
    expect(one.attacks).toMatchObject({ hit: 17, sunk: 5 })
    expect(two.attacks.hit).toBe(0)
  })

  test('once a player is out, their board can no longer be attacked', async () => {
    const game = await twoHumans()
    await winAsPlayerOne(game)
    const [, two] = game.players
    const cell = unhitWaterCells(two)[0]
    await click(cell)
    expect(cell.isHit).toBeFalsy()
  })

  test('the restart button goes back to the menu', async () => {
    const game = await twoHumans()
    await winAsPlayerOne(game)
    const restart = document.querySelector('.final-scores input[type=button]')
    expect(restart).not.toBeNull()
    restart.click()
    await settle()
    expect(document.querySelector('.main-menu')).not.toBeNull()
    expect(document.querySelector('.final-scores')).toBeNull()
    expect(document.querySelector('.boards')).toBeNull()
  })
})

describe('more than two players', () => {
  test('the turn goes round every player in order, then starts again', async () => {
    const { players } = startGame({ humans: 3 })
    await settle()
    const order = []
    for (let i = 0; i < 6; i++) {
      const current = attacker(players)
      order.push(current.name)
      await click(unhitWaterCells(victims(players)[0])[0])
    }
    expect(order).toEqual(['Player 1', 'Player 2', 'Player 3', 'Player 1', 'Player 2', 'Player 3'])
  })

  test('a player who is out is skipped, and the game goes on until one is left', async () => {
    const { players: [one, two, three] } = startGame({ humans: 3 })
    await settle()
    const order = []
    // Player 1 sinks player 2; the others just miss (on whoever is not attacking, but never player 2 by accident)
    for (let i = 0; i < 200 && two.status > 0; i++) {
      const current = attacker([one, two, three])
      order.push(current.name)
      if (current === one) {
        await click(unhitShipCells(two)[0])
      } else {
        await click(unhitWaterCells(current === two ? three : one)[0])
      }
    }
    expect(two.status).toBe(0)
    expect(document.querySelector('.final-scores')).toBeNull()
    // From now on only players 1 and 3 take turns
    const later = []
    for (let i = 0; i < 6; i++) {
      const current = attacker([one, three])
      expect(current).toBeDefined()
      later.push(current.name)
      await click(unhitWaterCells(current === one ? three : one)[0])
    }
    expect(later).toEqual(expect.not.arrayContaining(['Player 2']))
    expect(later.slice(0, 2)).not.toEqual([later[0], later[0]])
    expect(new Set(later)).toEqual(new Set(['Player 1', 'Player 3']))
  })
})

describe('the robot\'s targeting', () => {
  // Set the game up by hand so the robot has exactly the situation being tested: the robot is the attacker, and the
  // given cells of a ship on the other board have already been hit.
  const setUp = async (options = { humans: 1, robots: 1 }) => {
    const { players } = startGame({ ...options, firstGoesFirst: true })
    await settle()
    players.forEach(player => { player.attacker = false })
    const robot = players.find(player => player.isRobot)
    robot.attacker = true
    gameActions.attackFleet.isLocked = false
    return { players, robot }
  }
  const damage = (victim, ship, indexes) => {
    indexes.forEach(index => { ship.parts[index].isHit = true })
    ship.status = (ship.parts.length - indexes.length) / ship.parts.length * 100
    victim.status = victim.shipFleet.reduce((total, item) => total + item.status, 0) / victim.shipFleet.length
  }
  const newlyHit = (victim, before) => hitCells(victim).filter(cell => !before.includes(cell))
  const key = point => `${point.x},${point.y}`
  const along = ship => ship.parts[0].point.x !== ship.parts[1].point.x ? { x: 1, y: 0 } : { x: 0, y: 1 }

  test('with two hits on a ship and a gap between them, it fills the gap', async () => {
    const { players, robot } = await setUp()
    const victim = players.find(player => player !== robot)
    const carrier = victim.shipFleet[0]
    damage(victim, carrier, [0, 2])
    const before = hitCells(victim)
    gameActions.computerAttack(robot, players)
    const [hit] = newlyHit(victim, before)
    expect(newlyHit(victim, before)).toHaveLength(1)
    expect(key(hit.point)).toBe(key(carrier.parts[1].point))
  })

  test('with a run of hits and no gap, it goes to either end of the run', async () => {
    for (let game = 0; game < 12; game++) {
      const { players, robot } = await setUp()
      const victim = players.find(player => player !== robot)
      const ship = victim.shipFleet[0]
      damage(victim, ship, [1, 2])
      const before = hitCells(victim)
      gameActions.computerAttack(robot, players)
      const [hit] = newlyHit(victim, before)
      const step = along(ship)
      const beforeRun = { x: ship.parts[1].point.x - step.x, y: ship.parts[1].point.y - step.y }
      const afterRun = { x: ship.parts[2].point.x + step.x, y: ship.parts[2].point.y + step.y }
      expect([key(beforeRun), key(afterRun)]).toContain(key(hit.point))
      await settle(20000)
    }
  })

  test('with only one hit on a ship, it tries the cells which share an edge with it', async () => {
    for (let game = 0; game < 12; game++) {
      const { players, robot } = await setUp()
      const victim = players.find(player => player !== robot)
      const ship = victim.shipFleet[0]
      damage(victim, ship, [2])
      const before = hitCells(victim)
      gameActions.computerAttack(robot, players)
      const [hit] = newlyHit(victim, before)
      const { x, y } = ship.parts[2].point
      expect(Math.abs(hit.point.x - x) + Math.abs(hit.point.y - y)).toBe(1)
      await settle(20000)
    }
  })

  test('it goes for the player who has a damaged ship rather than a healthier one', async () => {
    for (let game = 0; game < 10; game++) {
      const { players, robot } = await setUp({ humans: 1, robots: 2 })
      const others = players.filter(player => player !== robot)
      damage(others[1], others[1].shipFleet[3], [0])
      const beforeFirst = hitCells(others[0])
      const beforeSecond = hitCells(others[1])
      gameActions.computerAttack(robot, players)
      expect(newlyHit(others[0], beforeFirst)).toHaveLength(0)
      expect(newlyHit(others[1], beforeSecond)).toHaveLength(1)
      await settle(20000)
    }
  })

  test('when nobody is damaged it goes for the player with the lowest health', async () => {
    for (let game = 0; game < 10; game++) {
      const { players, robot } = await setUp({ humans: 1, robots: 2 })
      const others = players.filter(player => player !== robot)
      others[0].status = 50
      const beforeFirst = hitCells(others[0])
      const beforeSecond = hitCells(others[1])
      gameActions.computerAttack(robot, players)
      expect(newlyHit(others[0], beforeFirst)).toHaveLength(1)
      expect(newlyHit(others[1], beforeSecond)).toHaveLength(0)
      await settle(20000)
    }
  })
})
