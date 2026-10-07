/**
 * @jest-environment jsdom
 */

import matrixDom from 'matrix-dom'
import { useGameLifecycle, startGame, settle } from '../../tests/helpers/game'
import { redactBoard, redactGameState, redactPlayer } from './redactGameState'

useGameLifecycle()

describe('redacting the game state for a remote viewer', () => {
  const setUp = async () => {
    const { players } = startGame({ humans: 2 })
    await settle()
    return players
  }

  const shipCells = player => player.shipFleet.flatMap(ship => ship.parts.map(part => ({ x: part.point.x, y: part.point.y })))

  test('a viewer sees their own unattacked ship positions', async () => {
    const [viewer] = await setUp()
    const redacted = redactBoard(viewer.board, true)
    const ownShips = shipCells(viewer)
    ownShips.forEach(({ x, y }) => {
      expect(redacted.find(cell => cell.x === x && cell.y === y).hasShip).toBe(true)
    })
  })

  test('a viewer does not see another player\'s unattacked ship positions', async () => {
    const [viewer, other] = await setUp()
    const redacted = redactBoard(other.board, false)
    const otherShips = shipCells(other)
    otherShips.forEach(({ x, y }) => {
      expect(redacted.find(cell => cell.x === x && cell.y === y).hasShip).toBe(false)
    })
    // every cell is still accounted for: 100 cells, none dropped just because they are hidden
    expect(redacted).toHaveLength(100)
  })

  test('a hit cell shows its ship on any board, even one the viewer does not own', async () => {
    const [viewer, other] = await setUp()
    const part = other.shipFleet[0].parts[0]
    matrixDom.getDomItemFromPoint(part.point, other.board).isHit = true
    const redacted = redactBoard(other.board, false)
    const hitCell = redacted.find(cell => cell.x === part.point.x && cell.y === part.point.y)
    expect(hitCell.isHit).toBe(true)
    expect(hitCell.hasShip).toBe(true)
  })

  test('a miss stays a miss: isHit is true but hasShip is false, on any board', async () => {
    const [viewer, other] = await setUp()
    const miss = matrixDom.getAllPoints(other.board).filter(p => p.z === 0).find(p => !shipCells(other).some(s => s.x === p.x && s.y === p.y))
    matrixDom.getDomItemFromPoint(miss, other.board).isHit = true
    const redacted = redactBoard(other.board, false)
    const missCell = redacted.find(cell => cell.x === miss.x && cell.y === miss.y)
    expect(missCell.isHit).toBe(true)
    expect(missCell.hasShip).toBe(false)
  })

  test('a player\'s fleet is reduced to name, length and status - never ship part positions', async () => {
    const [viewer] = await setUp()
    const redacted = redactPlayer(viewer, viewer)
    redacted.shipFleet.forEach(ship => {
      expect(Object.keys(ship).sort()).toEqual(['length', 'name', 'status'])
    })
    expect(JSON.stringify(redacted)).not.toMatch(/"parts"|"point"/)
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

  test('redactGameState redacts every player for the given viewer: only the viewer\'s own board keeps its ships', async () => {
    const players = await setUp()
    const [viewer, other] = players
    const redacted = redactGameState(players, viewer)
    expect(redacted).toHaveLength(players.length)
    const viewerShips = shipCells(viewer)
    const otherShips = shipCells(other)
    expect(viewerShips.every(({ x, y }) => redacted[0].board.find(c => c.x === x && c.y === y).hasShip)).toBe(true)
    expect(otherShips.every(({ x, y }) => !redacted[1].board.find(c => c.x === x && c.y === y).hasShip)).toBe(true)
  })
})
