/**
 * @jest-environment jsdom
 */

import matrixDom from 'matrix-dom'
import { useGameLifecycle, startGame, settle, click, unhitWaterCells } from '../../tests/helpers/game'
import attackLock from './attackLock'

useGameLifecycle()

describe('the heat-map hint for a human', () => {
  const setUp = async () => {
    const { players } = startGame({ humans: 1, robots: 1, firstGoesFirst: true })
    await settle()
    const [human, robot] = players
    const checkbox = document.querySelector('input[type=checkbox]')
    return { human, robot, checkbox }
  }
  const borderOf = (player, x, y) => matrixDom.getDomItemFromPoint(matrixDom.point(x, y, 0), player.board).element.style.borderColor
  const isShaded = color => color.includes('255, 215, 0')
  const tick = checkbox => {
    checkbox.checked = !checkbox.checked
    checkbox.dispatchEvent(new Event('change'))
  }

  test('only the human\'s panel has the hint checkbox', async () => {
    await setUp()
    expect(document.querySelectorAll('input[type=checkbox]')).toHaveLength(1)
  })

  test('switched on during their turn, it shades the cells of the board they attack', async () => {
    const { human, robot, checkbox } = await setUp()
    expect(human.attacker).toBe(true)
    expect(isShaded(borderOf(robot, 4, 4))).toBe(false)
    tick(checkbox)
    await settle(1000)
    expect(human.showHint).toBe(true)
    expect(isShaded(borderOf(robot, 4, 4))).toBe(true)
  })

  test('switched off during their turn, the shading goes', async () => {
    const { robot, checkbox } = await setUp()
    tick(checkbox)
    await settle(1000)
    tick(checkbox)
    await settle(1000)
    expect(isShaded(borderOf(robot, 4, 4))).toBe(false)
  })

  test('when the turn passes, the shading is cleared from the board they attacked', async () => {
    const { human, robot, checkbox } = await setUp()
    tick(checkbox)
    await settle(1000)
    expect(isShaded(borderOf(robot, 4, 4))).toBe(true)
    attackLock.isLocked = false
    await click(unhitWaterCells(robot)[0], 100) // the queued turn-end steps run in order, so give them a moment; the robot's turn then returns it
    expect(human.attacker).toBe(false)
    expect(isShaded(borderOf(robot, 4, 4))).toBe(false)
  })
})
