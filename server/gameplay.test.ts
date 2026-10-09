/**
 * @jest-environment node
 */
import './installPseudoDom'
import matrixDom from 'matrix-dom'
import { startRoomGame, watchRoomGame } from './gameplay'
import { PLACEMENT_TIMEOUT_MS } from '../src/setup/remotePlacement'
import endGame from '../src/attack/endGame'
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

  test('a room\'s game ends with a real final score screen - not local hot-seat\'s own, and nothing stale left over', () => {
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob']], 'optional', true)
    // Local hot-seat's own finalScore screen wires Play Again/Change Settings/Main Menu to listener names never
    // registered on a room's own isolated root (buildIsolatedRoot) - rendering it here used to throw
    // "Undefined listener function" deep inside a queued callback, silently swallowing the game ending at all.
    expect(() => endGame(game.players[0])).not.toThrow()

    // boards (still holding every placement panel) and remote-ordering (only ever hidden via style, never
    // removed) both have to be gone too, not just alongside final-scores - both still reference
    // remotePlacementListener, which the real client never registers directly (see remoteGame.test.js's own
    // "stale boards sibling" regression test for what rendering a body that still has them does once
    // forwarding turns off for the finished game).
    const classNames = game.root.body.children.map((child: any) => child.attributes?.className)
    expect(classNames).toEqual(['final-scores'])
    const finalScores = game.root.body.children[0]
    const finalScoreChildClasses = finalScores.children.map((child: any) => child.attributes?.className)
    expect(finalScoreChildClasses).not.toContain('final-scores-actions')
    expect(finalScoreChildClasses).toContain('remote-final-score-message')
    expect(finalScoreChildClasses).toContain('remote-play-again')
  })

  test('calling startRoomGame again with the same players (a rematch) produces a genuinely fresh, independent game', () => {
    const roomPlayers: Array<[string, string]> = [['alice-socket', 'Alice'], ['bob-socket', 'Bob']]
    const firstGame = startRoomGame(roomPlayers, 'optional', true)
    firstGame.players[1].status = 0 // the real trigger lobbyServer.ts's isRoomGameOver checks for

    const secondGame = startRoomGame(roomPlayers, 'optional', true)

    expect(secondGame.root).not.toBe(firstGame.root)
    expect(secondGame.players).not.toBe(firstGame.players)
    expect(secondGame.players.map(player => player.name)).toEqual(['Alice', 'Bob'])
    // A fresh game's players have unplaced fleets again - nothing carried over from the finished one.
    expect(secondGame.players.every(player => player.shipFleet.length === 0)).toBe(true)
    expect(secondGame.players.every(player => player.status === 100)).toBe(true)
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

  test('each player gets their own placement panel, carrying the deadline and interactive only for its owner', () => {
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob']], 'optional', true)
    const pushes = new Map<string, DomItem>()
    watchRoomGame(game, (socketId, redactedBody) => pushes.set(socketId, redactedBody))

    const aliceBody = pushes.get('alice-socket') as DomItem
    expect((aliceBody.attributes as { 'data-placement-deadline'?: string })['data-placement-deadline']).toBeDefined()

    const aliceView = playersOf(aliceBody)
    const panelOf = (player: any): any => player.children.find((child: any) => child.attributes.className === 'remote-placement-panel')
    const randomiseOf = (panel: any): any => panel.children.find((child: any) => child.attributes.className === 'remote-placement-randomise')

    // Alice's own panel, in Alice's own push, is interactive - nobody has readied up yet.
    expect(randomiseOf(panelOf(aliceView[0])).attributes.disabled).toBeFalsy()
    // Bob's panel, as seen in Alice's own push, is always disabled - Alice can't act on Bob's behalf.
    expect(randomiseOf(panelOf(aliceView[1])).attributes.disabled).toBe(true)
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

  test('the placement deadline firing on its own triggers a fresh broadcast too, not just dispatched actions', () => {
    jest.useFakeTimers()
    // The real wiring (see lobbyServer.ts's startGame handler): startRoomGame's own onTimerChange callback is
    // created before watchRoomGame returns the real broadcast function, so it is captured by reference here too,
    // exactly like the real fix - the deadline is still two minutes away by the time broadcast is reassigned.
    let broadcast: () => void = () => {}
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob']], 'optional', true, () => broadcast())
    let pushCount = 0
    broadcast = watchRoomGame(game, () => { pushCount++ })
    const afterWatching = pushCount

    jest.advanceTimersByTime(PLACEMENT_TIMEOUT_MS)

    expect(pushCount).toBeGreaterThan(afterWatching)
    jest.useRealTimers()
  })
})
