import jsonDom from 'json-dom'
import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'
import { defaultShipSpecs } from './defaultFleet'
import generateRandomFleet from './generateRandomFleet'
import queueTimeout from '../queue'
import { isValidPlacement, placeShip } from './placeShip'
import { setStatsShown } from './placement'
import remotePlacementPanel from '../components/layout/remotePlacementPanel'
import remoteOrderingPanel from '../components/layout/remoteOrderingPanel'
import type { DomItem, DomItemRoot } from 'json-dom/dist/domItem/types'
import type { Point } from 'matrix-dom/dist/point/types'
import type { Board, Player, ShipSpec, Tile } from '../types'

/** How long players have to finish placing before any still-pending ships are placed at random for them. */
export const PLACEMENT_TIMEOUT_MS = 120000

/**
 * - placing: every player places their own ships on their own board, independently and at the same time.
 * - choosing: everyone has placed; the host decides how the order is picked (Random, or Set order).
 * - ordering: the host is clicking each player's board in turn, assigning their place in the order.
 * - shuffling: Random is picking the order, with a short animation.
 * - chosen: the order is set; the round starts immediately after.
 */
type RemoteStage = 'placing' | 'choosing' | 'ordering' | 'shuffling' | 'chosen'

interface RemotePlayerState {
  pending: ShipSpec[]
  start: Point | null
  ready: boolean
}

interface RemotePlacementState {
  stage: RemoteStage
  deadline: number
  timer: ReturnType<typeof setTimeout>
  players: Player[]
  playerState: Map<Player, RemotePlayerState>
  order: Player[]
  done: (order: Player[]) => void
  onTimerChange: () => void
}

const sessions = new WeakMap<DomItemRoot, RemotePlacementState>()

const findSession = (item: DomItem): RemotePlacementState | null => sessions.get(jsonDom.getTopParentItem(item) as DomItemRoot) ?? null

const activeSession = (item: DomItem): RemotePlacementState => {
  const found = findSession(item)
  if (!found) {
    throw new Error('No remote placement is running')
  }
  return found
}

/** Whether a remote placement/ordering phase is running for this item's game - so a board click during it is
 * routed here instead of to a normal attack (see attackListener.ts). */
export const isRemoteSessionActive = (item: DomItem): boolean => findSession(item) !== null

/** Whether only the host may act right now - every stage except placing itself (see server/lobbyServer.ts). */
export const isHostOnlyStage = (item: DomItem): boolean => {
  const found = findSession(item)
  return found !== null && found.stage !== 'placing'
}

const update = (item: DomItem, attributes: object): void => {
  jsonDom.updateElement(siFunciona.mergeObjectsMutable(item, { attributes }) as DomItem)
}

const child = (item: DomItem, className: string): DomItem => jsonDom.getChildrenByClass(className, item)[0]

const panelOf = (player: Player): DomItem => child(player as unknown as DomItem, 'remote-placement-panel')

/** Refresh one player's own placement panel to match their current state. */
const renderPanel = (session: RemotePlacementState, player: Player): void => {
  const state = session.playerState.get(player) as RemotePlayerState
  const panel = panelOf(player)
  const next = state.pending[0]
  update(child(panel, 'remote-placement-message'), {
    innerHTML: state.ready
      ? 'Ready - waiting for everyone else.'
      : next
        ? `Place your ${next.name} (${next.size} cells): click where it starts, then where it ends.`
        : 'All placed. Press Ready when you are.'
  })
  update(child(panel, 'remote-placement-ready'), { disabled: state.ready || state.pending.length > 0 })
  update(child(panel, 'remote-placement-randomise'), { disabled: state.ready })
}

/** Mark which cells a ship-in-progress could end on, same visual as local placement's own showStart. */
const showStart = (player: Player, point: Point | null, size: number): void => {
  const board = player.board
  matrixDom.getAllPoints(board).filter(p => p.z === 0).forEach(p => {
    const tile = matrixDom.getDomItemFromPoint(p, board) as unknown as DomItem
    const isStart = Boolean(point && p.x === point.x && p.y === point.y)
    const isEnd = point !== null && !isStart && isValidPlacement(board, point, p, size)
    update(tile, {
      className: isEnd ? 'column valid-end' : 'column',
      style: { outline: isStart ? '3px solid yellow' : '' }
    })
  })
}

const updateOrderingPanel = (session: RemotePlacementState, root: DomItemRoot): void => {
  const panel = child(root.body, 'remote-ordering')
  const messages: Record<RemoteStage, string> = {
    placing: '',
    choosing: 'Choose how to decide the order: Random, or click each player\'s board in turn.',
    ordering: 'Click each player\'s board in turn. The first one clicked goes first.',
    shuffling: 'Choosing at random...',
    chosen: `${session.order.map(p => p.name).join(', then ')} will take turns, in that order.`
  }
  update(child(panel, 'remote-ordering-message'), { innerHTML: messages[session.stage] })
  update(panel, { style: { display: session.stage === 'placing' ? 'none' : '' } })
}

/**
 * Begin a remote game's placement phase: every human places their own ships on their own board at the same
 * time - no handoff, no "look away". `done` runs once the order is set, with the order play will take.
 * `onTimerChange` runs whenever the deadline below actually fires and changes state on its own - every other
 * state change in this module happens inside a function a dispatched/forwarded click calls directly, which the
 * server's own broadcast-after-dispatch already covers; the deadline is the one change that happens on a raw
 * timer with nothing else watching for it, so without this hook a client that lets it expire sees nothing at
 * all, even though the server's own state has already moved on.
 * @param players
 * @param body
 * @param done
 * @param onTimerChange
 */
export const startRemotePlacement = (players: Player[], body: DomItem, done: (order: Player[]) => void, onTimerChange: () => void = () => {}): void => {
  const root = jsonDom.getTopParentItem(body) as DomItemRoot
  const playerState = new Map(players.map(player => [player, { pending: [...defaultShipSpecs], start: null, ready: false }]))
  // unref so an unfinished placement (an abandoned room, or just a test that never lets this fire) never keeps
  // the process alive on its own - guarded since this same module also runs under jsdom (a test's own in-process
  // lobby server), where setTimeout returns a plain number with no unref to call.
  const timer = setTimeout(() => autoFinishPlacement(root), PLACEMENT_TIMEOUT_MS)
  ;(timer as unknown as { unref?: () => void }).unref?.()
  const session: RemotePlacementState = {
    stage: 'placing',
    deadline: Date.now() + PLACEMENT_TIMEOUT_MS,
    timer,
    players,
    playerState,
    order: [],
    done,
    onTimerChange
  }
  sessions.set(root, session)
  update(root.body, { 'data-placement-deadline': String(session.deadline) })
  // Name, ship list and (when hints are optional) the "show heat hint" checkbox all belong to a round already
  // under way - none of them make sense yet during placement/ordering. Shown again once finishOrdering below
  // resolves, mirroring local hot-seat's own placement.ts.
  setStatsShown(players, false)
  players.forEach(player => {
    jsonDom.renderHtml(jsonDom.createDomItem(remotePlacementPanel()), player as unknown as DomItem)
    renderPanel(session, player)
  })
  jsonDom.renderHtml(jsonDom.createDomItem(remoteOrderingPanel()), root.body)
}

/**
 * A click on a player's own board during placement: the first click sets where a ship starts, the second where
 * it ends (an invalid second click is refused and the start is forgotten) - exactly local placement's own
 * two-click mechanic, just resolved from the clicked board's own owner instead of a shared "current player".
 * @param tile
 * @param board
 */
const placeRemoteShip = (tile: Tile, board: Board): void => {
  const player = jsonDom.getParentsByClass('player', tile)[0] as Player
  if (board !== player.board) {
    return
  }
  const session = activeSession(tile)
  const state = session.playerState.get(player) as RemotePlayerState
  if (state.ready) {
    return
  }
  const next = state.pending[0]
  if (!next) {
    return
  }
  const point = tile.point
  if (!state.start) {
    state.start = point
    showStart(player, point, next.size)
    renderPanel(session, player)
    return
  }
  const start = state.start
  state.start = null
  showStart(player, null, next.size)
  if (start.x === point.x && start.y === point.y) {
    renderPanel(session, player)
    return
  }
  if (!isValidPlacement(player.board, start, point, next.size)) {
    renderPanel(session, player)
    return
  }
  const ship = placeShip(player.board, next, start, point, true)
  if (ship) {
    player.shipFleet.push(ship)
    state.pending.shift()
  }
  renderPanel(session, player)
}

const checkAllReady = (session: RemotePlacementState, root: DomItemRoot): void => {
  if ([...session.playerState.values()].every(state => state.ready)) {
    clearTimeout(session.timer)
    beginOrdering(session, root)
  }
}

/** A click on a player's own board while the order is being set (see beginOrderSet) - adds them to the order. */
const pickOrderPlayer = (board: Board): void => {
  const session = activeSession(board)
  if (session.stage !== 'ordering') {
    return
  }
  const player = session.players.find(p => p.board === board)
  if (!player || session.order.includes(player)) {
    return
  }
  session.order.push(player)
  const root = jsonDom.getTopParentItem(board) as DomItemRoot
  if (session.order.length < session.players.length) {
    updateOrderingPanel(session, root)
    return
  }
  finishOrdering(session, root)
}

/** A board click while a remote placement/ordering phase is running - routed by the current stage. */
export const handleRemoteBoardClick = (tile: Tile, board: Board): void => {
  const session = activeSession(tile)
  if (session.stage === 'placing') {
    placeRemoteShip(tile, board)
  } else if (session.stage === 'ordering') {
    pickOrderPlayer(board)
  }
}

/** Once every player is ready (or the timer below fires), hide their panels and show the ordering choice. */
const beginOrdering = (session: RemotePlacementState, root: DomItemRoot): void => {
  session.stage = 'choosing'
  session.players.forEach(player => update(panelOf(player), { style: { display: 'none' } }))
  updateOrderingPanel(session, root)
}

/** Any player still not ready when the deadline passes has their remaining ships placed for them at random. */
const autoFinishPlacement = (root: DomItemRoot): void => {
  const session = findSession(root)
  if (!session || session.stage !== 'placing') {
    return
  }
  session.players.forEach(player => {
    const state = session.playerState.get(player) as RemotePlayerState
    if (state.ready) {
      return
    }
    // Only the still-pending ships - isValidPlacement already avoids the cells of whatever this player placed
    // manually before running out of time, so there is nothing to undo first.
    player.shipFleet = [...player.shipFleet, ...generateRandomFleet(state.pending, player.board, true)]
    state.pending = []
    state.ready = true
    renderPanel(session, player)
  })
  beginOrdering(session, root)
  session.onTimerChange()
}

/** The Ready button: locks a player's own fleet in once nothing is left pending. */
export const readyRemotePlayer = (player: Player): void => {
  const root = jsonDom.getTopParentItem(player as unknown as DomItem) as DomItemRoot
  const session = activeSession(player as unknown as DomItem)
  const state = session.playerState.get(player) as RemotePlayerState
  if (state.pending.length > 0) {
    return
  }
  state.ready = true
  renderPanel(session, player)
  checkAllReady(session, root)
}

/** The Randomise button: re-rolls just this player's own remaining fleet, same as local placement's own version. */
export const randomiseRemoteShips = (player: Player): void => {
  const session = activeSession(player as unknown as DomItem)
  const state = session.playerState.get(player) as RemotePlayerState
  if (state.ready) {
    return
  }
  matrixDom.getAllPoints(player.board).filter(p => p.z === 0).forEach(p => {
    const tile = matrixDom.getDomItemFromPoint(p, player.board) as unknown as DomItem
    jsonDom.updateElement(siFunciona.mergeObjectsMutable(tile, { hasShip: false, attributes: { style: { backgroundColor: '' } } }) as DomItem)
  })
  player.shipFleet = generateRandomFleet(defaultShipSpecs, player.board, true)
  state.pending = []
  state.start = null
  renderPanel(session, player)
}

/** The Set order button: from here, clicking each player's board in turn (see pickOrderPlayer) sets the order. */
export const beginOrderSet = (item: DomItem): void => {
  const session = activeSession(item)
  if (session.stage !== 'choosing') {
    return
  }
  session.stage = 'ordering'
  session.order = []
  const root = jsonDom.getTopParentItem(item) as DomItemRoot
  session.players.forEach(player => update(player as unknown as DomItem, { 'data-pickable': 'true' }))
  updateOrderingPanel(session, root)
}

/** Outline one player's panel, and clear the outline from the others - the random order's own shuffle animation. */
const highlightOnly = (session: RemotePlacementState, chosen: Player): void => {
  session.players.forEach(player => update(player as unknown as DomItem, { style: { outline: player === chosen ? '3px solid yellow' : 'none' } }))
}

/** A shuffled copy of the players, in a random order - identical to local placement's own version. */
const shuffle = (players: Player[]): Player[] => {
  const copy = [...players]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = siFunciona.randomInteger(i + 1)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** The Random button: a short highlight passes over the players, then lands on a full random order. */
export const chooseOrderRandom = (item: DomItem): void => {
  const session = activeSession(item)
  if (session.stage !== 'choosing') {
    return
  }
  session.stage = 'shuffling'
  const root = jsonDom.getTopParentItem(item) as DomItemRoot
  updateOrderingPanel(session, root)
  const shuffled = shuffle(session.players)
  const steps = 12
  for (let i = 0; i < steps; i++) {
    queueTimeout(item, () => highlightOnly(session, session.players[siFunciona.randomInteger(session.players.length)]), 120)
  }
  queueTimeout(item, () => {
    session.players.forEach(player => update(player as unknown as DomItem, { style: { outline: 'none' } }))
    session.order = shuffled
    finishOrdering(session, root)
  }, 120)
}

/** The order is set (either way) - show it briefly, then begin the round. */
const finishOrdering = (session: RemotePlacementState, root: DomItemRoot): void => {
  session.stage = 'chosen'
  session.players.forEach(player => update(player as unknown as DomItem, { 'data-pickable': 'false' }))
  updateOrderingPanel(session, root)
  update(child(root.body, 'remote-ordering'), { style: { display: 'none' } })
  setStatsShown(session.players, true)
  sessions.delete(root)
  session.done(session.order)
}
