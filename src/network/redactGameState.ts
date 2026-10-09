import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'
import checkIfHitCell from '../utils/checkIfHitCell'
import { roleFor } from '../attack/playerView'
import { remotePlacementStage } from '../setup/remotePlacement'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Board, Player, Ship, Tile } from '../types'

/**
 * A redacted clone of a board: every tile is kept (same count, same tree position - nothing is removed, so it
 * stays renderable and clickable exactly like a local board), but hasShip is set to false on any tile that is
 * neither hit nor on the viewer's own board. Which cells to redact is read from the real board, matching the
 * rule the robot's own targeting already follows (see robot/densityTargets.ts's buildShotState), generalized
 * from "what the AI may read" to "what a remote viewer may be sent" - only the hidden tiles' hasShip is mutated
 * on the clone.
 *
 * setViewShip (src/cells/setViewShip.ts) also bakes a grey `backgroundColor` directly onto a ship tile's own
 * `attributes.style` the moment it is placed - meant for local play, where seeing your own ship as you place it
 * is the point. That baked style survives this clone untouched unless cleared here too, which would leak every
 * unhit ship's exact position through the rendered colour even with hasShip correctly hidden - clearing it only
 * for the same cells hasShip is cleared for keeps a legitimate hit's own red/white colouring (set afterwards by
 * colourHitCell, both colours equally public) untouched.
 * @param board
 * @param ownBoard whether the viewer this is being redacted for owns this board
 */
export const redactBoard = (board: Board, ownBoard: boolean): Board => {
  const clone = siFunciona.cloneObject(board) as Board
  matrixDom.getAllPoints(board).filter(point => point.z === 0).forEach(point => {
    if (ownBoard || checkIfHitCell(point, board)) {
      return
    }
    const tile = matrixDom.getDomItemFromPoint(point, clone) as Tile
    tile.hasShip = false
    const style = (tile.attributes as { style?: { backgroundColor?: string } } | undefined)?.style
    if (style) {
      delete style.backgroundColor
    }
  })
  return clone
}

/**
 * A ship, reduced to what is always public: its name, length and status - never its parts' positions. parts is
 * kept as an array of the right length (playerStats reads parts.length), but its entries are placeholders - a
 * ship's parts are the same Tile objects the board holds, so leaving them as-is on a redacted clone would leak
 * exact ship position through this second path even with the board's own tiles correctly redacted.
 * @param ship
 */
const redactShip = (ship: Ship): Ship => ({
  name: ship.name,
  status: ship.status,
  parts: ship.parts.map(() => ({} as Tile))
})

/** The class name of an item, if it has one - the same lightweight check used throughout this file. */
const classNameOf = (item: DomItem): string | undefined => (item.attributes as { className?: string } | undefined)?.className

/**
 * A clone of a panel with every one of its own controls (anything but its message, which is never secret - ship
 * sizes are public fleet knowledge, only position is hidden) disabled - used for a remote placement/ordering
 * panel that is not this viewer's own to interact with. Builds a new object rather than mutating the given one,
 * since it is already part of an outer clone (redactPlayer/redactGameBody) that must stay independent of the
 * real tree.
 * @param panel
 */
const disableControls = (panel: DomItem): DomItem => ({
  ...panel,
  children: panel.children.map(child => classNameOf(child)?.endsWith('-message')
    ? child
    : { ...child, attributes: { ...child.attributes, disabled: true } } as DomItem)
}) as DomItem

/**
 * A clone of a player's own stats panel with its player-controls entirely removed - used for anyone else's
 * own panel, as rendered for a viewer who is not that player. The only control remote play ever puts there is
 * the hint checkbox (the own-ships checkbox is solo-mode only, never present in a multiplayer game - see
 * playerStats.ts), which toggles THAT player's own showHint preference: hintListener.ts resolves whichever
 * player owns the clicked element, regardless of who actually clicked it, so left as-is a viewer could flip
 * another player's own hint setting from their own screen, and would see a checkbox that is really none of
 * their business in the first place. Name and ship list are never secret, so nothing else here needs touching.
 * @param stats
 */
const hidePlayerControls = (stats: DomItem): DomItem => ({
  ...stats,
  children: stats.children.filter(child => classNameOf(child) !== 'player-controls')
}) as DomItem

/**
 * One player, redacted for a given viewer: a clone of the real player, with its board and fleet redacted per
 * redactBoard/redactShip, its own placement panel disabled, and its own hint checkbox removed entirely, all
 * unless this is that player's own viewer. Everything else (name, colour, robot/human, overall status, whose
 * turn it is) passes through unchanged. children is kept in step with whichever of its own entries changed, by
 * index, rather than assumed to always be exactly [turn-badge, board, stats] - a remote game's own fourth
 * child (its placement panel) would otherwise silently be dropped.
 * @param player
 * @param viewer
 */
export const redactPlayer = (player: Player, viewer: Player): Player => {
  const clone = siFunciona.cloneObject(player) as Player
  const boardIndex = clone.children.indexOf(clone.board)
  clone.board = redactBoard(player.board, player === viewer)
  if (boardIndex !== -1) {
    clone.children[boardIndex] = clone.board
  }
  clone.shipFleet = player.shipFleet.map(redactShip)
  if (player !== viewer) {
    const panelIndex = clone.children.findIndex(child => classNameOf(child) === 'remote-placement-panel')
    if (panelIndex !== -1) {
      clone.children[panelIndex] = disableControls(clone.children[panelIndex])
    }
    const statsIndex = clone.children.indexOf(clone.playerStats)
    if (statsIndex !== -1) {
      clone.playerStats = hidePlayerControls(clone.playerStats)
      clone.children[statsIndex] = clone.playerStats
    }
  }
  return clone
}

/**
 * The whole game, redacted for one viewer: every player, each with their own board redacted according to whether
 * `viewer` owns it. This is what is safe to send to a remote client for `viewer`'s own connection - it contains
 * nothing about any board's hidden ship positions except the viewer's own, and - unlike a flat data snapshot -
 * it is still a real, renderable, clickable DomItem tree: a remote client can inflate and render it with the
 * exact same components local play already uses, and forward its clicks the same way.
 * @param players
 * @param viewer
 */
export const redactGameState = (players: Player[], viewer: Player): Player[] => players.map(player => redactPlayer(player, viewer))

/**
 * Marks each already-redacted player with which role they play in `viewer`'s own current view (see
 * playerView.ts's roleFor) - only ever adds a class, never touches the board/fleet data itself, which is
 * already correctly redacted either way. The new client-side CSS this enables is what actually turns a
 * `summary` role plainer (no highlighting, no animation) - nothing here removes any content.
 *
 * Takes the real (pre-redaction) players alongside their already-redacted clones, in the same order, rather
 * than deciding each role from the redacted list alone: redactPlayer's own siFunciona.cloneObject means a
 * redacted entry is never === viewer any more, even for viewer's own - roleFor's identity check needs the
 * real reference to ever resolve 'own' correctly.
 * @param players the real players, same order as redactedPlayers
 * @param redactedPlayers
 * @param viewer
 */
const applyPlayerView = (players: Player[], redactedPlayers: Player[], viewer: Player): Player[] => redactedPlayers.map((redacted, i) => ({
  ...redacted,
  attributes: { ...redacted.attributes, className: `player role-${roleFor(players[i], viewer)}` }
})) as Player[]

/**
 * A whole screen's worth of game state, redacted for one viewer - the boards wrapper's own children replaced with
 * redactGameState's result, and (for a remote game) the global ordering panel's own Random/Set order controls
 * disabled for anyone but the host - players[0] is always the room's host for as long as any game of theirs is
 * running (the host is always the first to join a room, and the whole room closes if they ever leave, so this
 * holds without needing to thread a separate host id through here). The final-score screen's own Play Again
 * button is left exactly as sent - any player may click it, since all it ever does for its own clicker is show
 * the room's own waiting room again, nothing that needs a host check. Everything else (the robots-only
 * show-all-ships control, if present) is kept as is, since none of it carries anything secret. This is what a
 * remote client actually renders and interacts with: the exact same markup local play already uses, inflated
 * from this instead of built fresh.
 *
 * While placement is actively running (remotePlacementStage(body) === 'placing'), only `viewer`'s own player
 * is included at all - nobody else's board, fleet or placement panel needs to reach a still-placing viewer,
 * so they simply never do (see remotePlacement.ts's remotePlacementStage). Every other stage (choosing/
 * ordering/shuffling/chosen) still includes everyone, same as today - the host needs to see and click every
 * player's board to set the order. Once placement is over entirely (stage is null), applyPlayerView marks
 * each included player's role for this viewer, so the client's own CSS can style a `summary` player plainer.
 * @param body
 * @param players
 * @param viewer
 */
export const redactGameBody = (body: DomItem, players: Player[], viewer: Player): DomItem => {
  const clone = siFunciona.cloneObject(body) as DomItem
  const boardsIndex = clone.children.findIndex(child => classNameOf(child) === 'boards')
  if (boardsIndex !== -1) {
    const stage = remotePlacementStage(body)
    const visiblePlayers = stage === 'placing' ? [viewer] : players
    const redacted = redactGameState(visiblePlayers, viewer)
    clone.children[boardsIndex] = { ...clone.children[boardsIndex], children: stage === null ? applyPlayerView(visiblePlayers, redacted, viewer) : redacted } as unknown as DomItem
  }
  const orderingIndex = clone.children.findIndex(child => classNameOf(child) === 'remote-ordering')
  if (orderingIndex !== -1 && viewer !== players[0]) {
    clone.children[orderingIndex] = disableControls(clone.children[orderingIndex])
  }
  return clone
}
