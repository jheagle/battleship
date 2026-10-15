/**
 * @jest-environment jsdom
 */

import { useGameLifecycle, startGame, settle, click, unhitWaterCells } from '../../tests/helpers/game'
import getAttackLock from './attackLock'
import { applyLocalPlayerView } from './localPlayerView'

useGameLifecycle()

const classNameOf = player => player.element.className

describe('applyLocalPlayerView', () => {
  test('the viewer is role-own, a live opponent is role-target on the viewer\'s turn, everyone else role-summary', async () => {
    const { players: [viewer, target, eliminated] } = startGame({ humans: 1, robots: 2 })
    await settle()
    viewer.attacker = true
    eliminated.status = 0
    applyLocalPlayerView([viewer, target, eliminated], viewer)
    expect(classNameOf(viewer)).toBe('player role-own')
    expect(classNameOf(target)).toBe('player role-target')
    expect(classNameOf(eliminated)).toBe('player role-summary')
  })

  test('a null viewer marks every player role-summary - nobody is "own"', async () => {
    const { players } = startGame({ humans: 0, robots: 3 })
    await settle()
    applyLocalPlayerView(players, null)
    players.forEach(player => expect(classNameOf(player)).toBe('player role-summary'))
  })
})

describe('solo mode: the human is a fixed "own", never recomputed by turn', () => {
  test('the human is role-own, live robots are role-target while the human is attacking', async () => {
    const { players: [human, ...robots] } = startGame({ humans: 1, robots: 2, firstGoesFirst: true })
    await settle()
    expect(human.attacker).toBe(true)
    expect(classNameOf(human)).toBe('player role-own')
    robots.forEach(robot => expect(classNameOf(robot)).toBe('player role-target'))
  })

  test('the human stays role-own even once it is not their turn', async () => {
    const { players: [human, robot1] } = startGame({ humans: 1, robots: 1, firstGoesFirst: true })
    await settle()
    getAttackLock(robot1).isLocked = false
    await click(unhitWaterCells(robot1)[0], 100)
    expect(human.attacker).toBe(false)
    expect(classNameOf(human)).toBe('player role-own')
    expect(classNameOf(robot1)).toBe('player role-summary')
  })
})

describe('robots-only mode: nobody is "own", ever', () => {
  test('every player is role-summary from the start, regardless of whose turn it is', async () => {
    const { players } = startGame({ humans: 0, robots: 3 })
    await settle()
    players.forEach(player => expect(classNameOf(player)).toBe('player role-summary'))
  })
})

describe('hot-seat mode: "own" follows whoever currently has the turn', () => {
  test('the first attacker is role-own; the other player is role-target', async () => {
    const { players: [p1, p2] } = startGame({ humans: 2, firstGoesFirst: true })
    await settle()
    expect(p1.attacker).toBe(true)
    expect(classNameOf(p1)).toBe('player role-own')
    expect(classNameOf(p2)).toBe('player role-target')
  })

  test('role-own moves to the next player once the turn passes', async () => {
    const { players: [p1, p2] } = startGame({ humans: 2, firstGoesFirst: true })
    await settle()
    getAttackLock(p1).isLocked = false
    await click(unhitWaterCells(p2)[0], 100)
    expect(p2.attacker).toBe(true)
    expect(classNameOf(p2)).toBe('player role-own')
    expect(classNameOf(p1)).toBe('player role-target')
  })
})
