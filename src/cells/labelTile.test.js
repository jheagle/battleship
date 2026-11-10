/**
 * @jest-environment jsdom
 */

import matrixDom from 'matrix-dom'
import labelTile, { coordinateName, labelBoard, tileLabel } from './labelTile'
import updatePlayerStats from '../attack/updatePlayerStats'
import { useGameLifecycle, startGame, settle, twoHumans, victims, attacker, unhitShipCells, unhitWaterCells, cells } from '../../tests/helpers/game'

useGameLifecycle()

const tileWith = (x, y, backgroundColor) => ({ point: { x, y, z: 0 }, attributes: backgroundColor ? { style: { backgroundColor } } : {} })
const press = (element, key) => element.dispatchEvent(new window.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))

describe('labelTile', () => {
  test('coordinates read the way players call them: column letter, row number', () => {
    expect(coordinateName({ x: 0, y: 0 })).toBe('A1')
    expect(coordinateName({ x: 1, y: 3 })).toBe('B4')
    expect(coordinateName({ x: 9, y: 9 })).toBe('J10')
  })

  test('the name says what the colour shows, and only that', () => {
    expect(tileLabel(tileWith(1, 3))).toBe('B4')
    expect(tileLabel(tileWith(1, 3, 'white'))).toBe('B4, miss')
    expect(tileLabel(tileWith(1, 3, 'red'))).toBe('B4, hit')
    expect(tileLabel(tileWith(1, 3, '#777'))).toBe('B4, ship')
    // a hidden ship looks like water, so it is named like water
    expect(tileLabel({ ...tileWith(1, 3), hasShip: true })).toBe('B4')
  })

  test('only tiles are labelled', () => {
    const panel = { attributes: {} }
    expect(labelTile(panel).attributes['aria-label']).toBeUndefined()
    expect(labelTile(tileWith(2, 0)).attributes['aria-label']).toBe('C1')
  })
})

describe('the boards in a game', () => {
  test('each board is a named, keyboard navigable grid, each tile named by its coordinate', async () => {
    const { players } = startGame({ humans: 2 })
    await settle()
    players.forEach(player => {
      expect(player.board.element.getAttribute('role')).toBe('grid')
      expect(player.board.element.getAttribute('aria-label')).toBe(`${player.name}'s board`)
      expect(player.board.element.querySelectorAll('[role="gridcell"]').length).toBe(100)
      expect(player.board.element.querySelectorAll('[tabindex="0"]').length).toBe(1)
    })
    const tile = matrixDom.getDomItemFromPoint(matrixDom.point(1, 3, 0), players[0].board)
    expect(tile.element.getAttribute('aria-label')).toBe('B4')
  })

  test('renaming a player renames their board', async () => {
    const { players: [one] } = await twoHumans()
    one.name = 'Ada'
    updatePlayerStats(one)
    expect(one.board.element.getAttribute('aria-label')).toBe('Ada\'s board')
    expect(labelBoard(one).board.attributes['aria-label']).toBe('Ada\'s board')
  })

  test('Enter on a focused cell attacks it, like a click, and its name says the result', async () => {
    const { players } = await twoHumans()
    const victim = victims(players)[0]
    expect(attacker(players)).not.toBe(victim)
    const water = unhitWaterCells(victim)[0]
    water.element.focus()
    press(water.element, 'Enter')
    await settle()
    expect(water.isHit).toBe(true)
    expect(water.element.getAttribute('aria-label')).toBe(`${coordinateName(water.point)}, miss`)
  })

  test('a hit ship is named a hit, an unhit hidden ship is never named a ship', async () => {
    const { players } = await twoHumans()
    const victim = victims(players)[0]
    const [hitShip, hiddenShip] = unhitShipCells(victim)
    hitShip.element.click()
    await settle()
    expect(hitShip.element.getAttribute('aria-label')).toBe(`${coordinateName(hitShip.point)}, hit`)
    expect(hiddenShip.element.getAttribute('aria-label')).toBe(coordinateName(hiddenShip.point))
    expect(cells(victim).filter(cell => /ship/.test(cell.element.getAttribute('aria-label')))).toEqual([])
  })

  test('when placement ends, keyboard focus starts on a board the player can attack, not on the hidden Done button', async () => {
    const { players } = startGame({ humans: 1, robots: 1 })
    await settle()
    const target = players.find(player => !player.attacker)
    expect(document.activeElement.getAttribute('role')).toBe('gridcell')
    expect(target.board.element.contains(document.activeElement)).toBe(true)
  })
})
