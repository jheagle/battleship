/**
 * @jest-environment node
 */
import './installPseudoDom'
import jsonDom from 'json-dom'
import { startRoomGame, watchRoomGame } from './gameplay'
import { forTransport, withoutChildAliases } from './transport'
import type { DomItem } from 'json-dom/dist/domItem/types'

/** The first push one viewer of a fresh two-player room gets. */
const firstPush = (): DomItem => {
  const game = startRoomGame([['alice-socket', 'Alice'], ['bob-socket', 'Bob']], 'optional')
  let body: DomItem | undefined
  watchRoomGame(game, (socketId, redactedBody) => {
    if (socketId === 'alice-socket' && !body) {
      body = redactedBody
    }
  })
  return body as DomItem
}

/** Every player object in a transported body. */
const playersIn = (item: any): any[] => (item.attributes?.className ?? '').split(' ').includes('player')
  ? [item]
  : (item.children ?? []).flatMap(playersIn)

/** A transported body as it was sent before: every alias written out in full. */
const withAliases = (body: DomItem): any => JSON.parse(jsonDom.domItemToJson(body))

/** The same, with every property that is a copy of one of the object's own children removed. */
const dropCopiesOfChildren = (item: any): any => {
  if (!item || typeof item !== 'object' || !Array.isArray(item.children)) {
    return item
  }
  const childJson = item.children.map((child: any) => JSON.stringify(child))
  const copy: any = {}
  for (const key of Object.keys(item)) {
    if (key !== 'children' && item[key] && typeof item[key] === 'object' && childJson.includes(JSON.stringify(item[key]))) {
      continue
    }
    copy[key] = item[key]
  }
  copy.children = item.children.map(dropCopiesOfChildren)
  return copy
}

describe('sending a redacted body', () => {
  test('a player\'s board and stats are sent once, as children, not again as player.board / player.playerStats', () => {
    // While placing, a viewer's push holds only their own player
    const players = playersIn(forTransport(firstPush()))
    expect(players.length).toBeGreaterThan(0)
    players.forEach(player => {
      expect(player).not.toHaveProperty('board')
      expect(player).not.toHaveProperty('playerStats')
      expect(player.children.some((child: any) => child.has?.['matrix.matrix'])).toBe(true)
    })
  })

  test('nothing else changes: the same tree as before, minus the duplicated copies', () => {
    const body = firstPush()
    expect(forTransport(body)).toEqual(dropCopiesOfChildren(withAliases(body)))
  })

  test('about half the size it was', () => {
    const body = firstPush()
    const before = JSON.stringify(withAliases(body)).length
    const after = JSON.stringify(forTransport(body)).length
    expect(after).toBeLessThan(before * 0.6)
  })

  test('the live tree is not changed: the server keeps player.board for its own game logic', () => {
    const body = firstPush()
    const realPlayers = playersIn(body)
    withoutChildAliases(body)
    realPlayers.forEach(player => expect(player.children).toContain(player.board))
  })
})
