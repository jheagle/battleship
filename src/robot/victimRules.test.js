/**
 * @jest-environment jsdom
 */
import { useGameLifecycle, startGame, settle } from '../../tests/helpers/game'
import { eliminationRule, hitChanceRule, remainingHitPoints } from './victimRules'

useGameLifecycle()

describe('victim rules', () => {
  const setUp = async () => {
    const { players } = startGame({ humans: 3, firstGoesFirst: true })
    await settle()
    return players
  }
  const sink = player => {
    const ship = player.shipFleet[3]
    ship.parts.forEach(part => { part.isHit = true })
    ship.status = 0
    player.status = player.shipFleet.reduce((total, item) => total + item.status, 0) / player.shipFleet.length
  }

  test('remaining hit points are the unhit parts of ships not yet sunk', async () => {
    const [player] = await setUp()
    const total = player.shipFleet.reduce((sum, ship) => sum + ship.parts.length, 0)
    expect(remainingHitPoints(player)).toBe(total)
    sink(player)
    expect(remainingHitPoints(player)).toBe(total - player.shipFleet[3].parts.length)
  })

  test('elimination picks the player with fewer hit points left, not the one with more ship left', async () => {
    const players = await setUp()
    sink(players[2])
    for (let i = 0; i < 10; i++) {
      expect(eliminationRule(players)).toBe(players[2])
    }
  })

  test('the hit-chance rule picks the board with the best single cell, which is the one with more ship left', async () => {
    const players = await setUp()
    sink(players[2])
    for (let i = 0; i < 10; i++) {
      expect([players[0], players[1]]).toContain(hitChanceRule(players))
    }
  })
})
