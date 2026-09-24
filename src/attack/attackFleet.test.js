/**
 * @jest-environment jsdom
 */

import { useGameLifecycle, twoHumans, unhitShipCells, click, unhitWaterCells, settle, other, attacker, hitCells } from '../../tests/helpers/game'

useGameLifecycle()

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
