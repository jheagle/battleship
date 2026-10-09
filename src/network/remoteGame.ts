import jsonDom from 'json-dom'
import { onGameUpdate, sendGameAction } from './lobbySocket'
import type { DomItem, DomItemRoot } from 'json-dom/dist/domItem/types'

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
    jsonDom.removeChild(parent, parent.children[i])
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
// PLACEMENT_TIMEOUT_MS), so it is kept entirely outside json-dom's own tree: renderInto below wipes and rebuilds
// root.body's children on every single update, which would reset a ticking display right as it ticks. Plain DOM
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
  countdownElement.style.cssText = 'position: fixed; top: 0.5em; right: 0.5em; padding: 0.4em 0.8em; ' +
    'background: #222; color: #fff; border-radius: 4px; font: 14px sans-serif; z-index: 1000;'
  document.body.appendChild(countdownElement)
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

/**
 * Replace the root's own body content with a freshly-inflated redacted body's children, rendered directly as the
 * body's own children - not nested one level deeper under some other wrapper - so a path captured from this tree
 * (getItemPath) and one resolved against the server's own root (getItemByPath) agree: both are root -> body ->
 * [boards, placement panel], the exact shape redactGameBody sends.
 * @param root
 * @param redactedBody
 */
const renderInto = (root: DomItemRoot, redactedBody: object): void => {
  clearChildren(root.body)
  const inflated = jsonDom.jsonToDomItem(JSON.stringify(redactedBody))
  inflated.children.forEach((child: DomItem) => {
    // jsonToDomItem already set child.parentItem - to the throwaway top-level body it was inflated as part of,
    // not root.body. Left alone, renderHtml sees a non-null parentItem and assumes the item is already correctly
    // attached somewhere, skipping the fresh-tree setup (setParentItemReferences + insertChild) that binding any
    // listener nested within it depends on. Clearing it first forces that setup, now relative to root.body.
    child.parentItem = null
    jsonDom.renderHtml(child, root.body)
  })
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
 * receiveForwardedEvent resolves and dispatches it, and the resulting gameUpdate re-renders this same tree fresh.
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
  jsonDom.setForwardEvents(sendGameAction, root)
  // Whether a click within the tree about to be rendered forwards to the server or runs a real local listener
  // is decided once, right here, by json-dom's own activateListener/retrieveListener - at *bind* time, when
  // renderInto below actually attaches it to the real element. Toggling root.forwardEvents afterwards has no
  // effect on anything already bound, so it has to be settled before renderInto ever runs, not after.
  const firstOver = isGameOver(firstUpdate)
  if (firstOver) {
    stopForwarding(root)
  }
  renderInto(root, firstOver ? finalScoreOnly(firstUpdate) : firstUpdate)
  setCountdownDeadline(deadlineOf(firstUpdate))
  onGameUpdate(redactedBody => {
    const over = isGameOver(redactedBody as RedactedBody)
    if (over) {
      stopForwarding(root)
    } else if (!root.forwardEvents) {
      jsonDom.setForwardEvents(sendGameAction, root)
    }
    renderInto(root, over ? finalScoreOnly(redactedBody as RedactedBody) : (redactedBody as RedactedBody))
    setCountdownDeadline(deadlineOf(redactedBody as RedactedBody))
  })
}

/** Stop forwarding and clear whatever the remote game last rendered, so the root can go back to running locally. */
export const leaveRemoteGame = (root: DomItemRoot): void => {
  stopForwarding(root)
  clearChildren(root.body)
}
