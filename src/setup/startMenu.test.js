/**
 * @jest-environment jsdom
 */

import presetListener from './presetListener'
import remoteListener from './remoteListener'
import treeloom from 'treeloom'
import { useGameLifecycle, startGame } from '../../tests/helpers/game'
import beginRound from './beginRound'
import startMenu from './startMenu'

useGameLifecycle()

describe('setup: main menu', () => {
  test('main puts the menu on an otherwise empty page and returns the document', () => {
    const doc = treeloom.documentDomItem({ beginRound, presetListener, remoteListener })
    doc.body.children.push()
    const result = startMenu(doc)
    expect(result).toBe(doc)
    expect(doc.body.children).toHaveLength(1)
    expect(treeloom.getChildrenByClass('main-menu', doc.body)).toHaveLength(1)
  })

  test('main clears whatever was on the page before, so calling it again starts over', () => {
    const { doc } = startGame({ humans: 2 })
    expect(treeloom.getChildrenByClass('boards', doc.body)).toHaveLength(1)
    startMenu(doc)
    expect(treeloom.getChildrenByClass('boards', doc.body)).toHaveLength(0)
    expect(treeloom.getChildrenByClass('main-menu', doc.body)).toHaveLength(1)
  })

  test('the form starts at 0 humans, 0 robots', () => {
    const doc = startMenu(treeloom.documentDomItem({ beginRound, presetListener, remoteListener }))
    const form = treeloom.getChildrenByClass('main-menu-form', doc.body)[0]
    expect(treeloom.getChildrenByName('human-players', form)[0].element.value).toBe('0')
    expect(treeloom.getChildrenByName('robot-players', form)[0].element.value).toBe('0')
    expect(treeloom.getChildrenByName('first-go-first', form)[0].element.checked).toBe(false)
  })
})
