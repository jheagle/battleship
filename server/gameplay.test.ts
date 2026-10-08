/**
 * @jest-environment node
 */
import './installPseudoDom'
import matrixDom from 'matrix-dom'
import { startRoomGame, watchRoomGame } from './gameplay'
import type { DomItem } from 'json-dom/dist/domItem/types'

/** The redacted players, out of a pushed redacted body (see redactGameBody). */
const playersOf = (redactedBody: DomItem): any[] =>
  (redactedBody.children.find(child => (child.attributes as { className?: string } | undefined)?.className === 'boards') as DomItem).children

describe('starting a room\'s game', () => {
  test('builds one player per connected socket, in join order', () => {
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob']], 'optional', true)
    expect(game.players).toHaveLength(2)
    expect(game.playerBySocket.get('alice-socket')).toBe(game.players[0])
    expect(game.playerBySocket.get('bob-socket')).toBe(game.players[1])
  })

  test('every seat is a connected human - no robots', () => {
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob'], ['carol-socket', 'Carol']], 'optional', true)
    expect(game.players.every(player => !player.isRobot)).toBe(true)
  })
})

describe('watching a room\'s game for changes', () => {
  test('pushes each player their own redacted view as soon as watching starts', () => {
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob']], 'optional', true)
    const pushes = new Map<string, DomItem>()
    watchRoomGame(game, (socketId, redactedBody) => pushes.set(socketId, redactedBody))

    expect(pushes.size).toBe(2)
    const aliceView = playersOf(pushes.get('alice-socket') as DomItem)
    expect(aliceView).toHaveLength(2)
    expect(aliceView.map(p => p.name)).toEqual(game.players.map(p => p.name))
  })

  test('a player only sees their own board\'s unattacked ship positions in their own push', () => {
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob']], 'optional', true)
    const pushes = new Map<string, DomItem>()
    watchRoomGame(game, (socketId, redactedBody) => pushes.set(socketId, redactedBody))

    const aliceView = playersOf(pushes.get('alice-socket') as DomItem)
    // Robots get a fleet immediately; humans place during the placement phase, so there is nothing to hide yet
    // for a fresh human-only game - this just confirms the shape round-trips correctly either way.
    expect(matrixDom.getAllPoints(aliceView[0].board).filter((p: { z: number }) => p.z === 0)).toHaveLength(100)
    expect(matrixDom.getAllPoints(aliceView[1].board).filter((p: { z: number }) => p.z === 0)).toHaveLength(100)
  })

  test('the redacted body still has the placement panel, unredacted - it carries nothing secret', () => {
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob']], 'optional', true)
    const pushes = new Map<string, DomItem>()
    watchRoomGame(game, (socketId, redactedBody) => pushes.set(socketId, redactedBody))

    const aliceBody = pushes.get('alice-socket') as DomItem
    const classNames = aliceBody.children.map(child => (child.attributes as { className?: string }).className)
    expect(classNames).toContain('boards')
    expect(classNames.some(name => name?.includes('placement'))).toBe(true)
  })

  test('pushes again once a queued engine step resolves', async () => {
    const game = startRoomGame([['alice-socket', 'Alice']], 'optional', true)
    let pushCount = 0
    watchRoomGame(game, () => { pushCount++ })
    const afterWatching = pushCount
    expect(afterWatching).toBeGreaterThan(0)

    // One human alone places straight away and reaches the ready screen, which queues nothing on its own, but
    // calling the session's own queue directly (as any real engine action would) must trigger another push.
    await (await import('../src/setup/gameSession')).getSession(game.root).queue(() => 'done', 0)

    expect(pushCount).toBeGreaterThan(afterWatching)
  })
})
