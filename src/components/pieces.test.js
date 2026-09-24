/**
 * @jest-environment jsdom
 */
import gamePieces from './pieces'

describe('tiles', () => {
  test('a water tile has no ship and has not been hit', () => {
    const tile = gamePieces.waterTile()
    expect(tile.hasShip).toBe(false)
    expect(tile.isHit).toBe(false)
  })

  test('each water tile is its own object', () => {
    const [first, second] = [gamePieces.waterTile(), gamePieces.waterTile()]
    expect(first).not.toBe(second)
    first.hasShip = true
    expect(second.hasShip).toBe(false)
  })

  test('ship and hit tiles only say what changes', () => {
    expect(gamePieces.shipTile()).toEqual({ hasShip: true })
    expect(gamePieces.hitTile()).toEqual({ isHit: true })
  })
})

describe('ship', () => {
  test('starts undamaged with no parts', () => {
    expect(gamePieces.ship('Cruiser')).toEqual({ name: 'Cruiser', status: 100, parts: [] })
  })

  test('has an empty name unless given one', () => {
    expect(gamePieces.ship().name).toBe('')
  })
})

describe('playerSet', () => {
  test('a new player is a healthy human who is not attacking and has done nothing yet', () => {
    const player = gamePieces.playerSet({}, 'Player 1')
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
    const player = gamePieces.playerSet()
    expect(player.name).toBe('')
    expect(player.board).toEqual({})
  })

  test('the board is the first child, and players do not share their attack counts', () => {
    const board = { is: 'matrix' }
    const [one, two] = [gamePieces.playerSet(board, 'a'), gamePieces.playerSet(board, 'b')]
    expect(one.board).toBe(board)
    expect(one.children).toEqual([board])
    one.attacks.hit = 3
    expect(two.attacks.hit).toBe(0)
  })
})

describe('playerStats', () => {
  const player = {
    name: 'Player 1',
    shipFleet: [
      { name: 'Aircraft Carrier', status: 80, parts: [1, 2, 3, 4, 5] },
      { name: 'Destroyer', status: 100 / 3, parts: [1, 2] }
    ]
  }

  test('shows the player name and status, then a line for every ship', () => {
    const stats = gamePieces.playerStats(player, '90%')
    expect(stats.children[0].attributes.innerHTML).toBe('<strong>Player 1</strong>: 90%')
    expect(stats.children[1].children).toHaveLength(2)
  })

  test('each ship line has its name, size and status rounded to two places', () => {
    const lines = gamePieces.playerStats(player, '').children[1].children.map(item => item.attributes.innerHTML)
    expect(lines).toEqual([
      '<strong>Aircraft Carrier (5):</strong> 80%',
      '<strong>Destroyer (2):</strong> 33.33%'
    ])
  })
})
