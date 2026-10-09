/**
 * @jest-environment jsdom
 */
import jsonDom from 'json-dom'
import matrixDom from 'matrix-dom'
import attackListener from '../attack/attackListener'
import hintListener from '../attack/hintListener'
import placementListener from './placementListener'
import shipsListener from '../attack/shipsListener'
import remotePlacementListener from './remotePlacementListener'
import { startNewGame } from './startNewGame'
import { setGameMode } from './gameOptions'
import {
  PLACEMENT_TIMEOUT_MS,
  handleRemoteBoardClick,
  isHostOnlyStage,
  isRemoteSessionActive,
  readyRemotePlayer,
  randomiseRemoteShips,
  startRemotePlacement,
  chooseOrderRandom,
  beginOrderSet
} from './remotePlacement'

/** A fresh root with `count` human players, placed remotely - exactly how a room's own game is built. */
const setUp = (count, done = () => {}) => {
  const root = jsonDom.documentDomItem({ attackListener, hintListener, placementListener, remotePlacementListener, shipsListener })
  setGameMode(root, 'multi')
  let players = []
  startNewGame(root, count, 0, true, 'optional', (builtPlayers, body, onDone) => {
    players = builtPlayers
    startRemotePlacement(builtPlayers, body, order => { done(order); onDone(order) })
  })
  return { root, players }
}

const tile = (player, x, y) => matrixDom.getDomItemFromPoint(matrixDom.point(x, y, 0), player.board)
const place = (player, from, to) => {
  handleRemoteBoardClick(tile(player, ...from), player.board)
  handleRemoteBoardClick(tile(player, ...to), player.board)
}
const fullFleet = [[[0, 0], [4, 0]], [[0, 1], [3, 1]], [[0, 2], [2, 2]], [[0, 3], [2, 3]], [[0, 4], [1, 4]]]
const placeFullFleet = player => fullFleet.forEach(([from, to]) => place(player, from, to))
const panel = player => jsonDom.getChildrenByClass('remote-placement-panel', player)[0]
const message = player => jsonDom.getChildrenByClass('remote-placement-message', panel(player))[0].attributes.innerHTML
const button = (player, name) => jsonDom.getChildrenByClass(name, panel(player))[0]

describe('remote placement: simultaneous, independent per player', () => {
  test('a session is active for every player\'s own board as soon as placement starts, and not once it ends', () => {
    const { players } = setUp(2)
    expect(isRemoteSessionActive(players[0])).toBe(true)
    expect(isRemoteSessionActive(players[1].board)).toBe(true)
  })

  test('placing on one player\'s board never affects another\'s pending fleet', () => {
    const { players } = setUp(2)
    place(players[0], [0, 0], [4, 0])
    expect(players[0].shipFleet).toHaveLength(1)
    expect(players[1].shipFleet).toHaveLength(0)
    expect(message(players[1])).toContain('Aircraft Carrier')
  })

  test('a click on a tile that is not the clicked board\'s own owner is ignored', () => {
    const { players } = setUp(2)
    handleRemoteBoardClick(tile(players[1], 0, 0), players[0].board)
    expect(players[0].shipFleet).toHaveLength(0)
    expect(players[1].shipFleet).toHaveLength(0)
  })

  test('an invalid placement is refused and leaves the pending ship in place', () => {
    const { players } = setUp(2)
    place(players[0], [0, 0], [2, 3])
    expect(players[0].shipFleet).toHaveLength(0)
    expect(message(players[0])).toContain('Aircraft Carrier')
  })

  test('the Randomise button fills in the rest of a player\'s own fleet, and nobody else\'s', () => {
    const { players } = setUp(2)
    randomiseRemoteShips(players[0])
    expect(players[0].shipFleet).toHaveLength(5)
    expect(players[1].shipFleet).toHaveLength(0)
  })
})

describe('remote placement: readying up', () => {
  test('Ready is refused while ships are still pending', () => {
    const { players } = setUp(2)
    readyRemotePlayer(players[0])
    expect(button(players[0], 'remote-placement-ready').attributes.disabled).toBe(true)
  })

  test('ordering begins as soon as every player is ready, without waiting for the timer', () => {
    const order = []
    const { players, root } = setUp(2, chosen => order.push(chosen))
    players.forEach(player => { placeFullFleet(player); readyRemotePlayer(player) })
    expect(isHostOnlyStage(root)).toBe(true)
    expect(order).toHaveLength(0) // ordering has started, but nobody has chosen yet
  })

  test('a lone ready player still waits for everyone else before ordering begins', () => {
    const { players, root } = setUp(2)
    placeFullFleet(players[0])
    readyRemotePlayer(players[0])
    expect(isHostOnlyStage(root)).toBe(false)
  })
})

describe('remote placement: the server-side deadline', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  test('the deadline is pushed to the body as soon as placement starts, in the future', () => {
    const { root } = setUp(2)
    const deadline = Number(root.body.attributes['data-placement-deadline'])
    expect(deadline).toBeGreaterThan(Date.now())
  })

  test('a player who never finishes has their remaining ships placed at random once the timer fires', () => {
    const { players, root } = setUp(2)
    place(players[0], [0, 0], [4, 0]) // one ship placed by hand, four left pending
    // players[1] never places or readies up at all

    jest.advanceTimersByTime(PLACEMENT_TIMEOUT_MS)

    expect(players[0].shipFleet).toHaveLength(5) // the hand-placed ship, plus the rest filled in at random
    expect(players[1].shipFleet).toHaveLength(5) // a full fleet, placed entirely at random
    // Ordering has started for everyone - the timer alone moved both players past placing.
    expect(isHostOnlyStage(root)).toBe(true)
  })
})

describe('remote placement: host-driven ordering', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  test('Random lands on a full, real order of every player, after a short shuffle', async () => {
    const order = []
    const { players, root } = setUp(2, chosen => order.push(chosen))
    players.forEach(player => { placeFullFleet(player); readyRemotePlayer(player) })

    chooseOrderRandom(root)
    await jest.advanceTimersByTimeAsync(13 * 120)

    expect(order).toHaveLength(1)
    expect(order[0].map(player => player.name).sort()).toEqual(players.map(player => player.name).sort())
    expect(isHostOnlyStage(root)).toBe(false) // the round has begun - no remote stage is active any more
  })

  test('Set order locks in the order players\' boards are clicked in', () => {
    const order = []
    const { players, root } = setUp(2, chosen => order.push(chosen))
    players.forEach(player => { placeFullFleet(player); readyRemotePlayer(player) })

    beginOrderSet(root)
    handleRemoteBoardClick(tile(players[1], 0, 0), players[1].board)
    handleRemoteBoardClick(tile(players[0], 0, 0), players[0].board)

    expect(order).toHaveLength(1)
    expect(order[0].map(player => player.name)).toEqual([players[1].name, players[0].name])
  })
})

describe('remote placement: player stats stay hidden until a round actually starts', () => {
  // The real bug this covers: unlike local hot-seat's own placement.ts, remote placement never hid player-stats
  // (name, ship list, and - with hints 'optional' - the "Show heat hint on my turn" checkbox) during placement,
  // so a checkbox that does nothing yet stayed visible the whole time ships were being placed and ordered.
  test('player stats (including the hint checkbox nested inside) are hidden during placement and ordering, shown again once the order is set', () => {
    const { players } = setUp(2)
    // Each player's stats panel has the "Show heat hint on my turn" checkbox nested inside it (hints is
    // 'optional' here) - hiding the panel itself hides that checkbox too, with no separate toggle needed.
    players.forEach(player => expect(jsonDom.getChildrenFromAttribute('type', 'checkbox', player.playerStats)).toHaveLength(1))
    players.forEach(player => expect(player.playerStats.attributes.style.display).toBe('none'))

    players.forEach(player => { placeFullFleet(player); readyRemotePlayer(player) })
    // Still hidden once placement ends and the host is choosing how to order - no round has started yet.
    players.forEach(player => expect(player.playerStats.attributes.style.display).toBe('none'))

    beginOrderSet(players[0])
    handleRemoteBoardClick(tile(players[1], 0, 0), players[1].board)
    handleRemoteBoardClick(tile(players[0], 0, 0), players[0].board)

    players.forEach(player => expect(player.playerStats.attributes.style.display).toBe(''))
  })
})
