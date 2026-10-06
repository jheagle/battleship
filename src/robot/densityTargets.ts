import matrixDom from 'matrix-dom'
import checkIfHitCell from '../utils/checkIfHitCell'
import { bestTargets, scoreTargets } from './densityScores'
import type { Cell, ShotState } from './densityScores'
import filterAdjacentPoints from '../utils/filterAdjacentPoints'
import type { Player } from '../types'
import type { HeatCell } from './resetTargets'
import type { Point } from 'matrix-dom/dist/point/types'

const toCell = (point: { x: number, y: number }): Cell => ({ x: point.x, y: point.y })

/**
 * Build what the robot is allowed to know about a victim: which cells were attacked, which of those were hits (the
 * hit parts of each ship, not the position of any part still unhit), and how many parts each unsunk ship has.
 * Hit or miss is read from the ship parts' isHit flags, never from a tile's hasShip.
 * @param victim
 */
export const buildShotState = (victim: Player): ShotState => {
  const points = matrixDom.getAllPoints(victim.board).filter(p => p.z === 0)
  const size = Math.max(...points.map(p => p.x)) + 1
  const hitParts = victim.shipFleet.flatMap(ship => ship.parts.filter(part => part.isHit))
  const hits = hitParts.map(part => toCell(part.point))
  const hitKeys = new Set(hits.map(c => `${c.x},${c.y}`))
  const attacked = points.filter(p => checkIfHitCell(p, victim.board)).map(toCell)
  return {
    size,
    misses: attacked.filter(c => !hitKeys.has(`${c.x},${c.y}`)),
    hits,
    remaining: victim.shipFleet
      .filter(ship => ship.status > 0)
      .map(ship => ({ length: ship.parts.length, hits: ship.parts.filter(part => part.isHit).map(part => toCell(part.point)) }))
  }
}

/**
 * Among cells tied at the top score, prefer the checkerboard pattern used to find ships quickly. The partial-hit
 * follow-up is not handled here: it is extra weight inside scoreTargets, so it is already part of the score.
 * @param cells
 */
const refineTies = (cells: Cell[]): Cell[] => {
  const checkerboard = cells.filter(c => filterAdjacentPoints(matrixDom.point(c.x, c.y, 0)))
  return checkerboard.length ? checkerboard : cells
}

/**
 * The density model's picture of the board: every unattacked cell with a score, shaded by how far it is from the top
 * score (`heat`, for display), and the cells the robot chooses from (`targets`: the highest, narrowed to the
 * checkerboard among them). `targets` is never empty while a ship remains.
 * @param victim
 */
export const densityChoices = (victim: Player): { heat: HeatCell[], targets: Point[] } => {
  const scores = scoreTargets(buildShotState(victim))
  const best = bestTargets(scores)
  const max = Math.max(0, ...scores.flat())
  const heat = scores.flatMap((row, y) => row.flatMap((score, x) => score > 0 ? [{ point: matrixDom.point(x, y, 0), intensity: score / max }] : []))
  return {
    heat,
    targets: (best.length ? refineTies(best) : best).map(c => matrixDom.point(c.x, c.y, 0))
  }
}

/**
 * The attack points the density model considers most likely to hold a ship part, or an empty array when there is none.
 * @param victim
 */
const densityTargets = (victim: Player): Point[] => densityChoices(victim).targets

export default densityTargets
