/**
 * @jest-environment jsdom
 */

import matrixDom from 'matrix-dom'
import { useGameLifecycle, startGame, settle, click } from '../../tests/helpers/game'

useGameLifecycle()

describe('the placement phase', () => {
  const setUp = async () => {
    const { players } = startGame({ humans: 2, placing: true })
    await settle()
    return players
  }
  const tile = (player, x, y) => matrixDom.getDomItemFromPoint(matrixDom.point(x, y, 0), player.board)
  const place = async (player, from, to) => {
    await click(tile(player, ...from), 0)
    await click(tile(player, ...to), 0)
  }
  const panel = () => document.querySelector('.placement')
  const message = () => document.querySelector('.placement-message').textContent
  const button = name => document.querySelector(`.${name}`)
  const shown = name => button(name).style.display !== 'none'
  const fleetPlacement = [[[0, 0], [4, 0]], [[0, 1], [3, 1]], [[0, 2], [2, 2]], [[0, 3], [2, 3]], [[0, 4], [1, 4]]]

  test('starts with a handoff for the first player: the others look away, and only Continue is shown', async () => {
    const [first, second] = await setUp()
    expect(message()).toContain('Player 1')
    expect(shown('placement-continue')).toBe(true)
    expect(button('placement-continue').textContent).toBe('Continue')
    expect(button('placement-randomise').textContent).toBe('Randomise')
    expect(button('placement-done').textContent).toBe('Done')
    expect(shown('placement-randomise')).toBe(false)
    expect(first.element.style.display).toBe('none')
    expect(second.element.style.display).toBe('none')
  })

  test('after Continue, the player places ships, and Done waits for every ship', async () => {
    await setUp()
    button('placement-continue').click()
    expect(shown('placement-randomise')).toBe(true)
    expect(button('placement-done').disabled).toBe(true)
    expect(message()).toContain('Aircraft Carrier')
  })

  test('a valid start and end places the ship; an invalid one is refused', async () => {
    const [first] = await setUp()
    button('placement-continue').click()
    await place(first, [0, 0], [2, 3])
    expect(first.shipFleet).toHaveLength(0)
    expect(message()).toContain('not a valid place for the Aircraft Carrier')
    await place(first, [0, 0], [4, 0])
    expect(first.shipFleet).toHaveLength(1)
    expect(message()).toContain('Battleship')
  })

  test('clicks on the other player\'s board are ignored while this player places', async () => {
    const [first, second] = await setUp()
    button('placement-continue').click()
    await place(second, [0, 0], [4, 0])
    expect(second.shipFleet).toHaveLength(0)
    expect(first.shipFleet).toHaveLength(0)
  })

  test('a full fleet placed by hand, then Done, hands over to the next player', async () => {
    const [first, second] = await setUp()
    button('placement-continue').click()
    for (const [from, to] of fleetPlacement) {
      await place(first, from, to)
    }
    expect(first.shipFleet.map(ship => ship.parts.length)).toEqual([5, 4, 3, 3, 2])
    expect(button('placement-done').disabled).toBe(false)
    button('placement-done').click()
    expect(message()).toContain('Player 2')
    expect(second.element.style.display).toBe('none')
  })

  test('Randomise places the whole fleet at once, and Done is then available', async () => {
    const [first] = await setUp()
    button('placement-continue').click()
    button('placement-randomise').click()
    expect(first.shipFleet.map(ship => ship.parts.length)).toEqual([5, 4, 3, 3, 2])
    expect(button('placement-done').disabled).toBe(false)
  })

  test('Done with ships still to place does nothing', async () => {
    const [first] = await setUp()
    button('placement-continue').click()
    button('placement-done').click()
    expect(panel().style.display).not.toBe('none')
    expect(first.shipFleet).toHaveLength(0)
  })

  test('stats are hidden during placement', async () => {
    const [first, second] = await setUp()
    expect(first.playerStats.element.style.display).toBe('none')
    expect(second.playerStats.element.style.display).toBe('none')
    button('placement-continue').click()
    button('placement-randomise').click()
    expect(first.playerStats.element.style.display).toBe('none')
  })

  test('after the last player is done, everyone is asked to confirm, with no board or ship showing', async () => {
    const [first, second] = await setUp()
    button('placement-continue').click()
    button('placement-randomise').click()
    button('placement-done').click()
    button('placement-continue').click()
    button('placement-randomise').click()
    button('placement-done').click()
    expect(panel().style.display).not.toBe('none')
    expect(message()).toContain('All players are ready')
    expect(first.element.style.display).toBe('none')
    expect(second.element.style.display).toBe('none')
    first.shipFleet.forEach(ship => ship.parts.forEach(part => {
      expect(matrixDom.getDomItemFromPoint(part.point, first.board).element.style.backgroundColor).toBe('')
    }))
  })

  test('Continue on the ready screen starts the round, with every board and stats shown', async () => {
    const [first, second] = await setUp()
    button('placement-continue').click()
    button('placement-randomise').click()
    button('placement-done').click()
    button('placement-continue').click()
    button('placement-randomise').click()
    button('placement-done').click()
    button('placement-continue').click()
    expect(panel().style.display).toBe('none')
    expect(first.element.style.display).toBe('')
    expect(second.element.style.display).toBe('')
    expect(first.playerStats.element.style.display).toBe('')
    expect(first.attacker || second.attacker).toBe(true)
  })

  test('once a player is done, their ships are no longer shown', async () => {
    const [first] = await setUp()
    button('placement-continue').click()
    button('placement-randomise').click()
    const partPoint = first.shipFleet[0].parts[0].point
    expect(matrixDom.getDomItemFromPoint(partPoint, first.board).element.style.backgroundColor).not.toBe('')
    button('placement-done').click()
    const shipPoints = first.shipFleet.flatMap(ship => ship.parts.map(part => part.point))
    shipPoints.forEach(point => {
      expect(matrixDom.getDomItemFromPoint(point, first.board).element.style.backgroundColor).toBe('')
    })
  })

  test('after a start is chosen, only the cells where the ship could end are marked, and the message says how to cancel', async () => {
    const [first] = await setUp()
    button('placement-continue').click()
    await click(tile(first, 0, 0), 0)
    const marked = matrixDom.getAllPoints(first.board).filter(p => p.z === 0)
      .filter(p => tile(first, p.x, p.y).element.className.includes('valid-end')).map(p => `${p.x},${p.y}`)
    expect(marked.sort()).toEqual(['0,4', '4,0'])
    expect(message()).toContain('Click the start again to cancel')
  })

  test('clicking the start again cancels, and the marks go', async () => {
    const [first] = await setUp()
    button('placement-continue').click()
    await click(tile(first, 0, 0), 0)
    await click(tile(first, 0, 0), 0)
    const marked = matrixDom.getAllPoints(first.board).filter(p => p.z === 0)
      .filter(p => tile(first, p.x, p.y).element.className.includes('valid-end'))
    expect(marked).toHaveLength(0)
    expect(first.shipFleet).toHaveLength(0)
  })
})
