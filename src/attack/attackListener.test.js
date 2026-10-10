/**
 * @jest-environment jsdom
 */

import attackListener from './attackListener'
import { useGameLifecycle, twoHumans } from '../../tests/helpers/game'

useGameLifecycle()

// The real bug this guards against: matrix-dom's own getDomItemFromElement (still position-based - resolves
// the real click target's point by walking its real DOM ancestry, unrelated to json-dom's own stable ids)
// returns false, not a Tile, when the event's target does not sit where a tile of this specific board is
// expected. Nothing downstream (attackFleet, placeCell, handleRemoteBoardClick) tolerates a bare false - each
// eventually reads .parentItem off it several calls deep (getSession/getTopParentItem), throwing on the
// primitive instead. A crafted or unexpected click should be silently ignored here, not crash the caller -
// found live crashing the whole lobby server for every room, from one such click during real remote gameplay.
describe('attackListener', () => {
  test('does nothing, and does not throw, when the real click target does not resolve to a tile on this board', async () => {
    const { players: [one] } = await twoHumans()
    const strayElement = document.createElement('div')
    document.body.appendChild(strayElement)
    const fakeEvent = { target: strayElement }

    expect(() => attackListener(fakeEvent, one.board)).not.toThrow()
    expect(attackListener(fakeEvent, one.board)).toEqual([])
  })
})
