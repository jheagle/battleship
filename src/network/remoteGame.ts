import treeloom from 'treeloom'
import treeloomMatrix from 'treeloom-matrix'
import { onGameUpdate, sendGameAction } from './lobbySocket'
import type { DomItem, DomItemRoot } from 'treeloom/dist/domItem/types'
import type { Point } from 'treeloom-matrix/dist/point/types'
import type { Board } from '../types'

/** A pushed body carries whichever deadline currently applies as a plain attribute - see remotePlacement.ts's
 * startRemotePlacement (placement) and server/gameplay.ts's startRoomGame (turns). At most one is ever actually
 * set at a time - placement/ordering and real turn-based gameplay never overlap - but both linger as empty
 * strings once their own phase ends, rather than being removed outright (see finishOrdering and onGameOver). */
interface RedactedBody {
  attributes?: { 'data-placement-deadline'?: string, 'data-turn-deadline'?: string }
  children: Array<{ attributes?: { className?: string } }>
}

/** Which phase a deadline belongs to - decides the countdown's own label (see renderCountdown). */
type DeadlineKind = 'placement' | 'turn'

/** Remove every one of a parent's children - the same pattern startNewGame's clearBody uses locally. */
const clearChildren = (parent: DomItem): void => {
  for (let i = parent.children.length - 1; i >= 0; --i) {
    treeloom.removeChild(parent, parent.children[i])
  }
}

/** Whichever deadline a pushed body actually carries right now, placement or turn - an empty string (the
 * lingering, no-longer-relevant state left behind once that phase ends) is falsy, same as it being absent
 * altogether, so both read the same way here. */
const deadlineOf = (redactedBody: RedactedBody): { kind: DeadlineKind, deadline: number } | null => {
  const placement = redactedBody.attributes?.['data-placement-deadline']
  if (placement) {
    return { kind: 'placement', deadline: Number(placement) }
  }
  const turn = redactedBody.attributes?.['data-turn-deadline']
  if (turn) {
    return { kind: 'turn', deadline: Number(turn) }
  }
  return null
}

/** Whether a pushed body is the final-score screen (see remoteFinalScore.ts) - the one point in a remote
 * game's own lifecycle where forwarding has to come back off, so its Play Again button's click runs as a real
 * local listener instead of being forwarded into a game that is already over. */
const isGameOver = (redactedBody: RedactedBody): boolean => redactedBody.children.some(child => child.attributes?.className === 'final-scores')

/** A pushed body, reduced to just its final-scores child - server/gameplay.ts's own onGameOver hook already
 * clears everything else before a game-over push ever goes out, but rendering only ever what this module
 * itself has confirmed is the final-score screen, regardless of whatever else might be sitting alongside it,
 * means a future regression upstream (something left in the body that still references a listener name the
 * real client only ever registers as a forwarder, like remotePlacementListener) clears the whole page with
 * nothing on it, instead of just failing to show the one thing that is actually safe to show. */
const finalScoreOnly = (redactedBody: RedactedBody): RedactedBody => ({
  ...redactedBody,
  children: redactedBody.children.filter(child => child.attributes?.className === 'final-scores')
})

// The countdown is cosmetic only (the server's own timer is the one that actually fires - see
// PLACEMENT_TIMEOUT_MS), so it is kept entirely outside treeloom's own tree: renderInto below rebuilds root.body's
// children in full at the start and end of a game, which would reset a ticking display right as it ticks. Plain DOM
// state module-wide is safe because the app only ever has one remote game active (its one real root) at a time -
// see enterRemoteGame's own comment on reusing the app's existing root instead of a second one.
let countdownElement: HTMLElement | null = null
let countdownInterval: ReturnType<typeof setInterval> | null = null
let countdownDeadline: number | null = null
let countdownKind: DeadlineKind | null = null

const COUNTDOWN_LABEL: Record<DeadlineKind, string> = {
  placement: 'Placing ships',
  turn: 'Turn'
}

const renderCountdown = (): void => {
  if (!countdownElement) {
    return
  }
  if (countdownDeadline === null || countdownKind === null) {
    countdownElement.style.display = 'none'
    return
  }
  const secondsLeft = Math.max(0, Math.ceil((countdownDeadline - Date.now()) / 1000))
  countdownElement.style.display = ''
  countdownElement.textContent = `${COUNTDOWN_LABEL[countdownKind]} - ${secondsLeft}s left`
}

/** Create the countdown element if there is not already a live one in the page - not just a non-null reference:
 * something else clearing the page for a fresh game (without going through leaveRemoteGame) can detach the old
 * one from the document while this module's own reference to it lives on. */
const ensureCountdownElement = (): void => {
  if (countdownElement?.isConnected) {
    return
  }
  countdownElement = document.createElement('div')
  countdownElement.className = 'remote-countdown'
  // A timer: shown, not announced every second
  countdownElement.setAttribute('role', 'timer')
  countdownElement.style.cssText = 'position: fixed; top: 0.5em; right: 0.5em; padding: 0.4em 0.8em; ' +
    'background: #222; color: #fff; border-radius: 4px; font: 14px sans-serif; z-index: 1000;'
  // In the page header (a landmark), next to the h1, not loose in the body; fixed to the corner either way
  ;(document.querySelector('header.game-header') ?? document.body).appendChild(countdownElement)
}

/** Start, update, or stop the visual countdown, as each new deadline (or its absence) comes in. */
const setCountdownDeadline = (info: { kind: DeadlineKind, deadline: number } | null): void => {
  countdownKind = info?.kind ?? null
  countdownDeadline = info?.deadline ?? null
  if (info === null) {
    renderCountdown()
    return
  }
  ensureCountdownElement()
  if (countdownInterval === null) {
    countdownInterval = setInterval(renderCountdown, 250)
  }
  renderCountdown()
}

/** Remove the countdown entirely - called once the remote game is left. */
const stopCountdown = (): void => {
  if (countdownInterval !== null) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
  countdownElement?.remove()
  countdownElement = null
  countdownDeadline = null
  countdownKind = null
}

/** Every board (treeloom-matrix matrix) within an item, in tree order. */
const boardsIn = (item: DomItem): Board[] => item.has?.['matrix.matrix']
  ? [item as unknown as Board]
  : (item.children ?? []).flatMap(boardsIn)

/**
 * The cell which has keyboard focus, as the index of its board among the rendered boards and its point, so focus can
 * be put back on the same cell after a re-render; null when focus is not on a board cell.
 * @param root
 */
const focusedCell = (root: DomItemRoot): { board: number, point: Point } | null => {
  const focused = typeof document === 'undefined' ? null : document.activeElement
  const grid = focused?.getAttribute('role') === 'gridcell' ? focused.closest('[role="grid"]') : null
  const body = root.body.element as HTMLElement | undefined
  if (!focused || !grid || !body) {
    return null
  }
  return { board: Array.from(body.querySelectorAll('[role="grid"]')).indexOf(grid), point: treeloomMatrix.getPointFromElement(focused) }
}

/**
 * Whether forwarding was on when each root's game was last rendered in full; only set while a remote game is shown.
 * A push can be reconciled into what is rendered only when forwarding hasn't changed since: treeloom decides whether
 * a listener forwards to the server or runs locally when it binds it, and reconcile keeps every unchanged listener
 * bound as it was.
 */
const fullRenderForwarding = new WeakMap<DomItemRoot, boolean>()

/** Item properties which are the tree itself, not the item's data (reconcile never copies these either). */
const STRUCTURE = new Set(['element', 'parentItem', 'children', 'eventListeners', 'activeListeners'])

/**
 * Inflate a redacted body, with the boards' keyboard navigation (navigableGrid) put back: it is function listeners,
 * which json drops. The Tab stop stays on the cell that had focus. Its listeners run locally even while events are
 * forwarded (treeloom only forwards named listeners), and Enter / Space click the cell, which is forwarded like a
 * mouse click.
 * @param redactedBody
 * @param focus
 */
const inflateBody = (redactedBody: object, focus: { board: number, point: Point } | null): { body: DomItem, boards: Board[] } => {
  const body = treeloom.jsonToDomItem(JSON.stringify(redactedBody))
  const boards = boardsIn(body)
  boards.forEach((board, index) => treeloomMatrix.navigableGrid(board, focus?.board === index ? focus.point : undefined))
  return { body, boards }
}

/**
 * Replace the root's own body content with a freshly-inflated redacted body's children, rendered directly as the
 * body's own children - not nested one level deeper under some other wrapper - so a path captured from this tree
 * (getItemPath) and one resolved against the server's own root (getItemByPath) agree: both are root -> body ->
 * [boards, placement panel], the exact shape redactGameBody sends.
 * @param root
 * @param redactedBody
 */
const renderFresh = (root: DomItemRoot, redactedBody: object): void => {
  const focus = focusedCell(root)
  clearChildren(root.body)
  const { body, boards } = inflateBody(redactedBody, focus)
  body.children.forEach((child: DomItem) => {
    // jsonToDomItem already set child.parentItem - to the throwaway top-level body it was inflated as part of,
    // not root.body. Left alone, renderHtml sees a non-null parentItem and assumes the item is already correctly
    // attached somewhere, skipping the fresh-tree setup (setParentItemReferences + insertChild) that binding any
    // listener nested within it depends on. Clearing it first forces that setup, now relative to root.body.
    child.parentItem = null
    treeloom.renderHtml(child, root.body)
  })
  // The whole tree was rendered again, so keyboard focus would fall back to the page: return it to the same cell
  const refocus = focus && boards[focus.board] ? treeloomMatrix.getDomItemFromPoint(focus.point, boards[focus.board]) : false
  ;(refocus ? refocus.element as HTMLElement | undefined : undefined)?.focus()
  fullRenderForwarding.set(root, Boolean(root.forwardEvents))
}

/**
 * Update what is rendered to match a push, changing only what differs (treeloom's reconcile): elements, focus and
 * keyboard navigation stay where they are. The push's top level is a <body> while the game renders into the root's
 * own body (a <main> in a browser, see gameRoot), so the push's children are reconciled into root.body and root.body
 * keeps its own node name, attributes and data.
 * @param root
 * @param redactedBody
 */
const renderChanges = (root: DomItemRoot, redactedBody: object): void => {
  const { body } = inflateBody(redactedBody, focusedCell(root))
  const existing = root.body as unknown as Record<string, unknown>
  const next = body as unknown as Record<string, unknown>
  for (const key of Object.keys(next)) {
    if (!STRUCTURE.has(key)) {
      delete next[key]
    }
  }
  for (const key of Object.keys(existing)) {
    if (!STRUCTURE.has(key)) {
      next[key] = existing[key]
    }
  }
  treeloom.reconcile(root.body, body)
}

/**
 * Show a push: reconciled into what is already rendered when it can be (same game, forwarding unchanged), otherwise
 * rendered in full (the first push, and the switches between a game and its final scores).
 * @param root
 * @param redactedBody
 */
const renderInto = (root: DomItemRoot, redactedBody: object): void => {
  if (fullRenderForwarding.get(root) === Boolean(root.forwardEvents)) {
    renderChanges(root, redactedBody)
  } else {
    renderFresh(root, redactedBody)
  }
}

/** Stop forwarding (and the countdown, which can't be running once the game has ended anyway) without touching
 * whatever is currently rendered - used once the game is actually over, so the final score screen's own Play
 * Again button (already rendered by the same push that triggered this) resolves to a real local listener on
 * its next click instead of being forwarded into a game that no longer exists. */
const stopForwarding = (root: DomItemRoot): void => {
  delete root.forwardEvents
  stopCountdown()
}

/**
 * Start rendering and interacting with a remote game, reusing the app's own existing root rather than a second
 * one (a second documentDomItem() would claim the same real document.head/body the app's own root already has -
 * exactly the collision the server's own per-room roots had to avoid, see server/gameplay.ts). Every click/change
 * on the rendered tree is forwarded to the server instead of run locally (setForwardEvents) - the server's own
 * receiveForwardedEvent resolves and dispatches it, and the resulting gameUpdate is reconciled into this same tree.
 * Leaving the lobby's own listeners (presetListener, remoteListener, ...) alone is safe because the lobby's own
 * markup is no longer in the tree by the time this runs - clearChildren above already removed it.
 *
 * Forwarding comes back off once the game actually ends (see isGameOver/stopForwarding) - the final-score
 * screen's own Play Again button needs to run as a real local listener, not a forwarded one - and back on
 * again for whatever the next gameUpdate turns out to be once Play Again succeeds and a fresh game starts.
 * @param root
 * @param firstUpdate the redacted body already received (the game has already started by the time this is called)
 */
export const enterRemoteGame = (root: DomItemRoot, firstUpdate: RedactedBody): void => {
  treeloom.setForwardEvents(sendGameAction, root)
  // Whether a click within the tree about to be rendered forwards to the server or runs a real local listener
  // is decided once, right here, by treeloom's own activateListener/retrieveListener - at *bind* time, when
  // renderInto below actually attaches it to the real element. Toggling root.forwardEvents afterwards has no
  // effect on anything already bound, so it has to be settled before renderInto ever runs, not after.
  const firstOver = isGameOver(firstUpdate)
  if (firstOver) {
    stopForwarding(root)
  }
  // The lobby's own markup is still rendered: the first push always replaces it in full
  renderFresh(root, firstOver ? finalScoreOnly(firstUpdate) : firstUpdate)
  setCountdownDeadline(deadlineOf(firstUpdate))
  onGameUpdate(redactedBody => {
    const over = isGameOver(redactedBody as RedactedBody)
    if (over) {
      stopForwarding(root)
    } else if (!root.forwardEvents) {
      treeloom.setForwardEvents(sendGameAction, root)
    }
    renderInto(root, over ? finalScoreOnly(redactedBody as RedactedBody) : (redactedBody as RedactedBody))
    setCountdownDeadline(deadlineOf(redactedBody as RedactedBody))
  })
}

/** Stop forwarding and clear whatever the remote game last rendered, so the root can go back to running locally. */
export const leaveRemoteGame = (root: DomItemRoot): void => {
  stopForwarding(root)
  clearChildren(root.body)
  fullRenderForwarding.delete(root)
}
