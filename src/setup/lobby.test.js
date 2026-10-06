/**
 * @jest-environment jsdom
 */

import jsonDom from 'json-dom'
import { useGameLifecycle, startGame, settle } from '../../tests/helpers/game'
import startMenu from './startMenu'
import beginRound from './beginRound'
import presetListener from './presetListener'
import attackListener from '../attack/attackListener'
import hintListener from '../attack/hintListener'
import placementListener from './placementListener'
import restart from './restart'

useGameLifecycle()

describe('the lobby', () => {
  const openMenu = () => startMenu(jsonDom.documentDomItem({ beginRound, presetListener, attackListener, hintListener, placementListener, restart }))
  const menuItem = (doc, name) => jsonDom.getChildrenByClass(name, doc.body)[0]
  const lobby = doc => menuItem(doc, 'main-menu-form')
  const field = (doc, name) => jsonDom.getChildrenByName(name, lobby(doc))[0].element

  test('the entry screen shows the game types first, and the lobby is hidden', () => {
    const doc = openMenu()
    expect(menuItem(doc, 'preset-solo')).toBeDefined()
    expect(lobby(doc).element.style.display).toBe('none')
  })

  test.each([
    ['preset-solo', '1', '1'],
    ['preset-multi', '2', '0'],
    ['preset-robots', '0', '2']
  ])('%s fills in the lobby with its humans and robots, and reveals it', (preset, humans, robots) => {
    const doc = openMenu()
    menuItem(doc, preset).element.click()
    expect(lobby(doc).element.style.display).toBe('')
    expect(field(doc, 'human-players').value).toBe(humans)
    expect(field(doc, 'robot-players').value).toBe(robots)
  })

  test('Back hides the lobby and shows the game types again', () => {
    const doc = openMenu()
    menuItem(doc, 'preset-multi').element.click()
    menuItem(doc, 'lobby-back').element.click()
    expect(lobby(doc).element.style.display).toBe('none')
    expect(menuItem(doc, 'presets').element.style.display).toBe('')
  })

  test('the hint setting is chosen in the lobby; Optional is the default', () => {
    const doc = openMenu()
    menuItem(doc, 'preset-solo').element.click()
    expect(field(doc, 'hint-setting').value).toBe('optional')
  })

  test.each([
    ['off', 0],
    ['optional', 2],
    ['on', 0]
  ])('with hints %s, there are %i hint checkboxes (one per human when optional)', async (hints, checkboxes) => {
    startGame({ humans: 2, placing: true, hints })
    await settle()
    expect(document.querySelectorAll('input[type=checkbox]')).toHaveLength(checkboxes)
  })

  test('with hints on for everyone, every human has the hint on from the start', async () => {
    const { players } = startGame({ humans: 2, hints: 'on' })
    await settle()
    players.forEach(player => expect(player.showHint).toBe(true))
  })

  test('robots can be added to a multiplayer game', async () => {
    const { players } = startGame({ humans: 2, robots: 2 })
    await settle()
    expect(players).toHaveLength(4)
    expect(players.filter(player => player.isRobot)).toHaveLength(2)
  })

  test('robots can be added to a one-player game', async () => {
    const { players } = startGame({ humans: 1, robots: 3 })
    await settle()
    expect(players).toHaveLength(4)
  })

  test('more than four humans is refused, so no game starts', async () => {
    const { players } = startGame({ humans: 5 })
    await settle()
    expect(players).toHaveLength(0)
  })

  test('more than six players in all is refused', async () => {
    const { players } = startGame({ humans: 4, robots: 3 })
    await settle()
    expect(players).toHaveLength(0)
  })
})
