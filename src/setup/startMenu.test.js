/**
 * @jest-environment jsdom
 */

import jsonDom from 'json-dom'
import { useGameLifecycle, startGame } from '../../tests/helpers/game'
import beginRound from './beginRound'
import startMenu from './startMenu'

useGameLifecycle()

describe('setup: main menu', () => {
  test('main puts the menu on an otherwise empty page and returns the document', () => {
    const doc = jsonDom.documentDomItem({ beginRound })
    doc.body.children.push()
    const result = startMenu(doc)
    expect(result).toBe(doc)
    expect(doc.body.children).toHaveLength(1)
    expect(jsonDom.getChildrenByClass('main-menu', doc.body)).toHaveLength(1)
  })

  test('main clears whatever was on the page before, so calling it again starts over', () => {
    const { doc } = startGame({ humans: 2 })
    expect(jsonDom.getChildrenByClass('boards', doc.body)).toHaveLength(1)
    startMenu(doc)
    expect(jsonDom.getChildrenByClass('boards', doc.body)).toHaveLength(0)
    expect(jsonDom.getChildrenByClass('main-menu', doc.body)).toHaveLength(1)
  })

  test('the form starts at 0 humans, 0 robots', () => {
    const doc = startMenu(jsonDom.documentDomItem({ beginRound }))
    const form = jsonDom.getChildrenByClass('main-menu-form', doc.body)[0]
    expect(jsonDom.getChildrenByName('human-players', form)[0].element.value).toBe('0')
    expect(jsonDom.getChildrenByName('robot-players', form)[0].element.value).toBe('0')
    expect(jsonDom.getChildrenByName('first-go-first', form)[0].element.checked).toBe(false)
  })
})
