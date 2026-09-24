/**
 * @jest-environment jsdom
 */

import playerStats from './playerStats'

describe('playerStats', () => {
  const player = {
    name: 'Player 1',
    shipFleet: [
      { name: 'Aircraft Carrier', status: 80, parts: [1, 2, 3, 4, 5] },
      { name: 'Destroyer', status: 100 / 3, parts: [1, 2] }
    ]
  }

  test('shows the player name and status, then a line for every ship', () => {
    const stats = playerStats(player, '90%')
    expect(stats.children[0].attributes.innerHTML).toBe('<strong>Player 1</strong>: 90%')
    expect(stats.children[1].children).toHaveLength(2)
  })

  test('each ship line has its name, size and status rounded to two places', () => {
    const lines = playerStats(player, '').children[1].children.map(item => item.attributes.innerHTML)
    expect(lines).toEqual([
      '<strong>Aircraft Carrier (5):</strong> 80%',
      '<strong>Destroyer (2):</strong> 33.33%'
    ])
  })
})
