/**
 * @jest-environment node
 */
import './installPseudoDom'
import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'
import { startRoomGame, watchRoomGame, QUEUE_BROADCAST_DEBOUNCE_MS, TURN_TIMEOUT_MS } from './gameplay'
import { PLACEMENT_TIMEOUT_MS, handleRemoteBoardClick, readyRemotePlayer, chooseOrderRandom } from '../src/setup/remotePlacement'
import attackFleet from '../src/attack/attackFleet'
import endGame from '../src/attack/endGame'
import type { RoomGame } from './gameplay'
import type { DomItem } from 'json-dom/dist/domItem/types'

/** The redacted players, out of a pushed redacted body (see redactGameBody). */
const playersOf = (redactedBody: DomItem): any[] =>
  (redactedBody.children.find(child => (child.attributes as { className?: string } | undefined)?.className === 'boards') as DomItem).children

/** A known, fixed fleet - the two-click method at the same coordinates every time, so exactly which cells end
 * up with ships is known rather than left to Randomise. */
const FLEET: Array<[[number, number], [number, number]]> = [[[0, 0], [4, 0]], [[0, 1], [3, 1]], [[0, 2], [2, 2]], [[0, 3], [2, 3]], [[0, 4], [1, 4]]]

const tileAt = (player: any, x: number, y: number): any => matrixDom.getDomItemFromPoint(matrixDom.point(x, y, 0), player.board)
const placeFullFleet = (player: any): void => FLEET.forEach(([from, to]) => {
  handleRemoteBoardClick(tileAt(player, ...from), player.board)
  handleRemoteBoardClick(tileAt(player, ...to), player.board)
})

/** Drives a started room's game all the way through placement and a random turn order, using fake timers for
 * the order's own brief shuffle animation - needs jest.useFakeTimers() already active. Returns once a real
 * attacker exists, the one precondition the turn-timeout itself cares about. */
const playToRealGame = async (game: RoomGame): Promise<void> => {
  game.players.forEach(player => {
    placeFullFleet(player)
    readyRemotePlayer(player)
  })
  chooseOrderRandom(game.root)
  await jest.advanceTimersByTimeAsync(13 * 120)
}

/** How many of a player's own cells have been hit so far - (9, 9) is always water and always unhit for a
 * freshly-placed FLEET above, so it is a safe, known cell to attack directly in these tests. */
const hitCount = (player: any): number => matrixDom.getAllPoints(player.board).filter((p: any) => p.z === 0)
  .filter((p: any) => matrixDom.getDomItemFromPoint(p, player.board).isHit).length

describe('starting a room\'s game', () => {
  test('builds one player per connected socket, in join order', () => {
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob']], 'optional')
    expect(game.players).toHaveLength(2)
    expect(game.playerBySocket.get('alice-socket')).toBe(game.players[0])
    expect(game.playerBySocket.get('bob-socket')).toBe(game.players[1])
  })

  test('every seat is a connected human - no robots', () => {
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob'], ['carol-socket', 'Carol']], 'optional')
    expect(game.players.every(player => !player.isRobot)).toBe(true)
  })

  test('a room\'s game ends with a real final score screen - not local hot-seat\'s own, and nothing stale left over', () => {
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob']], 'optional')
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
    expect(finalScoreChildClasses).toContain('remote-final-score-message')
    const actions = finalScores.children.find((child: any) => child.attributes?.className === 'final-scores-actions')
    const actionClasses = actions.children.map((child: any) => child.attributes?.className)
    expect(actionClasses).toEqual(['remote-play-again', 'remote-leave'])
  })

  test('calling startRoomGame again with the same players (a rematch) produces a genuinely fresh, independent game', () => {
    const roomPlayers: Array<[string, string]> = [['alice-socket', 'Alice'], ['bob-socket', 'Bob']]
    const firstGame = startRoomGame(roomPlayers, 'optional')
    firstGame.players[1].status = 0 // the real trigger lobbyServer.ts's isRoomGameOver checks for

    const secondGame = startRoomGame(roomPlayers, 'optional')

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
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob']], 'optional')
    const pushes = new Map<string, DomItem>()
    watchRoomGame(game, (socketId, redactedBody) => pushes.set(socketId, redactedBody))

    expect(pushes.size).toBe(2)
    // While actively placing, a viewer's own push includes only themselves - nobody else's board, fleet or
    // placement panel is needed yet (see redactGameState.ts's redactGameBody, keyed off remotePlacementStage).
    const aliceView = playersOf(pushes.get('alice-socket') as DomItem)
    expect(aliceView).toHaveLength(1)
    expect(aliceView[0].name).toBe('Alice')
  })

  test('a player sees their own board in full while placing - nobody else\'s board is even present', () => {
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob']], 'optional')
    const pushes = new Map<string, DomItem>()
    watchRoomGame(game, (socketId, redactedBody) => pushes.set(socketId, redactedBody))

    const aliceView = playersOf(pushes.get('alice-socket') as DomItem)
    expect(aliceView).toHaveLength(1)
    expect(matrixDom.getAllPoints(aliceView[0].board).filter((p: { z: number }) => p.z === 0)).toHaveLength(100)
  })

  test('once everyone has placed and ordering begins, every player is visible again, for every viewer', () => {
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob']], 'optional')
    const pushes = new Map<string, DomItem>()
    const broadcast = watchRoomGame(game, (socketId, redactedBody) => pushes.set(socketId, redactedBody))

    // readyRemotePlayer/placeFullFleet are called directly here (bypassing the socket/gameAction layer this
    // unit test has no server for), and run entirely synchronously - unlike a real dispatched action, nothing
    // triggers watchRoomGame's own broadcast on their behalf, so it is called explicitly, same as
    // lobbyServer.ts's gameAction handler already does for every synchronous action in production.
    game.players.forEach(player => {
      placeFullFleet(player)
      readyRemotePlayer(player)
    })
    broadcast()

    const aliceView = playersOf(pushes.get('alice-socket') as DomItem)
    expect(aliceView.map(p => p.name).sort()).toEqual(['Alice', 'Bob'])
  })

  test('a player\'s own placement panel carries the deadline and is interactive; everyone else\'s is not', () => {
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob']], 'optional')
    const pushes = new Map<string, DomItem>()
    const broadcast = watchRoomGame(game, (socketId, redactedBody) => pushes.set(socketId, redactedBody))

    const aliceBody = pushes.get('alice-socket') as DomItem
    expect((aliceBody.attributes as { 'data-placement-deadline'?: string })['data-placement-deadline']).toBeDefined()

    const panelOf = (player: any): any => player.children.find((child: any) => child.attributes.className === 'remote-placement-panel')
    const randomiseOf = (panel: any): any => panel.children.find((child: any) => child.attributes.className === 'remote-placement-randomise')

    // Alice's own panel, in Alice's own push, is interactive - nobody has readied up yet. Bob is not even
    // present in this push at all (still placing - see the trimming test above), so there is nothing of his
    // to check here; once ordering begins (see the test above) he reappears, always disabled for Alice.
    const aliceView = playersOf(aliceBody)
    expect(aliceView).toHaveLength(1)
    expect(randomiseOf(panelOf(aliceView[0])).attributes.disabled).toBeFalsy()

    game.players.forEach(player => {
      placeFullFleet(player)
      readyRemotePlayer(player)
    })
    broadcast()
    const aliceOrderingView = playersOf(pushes.get('alice-socket') as DomItem)
    const bob = aliceOrderingView.find((p: any) => p.name === 'Bob')
    expect(randomiseOf(panelOf(bob)).attributes.disabled).toBe(true)
  })

  test('pushes again once a queued engine step resolves', async () => {
    const game = startRoomGame([['alice-socket', 'Alice']], 'optional')
    let pushCount = 0
    watchRoomGame(game, () => { pushCount++ })
    const afterWatching = pushCount
    expect(afterWatching).toBeGreaterThan(0)

    // One human alone places straight away and reaches the ready screen, which queues nothing on its own, but
    // calling the session's own queue directly (as any real engine action would) must trigger another push -
    // debounced, so it lands slightly after the queued step itself resolves, not synchronously with it.
    await (await import('../src/setup/gameSession')).getSession(game.root).queue(() => 'done', 0)
    await new Promise(resolve => setTimeout(resolve, QUEUE_BROADCAST_DEBOUNCE_MS * 2))

    expect(pushCount).toBeGreaterThan(afterWatching)
  })

  test('coalesces a burst of queued engine steps into a single debounced broadcast', async () => {
    const game = startRoomGame([['alice-socket', 'Alice']], 'optional')
    let pushCount = 0
    watchRoomGame(game, () => { pushCount++ })
    const afterWatching = pushCount

    // Mirrors what a single real turn change does (see updatePlayer.ts): several queued steps resolve one
    // right after another, well inside the debounce window - this must settle into exactly one more broadcast,
    // not one per step.
    const session = (await import('../src/setup/gameSession')).getSession(game.root)
    await session.queue(() => 'one', 0)
    await session.queue(() => 'two', 0)
    await session.queue(() => 'three', 0)
    await new Promise(resolve => setTimeout(resolve, QUEUE_BROADCAST_DEBOUNCE_MS * 2))

    expect(pushCount).toBe(afterWatching + 1)
  })

  test('the placement deadline firing on its own triggers a fresh broadcast too, not just dispatched actions', () => {
    jest.useFakeTimers()
    // The real wiring (see lobbyServer.ts's startGame handler): startRoomGame's own onTimerChange callback is
    // created before watchRoomGame returns the real broadcast function, so it is captured by reference here too,
    // exactly like the real fix - the deadline is still two minutes away by the time broadcast is reassigned.
    let broadcast: () => void = () => {}
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob']], 'optional', () => broadcast())
    let pushCount = 0
    broadcast = watchRoomGame(game, () => { pushCount++ })
    const afterWatching = pushCount

    jest.advanceTimersByTime(PLACEMENT_TIMEOUT_MS)

    expect(pushCount).toBeGreaterThan(afterWatching)
    jest.useRealTimers()
  })
})

describe('the per-turn timeout', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  test('a random shot is taken on a slow attacker\'s behalf once their own deadline passes, and the turn passes', async () => {
    let broadcast: () => void = () => {}
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob']], 'optional', () => broadcast())
    broadcast = watchRoomGame(game, () => {})
    await playToRealGame(game)

    const attacker = game.players.find(player => player.attacker) as any
    const victim = game.players.find(player => !player.attacker) as any
    expect(attacker).toBeDefined()
    const hitsBefore = hitCount(victim)

    await jest.advanceTimersByTimeAsync(TURN_TIMEOUT_MS)

    expect(hitCount(victim)).toBe(hitsBefore + 1)
    expect(attacker.attacker).toBe(false)
    expect(victim.attacker).toBe(true)
  }, 15000)

  test('triggers a fresh broadcast too, the same as the placement deadline does', async () => {
    let broadcast: () => void = () => {}
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob']], 'optional', () => broadcast())
    let pushCount = 0
    broadcast = watchRoomGame(game, () => { pushCount++ })
    await playToRealGame(game)
    const afterStarting = pushCount

    await jest.advanceTimersByTimeAsync(TURN_TIMEOUT_MS)

    expect(pushCount).toBeGreaterThan(afterStarting)
  }, 15000)

  // The real bug this guards against: onAttackerChanged has to clear the PREVIOUS attacker's own pending
  // timer before starting a new one - otherwise a real, on-time action leaves the old timer running
  // alongside the new one, and it eventually fires anyway at its own original (by then meaningless) deadline.
  // Needs 3 players, not 2: with only one possible opponent, attackFleet's own "never attack the current
  // attacker" guard happens to also block a stale shot aimed at them, masking a missing clearTimeout entirely
  // by coincidence - with a third player available, a stale shot can land on someone that guard does not cover.
  test('a real action before the deadline cancels it - the stale timer never fires afterward', async () => {
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob'], ['carol-socket', 'Carol']], 'optional')
    await playToRealGame(game)

    const original = game.players.find(player => player.attacker) as any
    const originalIndex = game.players.indexOf(original)
    const nextAttacker = game.players[(originalIndex + 1) % 3]
    const thirdPlayer = game.players[(originalIndex + 2) % 3]

    // Some real time passes, then the attacker actually acts, well before their own deadline - the turn
    // passes for real (findNextAttacker.ts cycles seat order, so it is always nextAttacker next, regardless
    // of who was actually clicked), and the new attacker gets their own fresh deadline from this moment.
    await jest.advanceTimersByTimeAsync(5000)
    attackFleet(tileAt(nextAttacker, 9, 9))
    expect(nextAttacker.attacker).toBe(true)
    const hitsOnThirdBefore = hitCount(thirdPlayer)

    // Force the stale call's own random pick (opponents = everyone but `original`) onto thirdPlayer - the one
    // player attackFleet's own self-attack guard does NOT protect, since they are not the current attacker.
    const opponentsOfOriginal = game.players.filter(player => player !== original)
    const spy = jest.spyOn(siFunciona, 'randomInteger').mockReturnValue(opponentsOfOriginal.indexOf(thirdPlayer))
    try {
      // Past where the ORIGINAL (now stale) deadline would have fired (due TURN_TIMEOUT_MS after it was set),
      // but still well before the new attacker's own (set 5000ms later). A correctly cancelled stale timer
      // does nothing here; an uncancelled one takes an unwanted shot at thirdPlayer.
      await jest.advanceTimersByTimeAsync(TURN_TIMEOUT_MS - 5000 + 1)
    } finally {
      spy.mockRestore()
    }

    expect(hitCount(thirdPlayer)).toBe(hitsOnThirdBefore)
  }, 15000)
})

describe('player roles, once real gameplay begins', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  const classNameOf = (player: any): string => player.attributes?.className

  test('a viewer\'s own push marks themselves as role-own, and their opponent as role-target only on their own turn', async () => {
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob']], 'optional')
    const pushes = new Map<string, DomItem>()
    const broadcast = watchRoomGame(game, (socketId, redactedBody) => pushes.set(socketId, redactedBody))
    await playToRealGame(game)
    // playToRealGame's own last queued step (finishOrdering/startRound) still broadcasts through the debounced
    // queue hook, which may not have settled by the time the fake-timer advance it ran under returns - called
    // explicitly here for a guaranteed-fresh push, same as the earlier "once ordering begins" test above.
    broadcast()

    const attacker = game.players.find(player => player.attacker) as any
    const nonAttacker = game.players.find(player => !player.attacker) as any
    const attackerSocket = attacker.name === 'Alice' ? 'alice-socket' : 'bob-socket'
    const nonAttackerSocket = attackerSocket === 'alice-socket' ? 'bob-socket' : 'alice-socket'

    const attackerView = playersOf(pushes.get(attackerSocket) as DomItem)
    expect(classNameOf(attackerView.find((p: any) => p.name === attacker.name))).toBe('player role-own')
    expect(classNameOf(attackerView.find((p: any) => p.name === nonAttacker.name))).toBe('player role-target')

    // The non-attacker's own push sees the exact same two players, but the roles flip: their own board is
    // still role-own, but the attacker (not their turn to act on) is only ever a plain role-summary.
    const nonAttackerView = playersOf(pushes.get(nonAttackerSocket) as DomItem)
    expect(classNameOf(nonAttackerView.find((p: any) => p.name === nonAttacker.name))).toBe('player role-own')
    expect(classNameOf(nonAttackerView.find((p: any) => p.name === attacker.name))).toBe('player role-summary')
  }, 15000)

  test('an eliminated player is role-summary for everyone, even the attacker, on the attacker\'s own turn', async () => {
    const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob'], ['carol-socket', 'Carol']], 'optional')
    const pushes = new Map<string, DomItem>()
    const broadcast = watchRoomGame(game, (socketId, redactedBody) => pushes.set(socketId, redactedBody))
    await playToRealGame(game)

    const attacker = game.players.find(player => player.attacker) as any
    const eliminated = game.players.find(player => player !== attacker) as any
    eliminated.status = 0
    broadcast()

    const attackerSocket = game.players.indexOf(attacker) === 0 ? 'alice-socket' : game.players.indexOf(attacker) === 1 ? 'bob-socket' : 'carol-socket'
    const attackerView = playersOf(pushes.get(attackerSocket) as DomItem)
    expect(classNameOf(attackerView.find((p: any) => p.name === eliminated.name))).toBe('player role-summary')
  }, 15000)
})
