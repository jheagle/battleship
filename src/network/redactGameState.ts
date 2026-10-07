import matrixDom from 'matrix-dom'
import checkIfHitCell from '../utils/checkIfHitCell'
import checkIfShipCell from '../utils/checkIfShipCell'
import type { Board, Player } from '../types'

/**
 * One cell of a board, with only what a given viewer is allowed to know about it: whether it has been attacked
 * (always true knowledge, for any viewer), and whether it holds a ship - but the ship only if that cell has been
 * hit, or the viewer owns this board. An unhit cell on someone else's board always reports hasShip: false here,
 * regardless of what is really there - the same rule the robot's own targeting already follows (see
 * robot/densityTargets.ts's buildShotState), generalized from "what the AI may read" to "what a remote viewer may
 * be sent".
 */
export interface RedactedCell {
  x: number
  y: number
  isHit: boolean
  hasShip: boolean
}

/**
 * A ship, reduced to what is always public: its name, length and status. The stats panel already shows this to
 * everyone, hit or not - a ship's existence and condition are public; its position is the secret.
 */
export interface RedactedShip {
  name: string
  length: number
  status: number
}

/** A player, redacted for one viewer: see redactPlayer. */
export interface RedactedPlayer {
  name: string
  colour: string
  isRobot: boolean
  status: number
  attacker: boolean
  shipFleet: RedactedShip[]
  board: RedactedCell[]
}

/**
 * A board's cells, redacted for one viewer: unattacked ship positions are visible only when `ownBoard` is true.
 * @param board
 * @param ownBoard whether the viewer this is being redacted for owns this board
 */
export const redactBoard = (board: Board, ownBoard: boolean): RedactedCell[] =>
  matrixDom.getAllPoints(board).filter(point => point.z === 0).map(point => {
    const isHit = checkIfHitCell(point, board)
    return {
      x: point.x,
      y: point.y,
      isHit,
      hasShip: (ownBoard || isHit) && checkIfShipCell(point, board)
    }
  })

/**
 * One player, redacted for a given viewer. Everything public stays as it is: name, colour, robot/human, overall
 * status, and whose turn it is. The fleet list keeps each ship's name, length and status, never its parts'
 * positions. The board is redacted per redactBoard: `viewer` only sees this player's own unattacked ship positions
 * when `viewer` is this same player.
 * @param player
 * @param viewer
 */
export const redactPlayer = (player: Player, viewer: Player): RedactedPlayer => ({
  name: player.name,
  colour: player.colour,
  isRobot: player.isRobot,
  status: player.status,
  attacker: player.attacker,
  shipFleet: player.shipFleet.map(ship => ({ name: ship.name, length: ship.parts.length, status: ship.status })),
  board: redactBoard(player.board, player === viewer)
})

/**
 * The whole game, redacted for one viewer: every player, each with their own board redacted according to whether
 * `viewer` owns it. This is what is safe to send to a remote client for `viewer`'s own connection - it contains
 * nothing about any board's hidden ship positions except the viewer's own.
 * @param players
 * @param viewer
 */
export const redactGameState = (players: Player[], viewer: Player): RedactedPlayer[] => players.map(player => redactPlayer(player, viewer))
