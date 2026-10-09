/**
 * @jest-environment jsdom
 */

import randomAttack from './randomAttack'
import { useGameLifecycle, startGame, settle, attacker, victims, cells } from '../../tests/helpers/game'

useGameLifecycle()

describe('randomAttack: the dumbest possible fallback, no targeting logic at all', () => {
  test('hits or misses a random still-unhit cell on a random still-alive opponent\'s board, and passes the turn', async () => {
    const { players } = startGame({ humans: 2 })
    await settle()
    const current = attacker(players)
    const [victim] = victims(players)

    randomAttack(current, players)
    await settle()

    const hitCount = cells(victim).filter(cell => cell.isHit).length
    expect(hitCount).toBe(1)
    expect(current.attacker).toBe(false)
    expect(victim.attacker).toBe(true)
  })

  test('never picks the attacker\'s own board, even with several opponents to choose from', async () => {
    const { players } = startGame({ humans: 4 })
    await settle()
    const current = attacker(players)
    const before = cells(current).filter(cell => cell.isHit).length

    randomAttack(current, players)
    await settle()

    expect(cells(current).filter(cell => cell.isHit).length).toBe(before)
  })

  test('never picks a player who has already been eliminated', async () => {
    // attackFleet.ts's own guard already no-ops an attack on a status<=0 player's board - which would silently
    // make this fallback do nothing at all on a real timeout, not just skip a bad target - so the real thing
    // to prove is that the turn still passes, not just that the eliminated player's cells stay unmarked.
    // Eliminating every victim but one makes this deterministic: only one real candidate is ever left to pick.
    const { players } = startGame({ humans: 4 })
    await settle()
    const current = attacker(players)
    const [alive, eliminatedOne, eliminatedTwo] = victims(players)
    eliminatedOne.status = 0
    eliminatedTwo.status = 0

    randomAttack(current, players)
    await settle()

    expect(current.attacker).toBe(false)
    expect(alive.attacker).toBe(true)
    expect(cells(eliminatedOne).some(cell => cell.isHit)).toBe(false)
    expect(cells(eliminatedTwo).some(cell => cell.isHit)).toBe(false)
  })

  test('does nothing if there is no one left to attack', () => {
    const solo = { status: 100, attacker: true }
    expect(() => randomAttack(solo, [solo])).not.toThrow()
  })
})
