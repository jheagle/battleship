export interface Cell {
  x: number
  y: number
}

export interface RemainingShip {
  length: number
  /** The cells of this ship already known to be hit. Empty for a ship nothing has touched yet. */
  hits: Cell[]
}

export interface ShotState {
  size: number
  /** Cells that were attacked and missed. */
  misses: Cell[]
  /** Every cell known to be a ship part that was hit, including those of sunk ships. */
  hits: Cell[]
  /** The ships which are not yet sunk. */
  remaining: RemainingShip[]
}

/** Extra weight for placements which explain a ship that is already damaged, relative to a fresh ship. */
export const DAMAGED_WEIGHT = 100

/** Extra weight for an unattacked cell next to a hit on a ship which is not yet sunk, the partial-hit follow-up. */
export const ADJACENT_WEIGHT = 100

const edgeNeighbours = (cell: Cell): Cell[] => [{ x: cell.x + 1, y: cell.y }, { x: cell.x - 1, y: cell.y }, { x: cell.x, y: cell.y + 1 }, { x: cell.x, y: cell.y - 1 }]

const keyOf = (cell: Cell): string => `${cell.x},${cell.y}`

const placementsOf = (size: number, length: number): Cell[][] => {
  const placements: Cell[][] = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (x + length <= size) {
        placements.push(Array.from({ length }, (_, i) => ({ x: x + i, y })))
      }
      if (y + length <= size) {
        placements.push(Array.from({ length }, (_, i) => ({ x, y: y + i })))
      }
    }
  }
  return placements
}

/**
 * Score every cell by how many ways the remaining ships could still cover it. Each ship contributes every placement
 * consistent with what is known: it avoids misses, covers all of its own known hits, and touches no other ship's hit.
 * Cells already attacked score zero. Unattacked cells next to a hit on an unsunk ship then get the adjacent weight on top.
 * @param state
 * @param damagedWeight
 * @param adjacentWeight
 */
export const scoreTargets = (state: ShotState, damagedWeight: number = DAMAGED_WEIGHT, adjacentWeight: number = ADJACENT_WEIGHT): number[][] => {
  const scores = Array.from({ length: state.size }, () => Array(state.size).fill(0))
  const missKeys = new Set(state.misses.map(keyOf))
  const hitKeys = new Set(state.hits.map(keyOf))
  for (const ship of state.remaining) {
    const shipHitKeys = new Set(ship.hits.map(keyOf))
    const weight = ship.hits.length ? damagedWeight : 1
    for (const placement of placementsOf(state.size, ship.length)) {
      const keys = placement.map(keyOf)
      if (keys.some(key => missKeys.has(key))) continue
      if (keys.some(key => hitKeys.has(key) && !shipHitKeys.has(key))) continue
      if ([...shipHitKeys].some(key => !keys.includes(key))) continue
      for (const cell of placement) {
        if (!hitKeys.has(keyOf(cell)) && !missKeys.has(keyOf(cell))) {
          scores[cell.y][cell.x] += weight
        }
      }
    }
  }
  for (const ship of state.remaining) {
    for (const hit of ship.hits) {
      for (const cell of edgeNeighbours(hit)) {
        const inside = cell.x >= 0 && cell.y >= 0 && cell.x < state.size && cell.y < state.size
        if (inside && !hitKeys.has(keyOf(cell)) && !missKeys.has(keyOf(cell))) {
          scores[cell.y][cell.x] += adjacentWeight
        }
      }
    }
  }
  return scores
}

/**
 * The unattacked cells which have the highest score. Empty when no score is above zero.
 * @param scores
 */
export const bestTargets = (scores: number[][]): Cell[] => {
  const best = Math.max(0, ...scores.flat())
  if (best === 0) return []
  const cells: Cell[] = []
  scores.forEach((row, y) => row.forEach((score, x) => {
    if (score === best) cells.push({ x, y })
  }))
  return cells
}
