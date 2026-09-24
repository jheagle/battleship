/**
 * @jest-environment jsdom
 */

import { useGameLifecycle, startGame, settle, attacker, click, unhitWaterCells, victims, unhitShipCells } from '../../tests/helpers/game'

useGameLifecycle()

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
