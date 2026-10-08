import jsonDom from 'json-dom'
import { onGameUpdate, sendGameAction } from './lobbySocket'
import type { DomItem, DomItemRoot } from 'json-dom/dist/domItem/types'

/** Remove every one of a parent's children - the same pattern startNewGame's clearBody uses locally. */
const clearChildren = (parent: DomItem): void => {
  for (let i = parent.children.length - 1; i >= 0; --i) {
    jsonDom.removeChild(parent, parent.children[i])
  }
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

/**
 * Start rendering and interacting with a remote game, reusing the app's own existing root rather than a second
 * one (a second documentDomItem() would claim the same real document.head/body the app's own root already has -
 * exactly the collision the server's own per-room roots had to avoid, see server/gameplay.ts). Every click/change
 * on the rendered tree is forwarded to the server instead of run locally (setForwardEvents) - the server's own
 * receiveForwardedEvent resolves and dispatches it, and the resulting gameUpdate re-renders this same tree fresh.
 * Leaving the lobby's own listeners (presetListener, remoteListener, ...) alone is safe because the lobby's own
 * markup is no longer in the tree by the time this runs - clearChildren above already removed it.
 * @param root
 * @param firstUpdate the redacted body already received (the game has already started by the time this is called)
 */
export const enterRemoteGame = (root: DomItemRoot, firstUpdate: object): void => {
  jsonDom.setForwardEvents(sendGameAction, root)
  renderInto(root, firstUpdate)
  onGameUpdate(redactedBody => renderInto(root, redactedBody))
}

/** Stop forwarding and clear whatever the remote game last rendered, so the root can go back to running locally. */
export const leaveRemoteGame = (root: DomItemRoot): void => {
  delete root.forwardEvents
  clearChildren(root.body)
}
