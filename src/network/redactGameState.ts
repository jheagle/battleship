import matrixDom from 'matrix-dom'
import siFunciona from 'si-funciona'
import checkIfHitCell from '../utils/checkIfHitCell'
import type { Board, Player, Ship, Tile } from '../types'

/**
 * A redacted clone of a board: every tile is kept (same count, same tree position - nothing is removed, so it
 * stays renderable and clickable exactly like a local board), but hasShip is set to false on any tile that is
 * neither hit nor on the viewer's own board. Which cells to redact is read from the real board, matching the
 * rule the robot's own targeting already follows (see robot/densityTargets.ts's buildShotState), generalized
 * from "what the AI may read" to "what a remote viewer may be sent" - only the hidden tiles' hasShip is mutated
 * on the clone.
 * @param board
 * @param ownBoard whether the viewer this is being redacted for owns this board
 */
export const redactBoard = (board: Board, ownBoard: boolean): Board => {
  const clone = siFunciona.cloneObject(board) as Board
  matrixDom.getAllPoints(board).filter(point => point.z === 0).forEach(point => {
    if (ownBoard || checkIfHitCell(point, board)) {
      return
    }
    ;(matrixDom.getDomItemFromPoint(point, clone) as Tile).hasShip = false
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

/**
 * One player, redacted for a given viewer: a clone of the real player, with its board and fleet redacted per
 * redactBoard/redactShip. Everything else (name, colour, robot/human, overall status, whose turn it is,
 * playerStats - already public, see redactShip) passes through unchanged.
 * @param player
 * @param viewer
 */
export const redactPlayer = (player: Player, viewer: Player): Player => {
  const clone = siFunciona.cloneObject(player) as Player
  clone.board = redactBoard(player.board, player === viewer)
  clone.shipFleet = player.shipFleet.map(redactShip)
  clone.children = [clone.children[0], clone.board, clone.children[2]]
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
