/**
 * @jest-environment jsdom
 */

import { useGameLifecycle, startGame, settle, hitCells } from '../../tests/helpers/game'
import attackLock from '../attack/attackLock'
import computerAttack from './computerAttack'
import { buildShotState } from './densityTargets'
import { bestTargets, scoreTargets } from './densityScores'

useGameLifecycle()

describe('the robot\'s targeting', () => {
  // Set the game up by hand so the robot has exactly the situation being tested: the robot is the attacker, and the
  // given cells of a ship on the other board have already been hit.
  const setUp = async (options = { humans: 1, robots: 1 }) => {
    const { players } = startGame({ ...options, firstGoesFirst: true })
    await settle()
    players.forEach(player => { player.attacker = false })
    const robot = players.find(player => player.isRobot)
    robot.attacker = true
    attackLock.isLocked = false
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
    computerAttack(robot, players)
    await settle(1500)
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
      computerAttack(robot, players)
      await settle(1500)
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
      computerAttack(robot, players)
      await settle(1500)
      const [hit] = newlyHit(victim, before)
      const { x, y } = ship.parts[2].point
      expect(Math.abs(hit.point.x - x) + Math.abs(hit.point.y - y)).toBe(1)
      await settle(20000)
    }
  })

  test('with no damage, it attacks one of the cells the density model rates highest', async () => {
    for (let game = 0; game < 12; game++) {
      const { players, robot } = await setUp()
      const victim = players.find(player => player !== robot)
      const best = bestTargets(scoreTargets(buildShotState(victim))).map(key)
      const before = hitCells(victim)
      computerAttack(robot, players)
      await settle(1500)
      const [hit] = newlyHit(victim, before)
      expect(best).toContain(key(hit.point))
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
      computerAttack(robot, players)
      await settle(1500)
      expect(newlyHit(others[0], beforeFirst)).toHaveLength(0)
      expect(newlyHit(others[1], beforeSecond)).toHaveLength(1)
      await settle(20000)
    }
  })

  test('when nobody is damaged, it goes for the player with fewer hits left to sink, which has a sunk ship', async () => {
    for (let game = 0; game < 10; game++) {
      const { players, robot } = await setUp({ humans: 1, robots: 2 })
      const others = players.filter(player => player !== robot)
      const sunk = others[0].shipFleet[3]
      sunk.parts.forEach(part => { part.isHit = true })
      sunk.status = 0
      others[0].status = others[0].shipFleet.reduce((total, item) => total + item.status, 0) / others[0].shipFleet.length
      const beforeFirst = hitCells(others[0])
      const beforeSecond = hitCells(others[1])
      computerAttack(robot, players)
      await settle(1500)
      expect(newlyHit(others[0], beforeFirst)).toHaveLength(1)
      expect(newlyHit(others[1], beforeSecond)).toHaveLength(0)
      await settle(20000)
    }
  })

  test('it shows its thinking before the shot: one board is outlined, and nothing is hit until it is shown', async () => {
    const { players, robot } = await setUp({ humans: 1, robots: 2 })
    const opponents = players.filter(player => player !== robot)
    const before = opponents.map(hitCells)
    computerAttack(robot, players)
    expect(opponents.flatMap((player, i) => newlyHit(player, before[i]))).toHaveLength(0)
    await settle(500)
    expect(opponents.filter(player => player.board.children[0].element.style.borderColor === 'red')).toHaveLength(1)
    await settle(1500)
    expect(opponents.flatMap((player, i) => newlyHit(player, before[i]))).toHaveLength(1)
    await settle(20000)
  })
})
