/**
 * @jest-environment jsdom
 */

import playerStats from './playerStats'

describe('playerStats', () => {
  const player = {
    name: 'Player 1',
    colour: '#ff6b6b',
    shipFleet: [
      { name: 'Aircraft Carrier', status: 80, parts: [1, 2, 3, 4, 5] },
      { name: 'Destroyer', status: 100 / 3, parts: [1, 2] }
    ]
  }

  const shipList = stats => stats.children.find(child => child.nodeName === 'ul')

  test('shows the player name and status, then a line for every ship', () => {
    const stats = playerStats(player, '90%')
    expect(stats.children[0].attributes.innerHTML).toBe('<strong style="color: #ff6b6b">Player 1</strong>: 90%')
    expect(shipList(stats).children).toHaveLength(2)
  })

  test('each ship line has its name, size and status rounded to two places', () => {
    const lines = shipList(playerStats(player, '')).children.map(item => item.attributes.innerHTML)
    expect(lines).toEqual([
      '<strong>Aircraft Carrier (5):</strong> 80%',
      '<strong>Destroyer (2):</strong> 33.33%'
    ])
  })

  test('a human has the heat-hint checkbox, a robot does not', () => {
    const hasCheckbox = stats => (stats.children.find(child => child.attributes.className === 'player-controls') || { children: [] }).children.some(child => child.nodeName === 'label')
    expect(hasCheckbox(playerStats({ ...player, isRobot: false }, ''))).toBe(true)
    expect(hasCheckbox(playerStats({ ...player, isRobot: true }, ''))).toBe(false)
  })
})
