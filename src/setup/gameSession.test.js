/**
 * @jest-environment jsdom
 */

import { useGameLifecycle, startGame, settle } from '../../tests/helpers/game'
import getAttackLock from '../attack/attackLock'
import { getGameMode, getHintSetting, setGameMode, setHintSetting } from './gameOptions'

useGameLifecycle()

// Two games played one after another still end up as two separate DomItemRoots, each with its own session (see
// gameSession.ts) - this is what actually lets a lobby server run more than one room's game at once: nothing in the
// engine is shared between them any more. Each game's own players stay valid DomItems after the next game starts,
// since starting a new game never mutates or replaces the previous one's root, only builds a fresh one.
describe('two different games', () => {
  test('keep independent attack locks', async () => {
    const { players: playersA } = startGame({ humans: 1, robots: 1 })
    await settle()
    const { players: playersB } = startGame({ humans: 1, robots: 1 })
    await settle()

    getAttackLock(playersA[0]).isLocked = true
    expect(getAttackLock(playersB[0]).isLocked).toBe(false)

    getAttackLock(playersB[0]).isLocked = true
    expect(getAttackLock(playersA[0]).isLocked).toBe(true)
  })

  test('keep independent lobby settings', async () => {
    const { players: playersA } = startGame({ humans: 1, robots: 1 })
    await settle()
    const { players: playersB } = startGame({ humans: 1, robots: 1 })
    await settle()

    setHintSetting(playersA[0], 'on')
    setHintSetting(playersB[0], 'off')
    setGameMode(playersA[0], 'multi')
    setGameMode(playersB[0], 'robots')

    expect(getHintSetting(playersA[0])).toBe('on')
    expect(getHintSetting(playersB[0])).toBe('off')
    expect(getGameMode(playersA[0])).toBe('multi')
    expect(getGameMode(playersB[0])).toBe('robots')
  })
})
