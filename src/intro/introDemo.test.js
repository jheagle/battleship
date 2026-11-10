/**
 * @jest-environment jsdom
 */

import jsonDom from 'json-dom'
import gameRoot from '../setup/gameRoot'
import startMenu from '../setup/startMenu'
import { startNewGame } from '../setup/startNewGame'
import { DEMO_ROBOTS, RESTART_MS, stopIntroDemo } from './introDemo'
import { useGameLifecycle, settle } from '../../tests/helpers/game'
import attackListener from '../attack/attackListener'
import beginRound from '../setup/beginRound'
import hintListener from '../attack/hintListener'
import placementListener from '../setup/placementListener'
import presetListener from '../setup/presetListener'
import remoteListener from '../setup/remoteListener'
import shipsListener from '../attack/shipsListener'
import restart from '../setup/restart'
import playAgain from '../setup/playAgain'
import returnToLobby from '../setup/returnToLobby'

useGameLifecycle()

const listeners = { attackListener, beginRound, hintListener, placementListener, presetListener, remoteListener, shipsListener, restart, playAgain, returnToLobby }
const demo = () => document.querySelector('.intro-demo')
const demoShots = () => demo().querySelectorAll('[data-shot]').length
const pageWithMenu = () => {
  document.body.innerHTML = ''
  return startMenu(gameRoot(listeners))
}

afterEach(() => {
  stopIntroDemo()
  document.body.innerHTML = ''
})

describe('the intro demo', () => {
  test('robots play behind the menu, in a layer screen readers and the keyboard skip', async () => {
    pageWithMenu()
    expect(demo().getAttribute('aria-hidden')).toBe('true')
    expect(demo().hasAttribute('inert')).toBe(true)
    expect(demo().querySelectorAll('[role="grid"]')).toHaveLength(DEMO_ROBOTS)
    // ships shown, so the hits land on something visible
    expect(demo().querySelectorAll('[role="gridcell"][aria-label$=", ship"]').length).toBeGreaterThan(0)
    await settle(20000)
    expect(demoShots()).toBeGreaterThan(0)
  })

  test('starting a real game stops it', async () => {
    const root = pageWithMenu()
    await settle(5000)
    startNewGame(root, 0, 2, true, 'off')
    await settle(5000)
    expect(document.querySelector('main .main-menu')).toBeNull()
    expect(demo().children).toHaveLength(0)
    // and it stays stopped
    await settle(20000)
    expect(demo().children).toHaveLength(0)
  })

  test('showing the menu again starts a fresh one', async () => {
    const root = pageWithMenu()
    startNewGame(root, 0, 2, true, 'off')
    await settle(5000)
    expect(demo().children).toHaveLength(0)
    startMenu(root)
    expect(demo().querySelectorAll('[role="grid"]')).toHaveLength(DEMO_ROBOTS)
  })

  test('after a robot wins, the next demo game starts', async () => {
    pageWithMenu()
    const winner = () => [...demo().querySelectorAll('.player-stats')].some(stats => stats.textContent.includes('WINNER'))
    for (let i = 0; i < 400 && !winner(); i++) {
      await settle(2000)
    }
    expect(winner()).toBe(true)
    await settle(RESTART_MS + 1000)
    expect(winner()).toBe(false)
    expect(demo().querySelectorAll('[role="grid"]')).toHaveLength(DEMO_ROBOTS)
  })

  test('a quick menu -> game -> menu keeps exactly one demo running', async () => {
    const root = pageWithMenu()
    startNewGame(root, 0, 2, true, 'off')
    startMenu(root)
    expect(demo().querySelectorAll('[role="grid"]')).toHaveLength(DEMO_ROBOTS)
    await settle(20000)
    expect(demo().querySelectorAll('[role="grid"]')).toHaveLength(DEMO_ROBOTS)
    expect(demoShots()).toBeGreaterThan(0)
  })

  test('with prefers-reduced-motion it is a still frame: boards and ships, no shots', async () => {
    const original = window.matchMedia
    window.matchMedia = query => ({ matches: query === '(prefers-reduced-motion: reduce)', media: query, addEventListener () {}, removeEventListener () {} })
    try {
      pageWithMenu()
      expect(demo().querySelectorAll('[role="grid"]')).toHaveLength(DEMO_ROBOTS)
      expect(demo().querySelectorAll('[role="gridcell"][aria-label$=", ship"]').length).toBeGreaterThan(0)
      await settle(30000)
      expect(demoShots()).toBe(0)
    } finally {
      window.matchMedia = original
    }
  })

  test('the demo is its own game: the page root is not touched', () => {
    const root = pageWithMenu()
    expect(jsonDom.getChildrenByClass('boards', root.body)).toHaveLength(0)
    expect(jsonDom.getChildrenByClass('main-menu', root.body)).toHaveLength(1)
  })
})
