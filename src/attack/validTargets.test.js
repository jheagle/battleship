/**
 * @jest-environment jsdom
 */

import matrixDom from 'matrix-dom'
import { useGameLifecycle, startGame, settle, click } from '../../tests/helpers/game'
import getAttackLock from './attackLock'

useGameLifecycle()

describe('valid targets for a human', () => {
  const tile = (player, x, y) => matrixDom.getDomItemFromPoint(matrixDom.point(x, y, 0), player.board).element
  const marked = player => matrixDom.getAllPoints(player.board).filter(p => p.z === 0)
    .filter(p => tile(player, p.x, p.y).className.includes('valid-target')).length

  test('during their turn, every cell they can still attack is marked', async () => {
    const { players: [human, robot] } = startGame({ humans: 1, robots: 1, firstGoesFirst: true })
    await settle()
    expect(human.attacker).toBe(true)
    expect(marked(robot)).toBe(100)
    expect(tile(robot, 3, 3).className).toContain('valid-target')
  })

  test('after a hit, that cell is no longer marked, and when the turn passes the marks are cleared', async () => {
    const { players: [human, robot] } = startGame({ humans: 1, robots: 1, firstGoesFirst: true })
    await settle()
    getAttackLock(robot).isLocked = false
    await click(matrixDom.getDomItemFromPoint(matrixDom.point(0, 0, 0), robot.board), 100)
    expect(human.attacker).toBe(false)
    expect(marked(robot)).toBe(0)
  })

  test('a player\'s own board is never marked during their turn', async () => {
    const { players: [human, robot] } = startGame({ humans: 1, robots: 1, firstGoesFirst: true })
    await settle()
    expect(human.attacker).toBe(true)
    expect(marked(human)).toBe(0)
    expect(marked(robot)).toBe(100)
  })
})
