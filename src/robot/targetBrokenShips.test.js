/**
 * @jest-environment jsdom
 */

import { useGameLifecycle, startGame, settle } from '../../tests/helpers/game'
import targetBrokenShips from './targetBrokenShips'

useGameLifecycle()

describe('targetBrokenShips', () => {
  const setUp = async () => {
    const { players } = startGame({ humans: 2, firstGoesFirst: true })
    await settle()
    return { victim: players[1] }
  }
  const damage = (victim, ship, indexes) => {
    indexes.forEach(index => { ship.parts[index].isHit = true })
    ship.status = (ship.parts.length - indexes.length) / ship.parts.length * 100
    victim.status = victim.shipFleet.reduce((total, item) => total + item.status, 0) / victim.shipFleet.length
  }

  test('returns nothing to follow up on when no ship is damaged', async () => {
    const { victim } = await setUp()
    expect(targetBrokenShips(victim)).toEqual([])
  })

  test('with one hit on a ship, returns the cells which share an edge with it', async () => {
    const { victim } = await setUp()
    const ship = victim.shipFleet[0]
    damage(victim, ship, [2])
    const targets = targetBrokenShips(victim)
    expect(targets.length).toBeGreaterThan(0)
    const { x, y } = ship.parts[2].point
    targets.forEach(point => expect(Math.abs(point.x - x) + Math.abs(point.y - y)).toBe(1))
  })

  test('with two hits and a gap between them, returns exactly the gap point', async () => {
    const { victim } = await setUp()
    const carrier = victim.shipFleet[0]
    damage(victim, carrier, [0, 2])
    expect(targetBrokenShips(victim)).toEqual([carrier.parts[1].point])
  })
})
