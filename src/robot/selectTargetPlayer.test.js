/**
 * @jest-environment jsdom
 */
import { useGameLifecycle, startGame, settle } from '../../tests/helpers/game'
import selectTargetPlayer from './selectTargetPlayer'

useGameLifecycle()

describe('selectTargetPlayer', () => {
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

  test('uses the elimination rule by default: fewer hits left to sink', async () => {
    const players = await setUp()
    sink(players[1])
    for (let i = 0; i < 10; i++) {
      expect(selectTargetPlayer(players)).toBe(players[1])
    }
  })

  test('with nothing to tell them apart, any of them is chosen', async () => {
    const players = await setUp()
    expect(players).toContain(selectTargetPlayer(players))
  })

  test('a player with no ships left is not chosen while others are still afloat', async () => {
    const players = await setUp()
    players[0].status = 0
    for (let i = 0; i < 10; i++) {
      expect(selectTargetPlayer(players)).not.toBe(players[0])
    }
  })

  test('a different rule can be passed in for another game style', async () => {
    const players = await setUp()
    const last = list => list[list.length - 1]
    expect(selectTargetPlayer(players, last)).toBe(players[2])
  })
})
