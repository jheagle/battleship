/**
 * @jest-environment jsdom
 */

import playerSet from './playerSet'

describe('playerSet', () => {
  test('a new player is a healthy human who is not attacking and has done nothing yet', () => {
    const player = playerSet({}, 'Player 1')
    expect(player).toMatchObject({
      name: 'Player 1',
      isRobot: false,
      status: 100,
      turnCnt: 0,
      attacker: false,
      attacks: { hit: 0, miss: 0, sunk: 0 },
      shipFleet: [],
      attributes: { className: 'player' }
    })
  })

  test('with nothing given it is an unnamed player with an empty board', () => {
    const player = playerSet()
    expect(player.name).toBe('')
    expect(player.board).toEqual({})
  })

  test('the board is the first child, and players do not share their attack counts', () => {
    const board = { is: 'matrix' }
    const [one, two] = [playerSet(board, 'a'), playerSet(board, 'b')]
    expect(one.board).toBe(board)
    expect(one.children).toEqual([board])
    one.attacks.hit = 3
    expect(two.attacks.hit).toBe(0)
  })
})
