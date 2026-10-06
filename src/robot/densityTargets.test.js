/**
 * @jest-environment jsdom
 */

import { useGameLifecycle, startGame, settle } from '../../tests/helpers/game'
import densityTargets, { densityChoices } from './densityTargets'
import checkIfHitCell from '../utils/checkIfHitCell'
import matrixDom from 'matrix-dom'

useGameLifecycle()

describe('densityTargets', () => {
  const setUp = async () => {
    const { players } = startGame({ humans: 2, firstGoesFirst: true })
    await settle()
    return { victim: players[1] }
  }

  test('on a fresh board, only offers cells which have not been attacked', async () => {
    const { victim } = await setUp()
    const targets = densityTargets(victim)
    expect(targets.length).toBeGreaterThan(0)
    targets.forEach(point => expect(checkIfHitCell(point, victim.board)).toBe(false))
  })

  test('on a fresh board, the highest-rated cells are the four in the centre, and the choice is among them', async () => {
    const { victim } = await setUp()
    const { top, targets } = densityChoices(victim)
    const key = point => `${point.x},${point.y}`
    expect(top.map(key).sort()).toEqual(['4,4', '4,5', '5,4', '5,5'])
    targets.forEach(point => expect(top.map(key)).toContain(key(point)))
  })

  test('after a hit, offers the cells in line with that hit', async () => {
    const { victim } = await setUp()
    const ship = victim.shipFleet[0]
    const hit = ship.parts[2]
    hit.isHit = true
    ship.status = (ship.parts.length - 1) / ship.parts.length * 100
    victim.status = victim.shipFleet.reduce((total, item) => total + item.status, 0) / victim.shipFleet.length
    matrixDom.getDomItemFromPoint(hit.point, victim.board).isHit = true
    const targets = densityTargets(victim)
    const neighbours = targets.filter(p => Math.abs(p.x - hit.point.x) + Math.abs(p.y - hit.point.y) === 1)
    expect(neighbours.length).toBeGreaterThan(0)
  })
})
