/**
 * @jest-environment jsdom
 */
import getBrokenShipsPlayers from './getBrokenShipsPlayers'

describe('getBrokenShipsPlayers', () => {
  test('keeps players with at least one damaged ship', () => {
    const players = [
      { name: 'healthy', shipFleet: [{ status: 100 }, { status: 100 }] },
      { name: 'damaged', shipFleet: [{ status: 100 }, { status: 60 }] },
      { name: 'sunk only', shipFleet: [{ status: 0 }, { status: 100 }] }
    ]
    expect(getBrokenShipsPlayers(players).map(player => player.name)).toEqual(['damaged'])
  })
})
