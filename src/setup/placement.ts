import jsonDom from 'json-dom'
import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'
import { defaultShipSpecs } from './defaultFleet'
import generateRandomFleet from './generateRandomFleet'
import placementPanel from '../components/layout/placementPanel'
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
 * current player has still to place, and `start` the first cell of a ship once it has been clicked.
 */
interface Session {
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

let session: Session | null = null

const active = (): Session => {
  if (!session) {
    throw new Error('No placement is running')
  }
  return session
}

const child = (item: DomItem, className: string): DomItem => jsonDom.getChildrenByClass(className, item)[0]

const update = (item: DomItem, attributes: object): void => {
  jsonDom.updateElement(siFunciona.mergeObjectsMutable(item, { attributes }) as DomItem)
}

/** Whether a placement phase is running, so board clicks are placements rather than attacks. */
export const isPlacing = (): boolean => session !== null

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
  session = { players, humans, index: 0, pending: [], start: null, panel, stage: 'handoff', order: [], done }
  setStatsShown(players, false)
  showHandoff()
}

/**
 * Show or hide every player's stats (health, and the hint checkbox), which are not wanted during placement.
 * @param players
 * @param shown
 */
const setStatsShown = (players: Player[], shown: boolean): void => {
  players.forEach(p => update(p.playerStats as DomItem, { style: { display: shown ? '' : 'none' } }))
}

const setMessage = (text: string): void => update(child(active().panel, 'placement-message'), { innerHTML: text })

interface Buttons {
  continueShown?: boolean
  placingShown?: boolean
  doneEnabled?: boolean
  randomShown?: boolean
  orderShown?: boolean
}

const setButtons = ({ continueShown = false, placingShown = false, doneEnabled = false, randomShown = false, orderShown = false }: Buttons): void => {
  const shown = (on: boolean) => ({ style: { display: on ? '' : 'none' } })
  update(child(active().panel, 'placement-continue'), shown(continueShown))
  update(child(active().panel, 'placement-randomise'), shown(placingShown))
  update(child(active().panel, 'placement-done'), { ...shown(placingShown), disabled: !doneEnabled })
  update(child(active().panel, 'begin-random'), shown(randomShown))
  update(child(active().panel, 'begin-order'), shown(orderShown))
}

/**
 * Show only this player's board, or with null hide every board.
 * @param player
 */
const showOnly = (player: Player | null): void => {
  active().players.forEach(p => update(p as unknown as DomItem, { style: { display: p === player ? '' : 'none' } }))
}

/**
 * Show every board, so the players can see and click each other's.
 */
const showAll = (): void => {
  active().players.forEach(p => update(p as unknown as DomItem, { style: { display: '' } }))
}

const current = (): Player => active().humans[active().index]

const showHandoff = (): void => {
  active().stage = 'handoff'
  showOnly(null)
  setMessage(`${current().name}: the other players look away. Press Continue when you are ready to place your ships.`)
  setButtons({ continueShown: true })
}

const showPlacing = (): void => {
  showOnly(current())
  const next = active().pending[0]
  setMessage(next ? `Place your ${next.name} (${next.size} cells): click where it starts, then where it ends.` : 'All placed. Press Done to continue.')
  setButtons({ placingShown: true, doneEnabled: !active().pending.length })
}

/**
 * Continue: from a handoff it starts that player's placement; from the ready screen it starts the round.
 */
export const continueTurn = (): void => {
  const session = active()
  if (session.stage === 'ready') {
    startRound(session.players)
  } else if (session.stage === 'chosen') {
    startRound(session.order)
  } else if (session.stage === 'handoff') {
    session.stage = 'placing'
    session.pending = [...defaultShipSpecs]
    session.start = null
    showPlacing()
  }
}

/**
 * Show where a ship has started, and the cells it could end on: every cell in a straight line from the start which would
 * be a valid placement. Clicking the start again, or any other cell which is not valid, cancels the start. With no start
 * (null) every mark is removed.
 * @param point
 * @param size
 */
const showStart = (point: Point | null, size: number): void => {
  const board = current().board
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
 * @param start
 * @param size
 */
const endCount = (start: Point, size: number): number => matrixDom.getAllPoints(current().board)
  .filter(p => p.z === 0 && !(p.x === start.x && p.y === start.y))
  .filter(p => isValidPlacement(current().board, start, p, size)).length

/**
 * A click on a board: during placement, the first click sets where a ship starts and the second where it ends (an
 * invalid second click is refused and the start is forgotten). While the order is being set, a click picks that player.
 * @param tile
 * @param board the board that was clicked
 */
export const placeCell = (tile: Tile, board: Board): void => {
  const session = active()
  if (session.stage === 'ordering') {
    pickPlayer(board)
    return
  }
  const player = current()
  const point = tile.point
  const next = session.pending[0]
  if (session.stage !== 'placing' || !next || board !== player.board) {
    return
  }
  if (!session.start) {
    session.start = point
    showStart(point, next.size)
    setMessage(endCount(point, next.size)
      ? `${next.name}: click one of the dashed green cells where it should end. Click the start again to cancel.`
      : `${next.name}: no room for it to go from here. Click the start again to choose another start.`)
    return
  }
  const start = session.start
  session.start = null
  showStart(null, next.size)
  if (!start) {
    return
  }
  if (start.x === point.x && start.y === point.y) {
    setMessage(`${next.name}: click where it starts, then where it ends.`)
    return
  }
  if (!isValidPlacement(player.board, start, point, next.size)) {
    setMessage(`That is not a valid place for the ${next.name}. Click where it starts, then where it ends.`)
    return
  }
  const ship = placeShip(player.board, next, start, point, true)
  if (ship) {
    player.shipFleet.push(ship)
    session.pending.shift()
    updatePlayerStats(player)
  }
  showPlacing()
}

/**
 * Clear the current player's board, then place their whole fleet at random.
 */
export const randomise = (): void => {
  const player = current()
  matrixDom.getAllPoints(player.board).filter(p => p.z === 0).forEach(p => {
    const tile = matrixDom.getDomItemFromPoint(p, player.board) as unknown as DomItem
    jsonDom.updateElement(siFunciona.mergeObjectsMutable(tile, { hasShip: false, attributes: { style: { backgroundColor: '' } } }) as DomItem)
  })
  player.shipFleet = generateRandomFleet(defaultShipSpecs, player.board, true)
  active().pending = []
  active().start = null
  updatePlayerStats(player)
  showPlacing()
}

/**
 * Hide a player's ships again: during placement they are shaded so the player can see them, and in play they must not be.
 * @param player
 */
const hideShips = (player: Player): void => {
  matrixDom.getAllPoints(player.board).filter(p => p.z === 0).forEach(p => {
    const tile = matrixDom.getDomItemFromPoint(p, player.board) as unknown as DomItem
    if (checkIfShipCell(p, player.board)) {
      update(tile, { style: { backgroundColor: '' } })
    }
  })
}

/**
 * Every human has placed. With several players, the boards are shown again and they choose who goes first. With one
 * human, or robots only, the boards are hidden and everyone is asked to confirm. The ships are cleared while no board
 * is showing, so they cannot be seen fading out.
 */
const showReady = (): void => {
  const session = active()
  session.humans.forEach(hideShips)
  if (session.humans.length > 1) {
    session.stage = 'choosing'
    showAll()
    setMessage('All players are ready. Choose who goes first: Random, or set the order by clicking each player\'s board in turn.')
    setButtons({ randomShown: true, orderShown: true })
    return
  }
  session.stage = 'ready'
  showOnly(null)
  setMessage('All players are ready. Press Continue to start the round.')
  setButtons({ continueShown: true })
}

/**
 * Set the order by clicking the boards: each click adds that player to the end of the order.
 */
export const chooseOrder = (): void => {
  const session = active()
  session.stage = 'ordering'
  session.order = []
  showAll()
  setMessage(`Click each player's board in turn. The first one you click goes first.`)
  setButtons({ orderShown: true })
}

/**
 * Add a clicked board's player to the end of the order, and finish once everyone is in it.
 * @param board
 */
const pickPlayer = (board: Board): void => {
  const session = active()
  const player = session.players.find(p => p.board === board)
  if (!player || session.order.includes(player)) {
    return
  }
  session.order.push(player)
  if (session.order.length < session.players.length) {
    setMessage(`${session.order.map(p => p.name).join(', ')} so far. Click the next player in turn.`)
    return
  }
  showOrder()
}

/**
 * Show the order which has been set, and wait for Continue to start.
 */
const showOrder = (): void => {
  const session = active()
  session.stage = 'chosen'
  showAll()
  setMessage(`${session.order.map(p => p.name).join(', then ')} will take turns, in that order. Press Continue to start.`)
  setButtons({ continueShown: true, orderShown: true })
}

/**
 * Random: a short highlight passes over the players, then lands on a full random order.
 */
export const randomOrder = (): void => {
  const session = active()
  session.stage = 'shuffling'
  setButtons({})
  setMessage('Choosing at random...')
  const shuffled = shuffle(session.players)
  const steps = 12
  for (let i = 0; i < steps; i++) {
    queueTimeout(() => highlightOnly(session.players[siFunciona.randomInteger(session.players.length)]), 120)
  }
  queueTimeout(() => {
    session.players.forEach(p => update(p as unknown as DomItem, { style: { outline: 'none' } }))
    session.order = shuffled
    showOrder()
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
 * @param chosen
 */
const highlightOnly = (chosen: Player): void => {
  active().players.forEach(p => update(p as unknown as DomItem, { style: { outline: p === chosen ? '3px solid yellow' : 'none' } }))
}

/**
 * Put the boards in turn order, so the page reads in the order play will go in, and turns follow it.
 * @param order
 */
const reorderBoards = (order: Player[]): void => {
  const boards = jsonDom.getParentsByClass('boards', order[0])[0]
  order.forEach(player => {
    jsonDom.removeChild(boards, player as unknown as DomItem)
    boards.appendChild(player as unknown as DomItem)
  })
}

/**
 * The round starts: every board and its stats are shown in turn order, and the placement panel goes.
 * @param order
 */
const startRound = (order: Player[]): void => {
  const { done, players, panel } = active()
  update(panel, { style: { display: 'none' } })
  if (order.length > 1 && order !== players) {
    reorderBoards(order)
  }
  players.forEach(p => update(p as unknown as DomItem, { style: { display: '', outline: 'none' } }))
  setStatsShown(players, true)
  session = null
  done(order)
}

/**
 * The player is happy with their fleet: the next human places, or, after the last, everyone is asked to confirm.
 */
export const finishTurn = (): void => {
  if (active().pending.length) {
    return
  }
  const finished = current()
  if (active().index + 1 < active().humans.length) {
    active().index++
    showHandoff()
    hideShips(finished)
    return
  }
  showReady()
}
