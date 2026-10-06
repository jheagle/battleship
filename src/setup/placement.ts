import jsonDom from 'json-dom'
import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'
import { defaultShipSpecs } from './defaultFleet'
import generateRandomFleet from './generateRandomFleet'
import placementPanel from '../components/layout/placementPanel'
import updatePlayerStats from '../attack/updatePlayerStats'
import { isValidPlacement, placeShip } from './placeShip'
import checkIfShipCell from '../utils/checkIfShipCell'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Point } from 'matrix-dom/dist/point/types'
import type { Board, Player, ShipSpec, Tile } from '../types'

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
  done: () => void
  ready: boolean
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
 * Show the panel and start with the first human's handoff. `done` runs once every human has placed.
 * @param players
 * @param body
 * @param done
 */
export const startPlacement = (players: Player[], body: DomItem, done: () => void): void => {
  const humans = players.filter(player => !player.isRobot)
  if (!humans.length) {
    done()
    return
  }
  const panel = jsonDom.renderHtml(jsonDom.createDomItem(placementPanel()), body) as unknown as DomItem
  session = { players, humans, index: 0, pending: [], start: null, panel, done, ready: false }
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

const setButtons = ({ continueShown, placingShown, doneEnabled = false }: { continueShown: boolean, placingShown: boolean, doneEnabled?: boolean }): void => {
  update(child(active().panel, 'placement-continue'), { style: { display: continueShown ? '' : 'none' } })
  update(child(active().panel, 'placement-randomise'), { style: { display: placingShown ? '' : 'none' } })
  update(child(active().panel, 'placement-done'), { style: { display: placingShown ? '' : 'none' }, disabled: !doneEnabled })
}

const showOnly = (player: Player | null): void => {
  active().players.forEach(p => update(p as unknown as DomItem, { style: { display: p === player ? '' : 'none' } }))
}

const current = (): Player => active().humans[active().index]

const showHandoff = (): void => {
  showOnly(null)
  setMessage(`${current().name}: the other players look away. Press Continue when you are ready to place your ships.`)
  setButtons({ continueShown: true, placingShown: false })
}

const showPlacing = (): void => {
  showOnly(current())
  const next = active().pending[0]
  setMessage(next ? `Place your ${next.name} (${next.size} cells): click where it starts, then where it ends.` : 'All placed. Press Done to continue.')
  setButtons({ continueShown: false, placingShown: true, doneEnabled: !active().pending.length })
}

/**
 * Continue: from a handoff it starts that player's placement; from the ready screen it starts the round.
 */
export const continueTurn = (): void => {
  if (active().ready) {
    startRound()
    return
  }
  active().pending = [...defaultShipSpecs]
  active().start = null
  showPlacing()
}

const highlightStart = (point: Point | null): void => {
  const board = current().board
  matrixDom.getAllPoints(board).filter(p => p.z === 0).forEach(p => {
    const tile = matrixDom.getDomItemFromPoint(p, board) as unknown as DomItem
    update(tile, { style: { outline: point && p.x === point.x && p.y === point.y ? '3px solid yellow' : '' } })
  })
}

/**
 * A click on a board during placement: the first click sets where a ship starts, the second where it ends. An invalid
 * second click is refused and the start is forgotten.
 * @param tile
 * @param board the board that was clicked, which must be the current player's
 */
export const placeCell = (tile: Tile, board: Board): void => {
  const player = current()
  const point = tile.point
  const next = active().pending[0]
  if (!next || board !== player.board) {
    return
  }
  if (!active().start) {
    active().start = point
    highlightStart(point)
    setMessage(`${next.name}: now click where it ends.`)
    return
  }
  const start = active().start
  active().start = null
  highlightStart(null)
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
    active().pending.shift()
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
 * Every human has placed: hide every board (and so its ships), then ask all players to confirm they are ready. The
 * ships are cleared only now, while no board is showing, so they cannot be seen fading out.
 */
const showReady = (): void => {
  showOnly(null)
  active().humans.forEach(hideShips)
  active().ready = true
  setMessage('All players are ready. Press Continue to start the round.')
  setButtons({ continueShown: true, placingShown: false })
}

/**
 * The round starts: every board and its stats are shown, and the placement panel goes.
 */
const startRound = (): void => {
  const { done, players, panel } = active()
  update(panel, { style: { display: 'none' } })
  players.forEach(p => update(p as unknown as DomItem, { style: { display: '' } }))
  setStatsShown(players, true)
  session = null
  done()
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
