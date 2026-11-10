/**
 * @jest-environment jsdom
 */

import jsonDom from 'json-dom'
import gameRoot, { gameLayout } from './gameRoot'
import startMenu from './startMenu'

// The names the menu's buttons use (see main.ts), as stand-ins
const listeners = Object.fromEntries(['beginRound', 'attackListener', 'hintListener', 'placementListener', 'presetListener', 'remoteListener', 'remotePlayAgainListener', 'remoteLeaveListener', 'shipsListener', 'restart', 'playAgain', 'returnToLobby'].map(name => [name, jest.fn()]))

afterEach(() => { document.body.innerHTML = '' })

describe('gameRoot', () => {
  test('the page gets a header with its h1, then the main the game renders into', () => {
    const { header, main } = gameLayout(document)
    expect(document.body.firstElementChild).toBe(header)
    expect(header.nextElementSibling).toBe(main)
    expect(document.querySelectorAll('h1')).toHaveLength(1)
    expect(document.querySelector('h1').textContent).toBe('Battleship')
    expect(document.querySelector('h1').className).toBe('visually-hidden')
    expect(main.tagName).toBe('MAIN')
  })

  test('running it again reuses the landmarks instead of adding more', () => {
    const first = gameLayout(document)
    expect(gameLayout(document)).toEqual(first)
    expect(document.querySelectorAll('header, main, h1')).toHaveLength(3)
  })

  test('the menu, and everything after it, renders inside main, keeping the root -> body shape', () => {
    const root = startMenu(gameRoot(listeners))
    const main = document.querySelector('main')
    expect(root.body.element).toBe(main)
    expect(root.body.children.length).toBeGreaterThan(0)
    expect(main.querySelector('.main-menu')).not.toBeNull()
    expect(jsonDom.getChildrenByClass('main-menu', root.body)).toHaveLength(1)
    // nothing the game renders is left outside the landmarks
    expect([...document.body.children].map(child => child.tagName)).toEqual(['HEADER', 'MAIN'])
  })
})
