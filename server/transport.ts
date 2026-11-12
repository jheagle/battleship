import jsonDom from 'json-dom'
import type { DomItem } from 'json-dom/dist/domItem/types'

/**
 * A copy of an item (and, the same way, of every descendant) without the properties that point at one of its own
 * children: a player keeps its board in `children` and also as `player.board` (and its stats as `player.playerStats`).
 * In memory those are one object, but JSON writes it out twice, which was about half of every push (a board is ~32 KB
 * of JSON). The child is kept, the shortcut to it is left out: a remote client renders the tree, it never reads them.
 * @param item
 */
export const withoutChildAliases = (item: DomItem): DomItem => {
  if (!item || typeof item !== 'object' || !Array.isArray(item.children)) {
    return item
  }
  const copy: Record<string, unknown> = {}
  for (const key of Object.keys(item)) {
    const value = (item as unknown as Record<string, unknown>)[key]
    if (key !== 'children' && value && typeof value === 'object' && item.children.includes(value as DomItem)) {
      continue
    }
    copy[key] = value
  }
  copy.children = item.children.map(withoutChildAliases)
  return copy as unknown as DomItem
}

/**
 * A redacted body, as sent over the wire: still circularly linked in memory (parentItem, matrix-dom's own
 * internal references) like any live DomItem, which socket.io's own payload encoding cannot walk directly - this
 * strips exactly what domItemToJson already strips for any other json-dom consumer (element/parentItem/...), then
 * parses it straight back to a plain object, since socket.io does its own JSON encoding over the wire. Each child is
 * written once (see withoutChildAliases).
 * @param body
 */
export const forTransport = (body: DomItem): object => JSON.parse(jsonDom.domItemToJson(withoutChildAliases(body)))
