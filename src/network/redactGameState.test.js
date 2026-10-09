/**
 * @jest-environment jsdom
 */

import matrixDom from 'matrix-dom'
import { useGameLifecycle, startGame, settle } from '../../tests/helpers/game'
import { redactBoard, redactGameBody, redactGameState, redactPlayer } from './redactGameState'
import remoteFinalScore from '../components/layout/remoteFinalScore'

useGameLifecycle()

describe('redacting the game state for a remote viewer', () => {
  const setUp = async () => {
    const { players } = startGame({ humans: 2 })
    await settle()
    return players
  }

  const shipCells = player => player.shipFleet.flatMap(ship => ship.parts.map(part => ({ x: part.point.x, y: part.point.y })))

  const hasShipAt = (board, x, y) => (matrixDom.getDomItemFromPoint(matrixDom.point(x, y, 0), board)).hasShip
  const isHitAt = (board, x, y) => (matrixDom.getDomItemFromPoint(matrixDom.point(x, y, 0), board)).isHit

  test('a viewer sees their own unattacked ship positions', async () => {
    const [viewer] = await setUp()
    const redacted = redactBoard(viewer.board, true)
    shipCells(viewer).forEach(({ x, y }) => {
      expect(hasShipAt(redacted, x, y)).toBe(true)
    })
  })

  test('a viewer does not see another player\'s unattacked ship positions, but every cell is still there', async () => {
    const [viewer, other] = await setUp()
    const redacted = redactBoard(other.board, false)
    shipCells(other).forEach(({ x, y }) => {
      expect(hasShipAt(redacted, x, y)).toBe(false)
    })
    // every cell is still accounted for: 100 cells, none dropped just because they are hidden
    expect(matrixDom.getAllPoints(redacted).filter(p => p.z === 0)).toHaveLength(100)
  })

  test('a hit cell shows its ship on any board, even one the viewer does not own', async () => {
    const [viewer, other] = await setUp()
    const part = other.shipFleet[0].parts[0]
    matrixDom.getDomItemFromPoint(part.point, other.board).isHit = true
    const redacted = redactBoard(other.board, false)
    expect(isHitAt(redacted, part.point.x, part.point.y)).toBe(true)
    expect(hasShipAt(redacted, part.point.x, part.point.y)).toBe(true)
  })

  test('a miss stays a miss: isHit is true but hasShip is false, on any board', async () => {
    const [viewer, other] = await setUp()
    const miss = matrixDom.getAllPoints(other.board).filter(p => p.z === 0).find(p => !shipCells(other).some(s => s.x === p.x && s.y === p.y))
    matrixDom.getDomItemFromPoint(miss, other.board).isHit = true
    const redacted = redactBoard(other.board, false)
    expect(isHitAt(redacted, miss.x, miss.y)).toBe(true)
    expect(hasShipAt(redacted, miss.x, miss.y)).toBe(false)
  })

  test('an unhit ship\'s baked-in colour is cleared too - not just hasShip, so position never leaks through colour', async () => {
    const [viewer, other] = await setUp()
    // setViewShip bakes a grey backgroundColor onto a ship tile's own attributes the moment it is placed by
    // hand (src/cells/setViewShip.ts) - set directly here, the same way the existing isHit-based tests above set
    // their own scenario directly rather than driving the whole placement UI just to reach one specific state.
    const part = other.shipFleet[0].parts[0]
    const realTile = matrixDom.getDomItemFromPoint(part.point, other.board)
    realTile.attributes.style = { ...realTile.attributes.style, backgroundColor: '#777' }

    const redacted = redactBoard(other.board, false)
    expect(matrixDom.getDomItemFromPoint(part.point, redacted).attributes.style.backgroundColor).toBeUndefined()
  })

  test('a hit cell keeps its own colour untouched when redacted for someone else', async () => {
    const [viewer, other] = await setUp()
    const part = other.shipFleet[0].parts[0]
    const realTile = matrixDom.getDomItemFromPoint(part.point, other.board)
    realTile.attributes.style = { ...realTile.attributes.style, backgroundColor: 'red' }
    realTile.isHit = true
    const redacted = redactBoard(other.board, false)
    expect(matrixDom.getDomItemFromPoint(part.point, redacted).attributes.style.backgroundColor).toBe('red')
  })

  test('redacting a board does not change the real board it was redacted from', async () => {
    const [viewer, other] = await setUp()
    redactBoard(other.board, false)
    shipCells(other).forEach(({ x, y }) => {
      expect(hasShipAt(other.board, x, y)).toBe(true)
    })
  })

  test('a player\'s fleet is reduced to name, length and status - never ship part positions', async () => {
    const [viewer] = await setUp()
    const redacted = redactPlayer(viewer, viewer)
    redacted.shipFleet.forEach((ship, i) => {
      expect(Object.keys(ship).sort()).toEqual(['name', 'parts', 'status'])
      expect(ship.parts).toHaveLength(viewer.shipFleet[i].parts.length)
    })
    expect(JSON.stringify(redacted.shipFleet)).not.toMatch(/"point"|"x"|"y"/)
  })

  test('a player\'s public fields pass through unchanged, whoever is viewing', async () => {
    const [viewer, other] = await setUp()
    const redacted = redactPlayer(other, viewer)
    expect(redacted.name).toBe(other.name)
    expect(redacted.colour).toBe(other.colour)
    expect(redacted.isRobot).toBe(other.isRobot)
    expect(redacted.status).toBe(other.status)
    expect(redacted.attacker).toBe(other.attacker)
  })

  test('a redacted player is still a real, renderable tree: the board is one of its children', async () => {
    const [viewer] = await setUp()
    const redacted = redactPlayer(viewer, viewer)
    expect(redacted.children).toHaveLength(3)
    expect(redacted.children[1]).toBe(redacted.board)
  })

  test('redactGameState redacts every player for the given viewer: only the viewer\'s own board keeps its ships', async () => {
    const players = await setUp()
    const [viewer, other] = players
    const redacted = redactGameState(players, viewer)
    expect(redacted).toHaveLength(players.length)
    expect(shipCells(viewer).every(({ x, y }) => hasShipAt(redacted[0].board, x, y))).toBe(true)
    expect(shipCells(other).every(({ x, y }) => !hasShipAt(redacted[1].board, x, y))).toBe(true)
  })

  describe('redactGameBody and the final-score screen\'s own Play Again button', () => {
    const bodyWith = (players, finalScore) => ({
      children: [{ attributes: { className: 'boards' }, children: players }, finalScore]
    })

    test('is enabled only for the host (players[0]), same as the ordering panel', async () => {
      const players = await setUp()
      const body = bodyWith(players, remoteFinalScore(players))

      const hostView = redactGameBody(body, players, players[0])
      const hostButton = hostView.children.find(c => c.attributes?.className === 'final-scores').children.find(c => c.attributes?.className === 'remote-play-again')
      expect(hostButton.attributes.disabled).toBeFalsy()

      const nonHostView = redactGameBody(body, players, players[1])
      const nonHostButton = nonHostView.children.find(c => c.attributes?.className === 'final-scores').children.find(c => c.attributes?.className === 'remote-play-again')
      expect(nonHostButton.attributes.disabled).toBe(true)
    })

    test('the final-score message itself is never disabled, for anyone - it carries nothing secret', async () => {
      const players = await setUp()
      const body = bodyWith(players, remoteFinalScore(players))
      const nonHostView = redactGameBody(body, players, players[1])
      const message = nonHostView.children.find(c => c.attributes?.className === 'final-scores').children.find(c => c.attributes?.className === 'remote-final-score-message')
      expect(message.attributes.disabled).toBeUndefined()
    })
  })
})
