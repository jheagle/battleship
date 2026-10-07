import jsonDom from 'json-dom'
import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'
import { defaultShipSpecs } from './defaultFleet'
import generateRandomFleet from './generateRandomFleet'
import placementPanel from '../components/layout/placementPanel'
import { getSession } from './gameSession'
import queueTimeout from '../queue'
import updatePlayerStats from '../attack/updatePlayerStats'
import { isValidPlacement, placeShip } from './placeShip'
import checkIfShipCell from '../utils/checkIfShipCell'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Point } from 'matrix-dom/dist/point/types'
import type { Board, Player, ShipSpec, Tile } from '../types'

/**
 * Where the placement phase is:
 * - handoff: the next human is asked to take over
 * - placing: that human places their ships
 * - ready: every human has placed, and the round starts when they press Continue (one human, or robots only)
 * - choosing: several players, who will choose who goes first (Random, or Set order)
 * - ordering: the order is being set by clicking each player's board in turn
 * - shuffling: Random is picking the order, with a short animation
 * - chosen: the order is set, and the round starts when they press Continue
 */
type Stage = 'handoff' | 'placing' | 'ready' | 'choosing' | 'ordering' | 'shuffling' | 'chosen'

/**
 * One placement phase: each human places their fleet in turn, while the others look away. `pending` holds the ships the
 * current player has still to place, and `start` the first cell of a ship once it has been clicked. One of these lives
 * on each game's own session (see gameSession), so two games placing at once never interfere.
 */
export interface PlacementSession {
  players: Player[]
  humans: Player[]
  index: number
  pending: ShipSpec[]
  start: Point | null
  panel: DomItem
  stage: Stage
  order: Player[]
  done: (order: Player[]) => void
}

const active = (item: DomItem): PlacementSession => {
  const session = getSession(item).placement
  if (!session) {
    throw new Error('No placement is running')
  }
  return session
}

const child = (item: DomItem, className: string): DomItem => jsonDom.getChildrenByClass(className, item)[0]

const update = (item: DomItem, attributes: object): void => {
  jsonDom.updateElement(siFunciona.mergeObjectsMutable(item, { attributes }) as DomItem)
}

/**
 * The label above a player's board, which shows their place in the order.
 * @param player
 * @param text
 */
const setBadge = (player: Player, text: string): void => update(child(player as unknown as DomItem, 'turn-badge'), { innerHTML: text })

/** The name field on the placement panel. */
const nameInput = (session: PlacementSession): HTMLInputElement => child(session.panel, 'placement-name').element as HTMLInputElement

/**
 * Save the name typed for a player, if one was typed. The default name (Player N) is kept otherwise.
 * @param session
 * @param player
 */
const readName = (session: PlacementSession, player: Player): void => {
  const name = nameInput(session).value.trim()
  if (name) {
    player.name = name
    updatePlayerStats(player)
  }
}

/** Whether a placement phase is running for this item's game, so board clicks are placements rather than attacks. */
export const isPlacing = (item: DomItem): boolean => getSession(item).placement !== null

/**
 * Show the panel and start with the first human's handoff. `done` runs once the round is ready to start, with the order
 * the players will take turns in. With several players that order is chosen here; otherwise it is the seat order.
 * @param players
 * @param body
 * @param done
 */
export const startPlacement = (players: Player[], body: DomItem, done: (order: Player[]) => void): void => {
  const humans = players.filter(player => !player.isRobot)
  if (!humans.length) {
    done(players)
    return
  }
  const panel = jsonDom.renderHtml(jsonDom.createDomItem(placementPanel()), body) as unknown as DomItem
  const session: PlacementSession = { players, humans, index: 0, pending: [], start: null, panel, stage: 'handoff', order: [], done }
  getSession(body).placement = session
  setStatsShown(players, false)
  if (humans.length === 1) {
    // One human has no one to hand over to, so they place straight away
    session.stage = 'placing'
    session.pending = [...defaultShipSpecs]
    nameInput(session).value = humans[0].name
    showPlacing(session)
    return
  }
  showHandoff(session)
}

/**
 * Show or hide every player's stats (health, and the hint checkbox), which are not wanted during placement.
 * @param players
 * @param shown
 */
const setStatsShown = (players: Player[], shown: boolean): void => {
  players.forEach(p => update(p.playerStats as DomItem, { style: { display: shown ? '' : 'none' } }))
}

const setMessage = (session: PlacementSession, text: string): void => update(child(session.panel, 'placement-message'), { innerHTML: text })

interface Buttons {
  continueShown?: boolean
  placingShown?: boolean
  doneEnabled?: boolean
  randomShown?: boolean
  orderShown?: boolean
  nameShown?: boolean
}

const setButtons = (session: PlacementSession, { continueShown = false, placingShown = false, doneEnabled = false, randomShown = false, orderShown = false, nameShown = false }: Buttons): void => {
  const shown = (on: boolean) => ({ style: { display: on ? '' : 'none' } })
  update(child(session.panel, 'placement-name'), shown(nameShown))
  update(child(session.panel, 'placement-continue'), shown(continueShown))
  update(child(session.panel, 'placement-randomise'), shown(placingShown))
  update(child(session.panel, 'placement-done'), { ...shown(placingShown), disabled: !doneEnabled })
  update(child(session.panel, 'begin-random'), shown(randomShown))
  update(child(session.panel, 'begin-order'), shown(orderShown))
}

/**
 * Show only this player's board, or with null hide every board.
 * @param session
 * @param player
 */
const showOnly = (session: PlacementSession, player: Player | null): void => {
  session.players.forEach(p => update(p as unknown as DomItem, { style: { display: p === player ? '' : 'none' } }))
}

/**
 * Show every board, so the players can see and click each other's.
 */
const showAll = (session: PlacementSession): void => {
  session.players.forEach(p => update(p as unknown as DomItem, { style: { display: '' } }))
}

const current = (session: PlacementSession): Player => session.humans[session.index]

const showHandoff = (session: PlacementSession): void => {
  session.stage = 'handoff'
  showOnly(session, null)
  setMessage(session, `${current(session).name}: the other players look away. Press Continue when you are ready to place your ships.`)
  // Filled in once for this player; it is not reset while they place, so a name typed there is kept
  nameInput(session).value = current(session).name
  setButtons(session, { continueShown: true, nameShown: true })
}

const showPlacing = (session: PlacementSession): void => {
  showOnly(session, current(session))
  const next = session.pending[0]
  setMessage(session, next ? `Place your ${next.name} (${next.size} cells): click where it starts, then where it ends.` : 'All placed. Press Done to continue.')
  setButtons(session, { placingShown: true, doneEnabled: !session.pending.length, nameShown: true })
}

/**
 * Continue: from a handoff it starts that player's placement; from the ready screen it starts the round.
 * @param item
 */
export const continueTurn = (item: DomItem): void => {
  const session = active(item)
  if (session.stage === 'ready') {
    startRound(session, session.players)
  } else if (session.stage === 'chosen') {
    startRound(session, session.order)
  } else if (session.stage === 'handoff') {
    session.stage = 'placing'
    session.pending = [...defaultShipSpecs]
    session.start = null
    showPlacing(session)
  }
}

/**
 * Show where a ship has started, and the cells it could end on: every cell in a straight line from the start which would
 * be a valid placement. Clicking the start again, or any other cell which is not valid, cancels the start. With no start
 * (null) every mark is removed.
 * @param session
 * @param point
 * @param size
 */
const showStart = (session: PlacementSession, point: Point | null, size: number): void => {
  const board = current(session).board
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

/**
 * The number of cells a ship of this size could end on from the start, so the message can say when there are none.
 * @param session
 * @param start
 * @param size
 */
const endCount = (session: PlacementSession, start: Point, size: number): number => matrixDom.getAllPoints(current(session).board)
  .filter(p => p.z === 0 && !(p.x === start.x && p.y === start.y))
  .filter(p => isValidPlacement(current(session).board, start, p, size)).length

/**
 * A click on a board: during placement, the first click sets where a ship starts and the second where it ends (an
 * invalid second click is refused and the start is forgotten). While the order is being set, a click picks that player.
 * @param tile
 * @param board the board that was clicked
 */
export const placeCell = (tile: Tile, board: Board): void => {
  const session = active(tile)
  if (session.stage === 'ordering') {
    pickPlayer(session, board)
    return
  }
  const player = current(session)
  const point = tile.point
  const next = session.pending[0]
  if (session.stage !== 'placing' || !next || board !== player.board) {
    return
  }
  if (!session.start) {
    session.start = point
    showStart(session, point, next.size)
    setMessage(session, endCount(session, point, next.size)
      ? `${next.name}: click one of the dashed green cells where it should end. Click the start again to cancel.`
      : `${next.name}: no room for it to go from here. Click the start again to choose another start.`)
    return
  }
  const start = session.start
  session.start = null
  showStart(session, null, next.size)
  if (!start) {
    return
  }
  if (start.x === point.x && start.y === point.y) {
    setMessage(session, `${next.name}: click where it starts, then where it ends.`)
    return
  }
  if (!isValidPlacement(player.board, start, point, next.size)) {
    setMessage(session, `That is not a valid place for the ${next.name}. Click where it starts, then where it ends.`)
    return
  }
  const ship = placeShip(player.board, next, start, point, true)
  if (ship) {
    player.shipFleet.push(ship)
    session.pending.shift()
    updatePlayerStats(player)
  }
  showPlacing(session)
}

/**
 * Clear the current player's board, then place their whole fleet at random.
 * @param item
 */
export const randomise = (item: DomItem): void => {
  const session = active(item)
  const player = current(session)
  matrixDom.getAllPoints(player.board).filter(p => p.z === 0).forEach(p => {
    const tile = matrixDom.getDomItemFromPoint(p, player.board) as unknown as DomItem
    jsonDom.updateElement(siFunciona.mergeObjectsMutable(tile, { hasShip: false, attributes: { style: { backgroundColor: '' } } }) as DomItem)
  })
  player.shipFleet = generateRandomFleet(defaultShipSpecs, player.board, true)
  session.pending = []
  session.start = null
  updatePlayerStats(player)
  showPlacing(session)
}

/**
 * Hide a player's ships again: during placement they are shaded so the player can see them, and in play they must not be.
 * @param player
 */
const hideShips = (player: Player): void => {
  matrixDom.getAllPoints(player.board).filter(p => p.z === 0).forEach(p => {
    const tile = matrixDom.getDomItemFromPoint(p, player.board) as unknown as DomItem
    if (checkIfShipCell(p, player.board)) {
      // Switch the transition off for this change only, so the shading goes at once rather than fading out
      update(tile, { style: { transition: 'none', backgroundColor: '' } })
      update(tile, { style: { transition: '' } })
    }
  })
}

/**
 * Every human has placed. With several players, the boards are shown again and they choose who goes first. With one
 * human, or robots only, the boards are hidden and everyone is asked to confirm. The ships are cleared while no board
 * is showing, so they cannot be seen fading out.
 * @param session
 */
const showReady = (session: PlacementSession): void => {
  session.humans.forEach(hideShips)
  if (session.humans.length > 1) {
    session.stage = 'choosing'
    showAll(session)
    setStatsShown(session.players, true)
    setMessage(session, 'All players are ready. Choose who goes first: Random, or set the order by clicking each player\'s board in turn.')
    setButtons(session, { randomShown: true, orderShown: true })
    return
  }
  session.stage = 'ready'
  showOnly(session, null)
  setMessage(session, 'All players are ready. Press Continue to start the round.')
  setButtons(session, { continueShown: true })
}

/**
 * Set the order by clicking the boards: each click adds that player to the end of the order.
 * @param item
 */
export const chooseOrder = (item: DomItem): void => {
  const session = active(item)
  session.stage = 'ordering'
  session.order = []
  showAll(session)
  session.players.forEach(p => {
    setBadge(p, '')
    update(p as unknown as DomItem, { 'data-pickable': 'true' })
  })
  setMessage(session, `Click each player's board in turn. The first one you click goes first.`)
  setButtons(session, { orderShown: true })
}

/**
 * The word for a place in the order: 1st, 2nd, 3rd, then 4th and so on.
 * @param place
 */
const ordinal = (place: number): string => {
  const suffix = place % 10 === 1 && place % 100 !== 11 ? 'st' : place % 10 === 2 && place % 100 !== 12 ? 'nd' : place % 10 === 3 && place % 100 !== 13 ? 'rd' : 'th'
  return `${place}${suffix}`
}

/**
 * Add a clicked board's player to the end of the order, and finish once everyone is in it.
 * @param session
 * @param board
 */
const pickPlayer = (session: PlacementSession, board: Board): void => {
  const player = session.players.find(p => p.board === board)
  if (!player || session.order.includes(player)) {
    return
  }
  session.order.push(player)
  setBadge(player, ordinal(session.order.length))
  if (session.order.length < session.players.length) {
    setMessage(session, `${session.order.map(p => p.name).join(', ')} so far. Click the next player in turn.`)
    return
  }
  showOrder(session)
}

/**
 * Show the order which has been set, and wait for Continue to start.
 * @param session
 */
const showOrder = (session: PlacementSession): void => {
  session.stage = 'chosen'
  showAll(session)
  session.players.forEach(p => update(p as unknown as DomItem, { 'data-pickable': 'false' }))
  setMessage(session, `${session.order.map(p => p.name).join(', then ')} will take turns, in that order. Press Continue to start.`)
  setButtons(session, { continueShown: true, orderShown: true })
}

/**
 * Random: a short highlight passes over the players, then lands on a full random order.
 * @param item
 */
export const randomOrder = (item: DomItem): void => {
  const session = active(item)
  session.stage = 'shuffling'
  session.players.forEach(p => update(p as unknown as DomItem, { 'data-pickable': 'false' }))
  setButtons(session, {})
  setMessage(session, 'Choosing at random...')
  const shuffled = shuffle(session.players)
  const steps = 12
  for (let i = 0; i < steps; i++) {
    queueTimeout(item, () => highlightOnly(session, session.players[siFunciona.randomInteger(session.players.length)]), 120)
  }
  queueTimeout(item, () => {
    session.players.forEach(p => update(p as unknown as DomItem, { style: { outline: 'none' } }))
    session.order = shuffled
    session.order.forEach((p, i) => setBadge(p, ordinal(i + 1)))
    showOrder(session)
  }, 120)
}

/**
 * A shuffled copy of the players, in a random order.
 * @param players
 */
const shuffle = (players: Player[]): Player[] => {
  const copy = [...players]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = siFunciona.randomInteger(i + 1)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Outline one player's panel, and clear the outline from the others.
 * @param session
 * @param chosen
 */
const highlightOnly = (session: PlacementSession, chosen: Player): void => {
  session.players.forEach(p => update(p as unknown as DomItem, { style: { outline: p === chosen ? '3px solid yellow' : 'none' } }))
}

/**
 * Put the boards in turn order, so the page reads in the order play will go in, and turns follow it. The game's tree and
 * the page are both reordered: moving a panel with json-dom would detach it from the page.
 * @param order
 */
const reorderBoards = (order: Player[]): void => {
  const boards = jsonDom.getParentsByClass('boards', order[0])[0]
  boards.children = [...order]
  order.forEach(player => boards.element.appendChild(player.element))
}

/**
 * The round starts: every board and its stats are shown in turn order, and the placement panel goes.
 * @param session
 * @param order
 */
const startRound = (session: PlacementSession, order: Player[]): void => {
  const { done, players, panel } = session
  update(panel, { style: { display: 'none' } })
  if (order.length > 1 && order !== players) {
    reorderBoards(order)
  }
  players.forEach(p => {
    setBadge(p, '')
    update(p as unknown as DomItem, { style: { display: '', outline: 'none' } })
  })
  setStatsShown(players, true)
  getSession(order[0] as unknown as DomItem).placement = null
  done(order)
}

/**
 * The player is happy with their fleet: the next human places, or, after the last, everyone is asked to confirm.
 * @param item
 */
export const finishTurn = (item: DomItem): void => {
  const session = active(item)
  if (session.pending.length) {
    return
  }
  const finished = current(session)
  readName(session, finished)
  if (session.index + 1 < session.humans.length) {
    session.index++
    showHandoff(session)
    hideShips(finished)
    return
  }
  if (session.humans.length === 1) {
    hideShips(finished)
    startRound(session, session.players)
    return
  }
  showReady(session)
}
