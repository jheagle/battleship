import { scoreTargets, bestTargets, DAMAGED_WEIGHT } from './densityScores'

const emptyState = (overrides = {}) => ({ size: 10, misses: [], hits: [], remaining: [], ...overrides })
const at = (scores, x, y) => scores[y][x]

describe('scoreTargets', () => {
  test('a fresh board scores the centre above a corner, since more placements pass through it', () => {
    const scores = scoreTargets(emptyState({ remaining: [{ length: 3, hits: [] }] }))
    expect(at(scores, 4, 4)).toBeGreaterThan(at(scores, 0, 0))
  })

  test('a miss removes every placement through that cell', () => {
    const scores = scoreTargets(emptyState({ misses: [{ x: 5, y: 5 }], remaining: [{ length: 2, hits: [] }] }))
    expect(at(scores, 5, 5)).toBe(0)
    expect(at(scores, 4, 5)).toBeLessThan(at(scores, 4, 2))
  })

  test('an attacked cell never scores, whether it was a hit or a miss', () => {
    const scores = scoreTargets(emptyState({ misses: [{ x: 1, y: 1 }], hits: [{ x: 2, y: 2 }], remaining: [{ length: 2, hits: [{ x: 2, y: 2 }] }] }))
    expect(at(scores, 1, 1)).toBe(0)
    expect(at(scores, 2, 2)).toBe(0)
  })

  test('a damaged ship concentrates on cells that extend its known hit, weighted above fresh ships', () => {
    const scores = scoreTargets(emptyState({
      hits: [{ x: 4, y: 4 }],
      remaining: [{ length: 3, hits: [{ x: 4, y: 4 }] }, { length: 2, hits: [] }]
    }))
    expect(at(scores, 4, 5)).toBeGreaterThan(at(scores, 9, 9))
    expect(at(scores, 4, 5)).toBeGreaterThanOrEqual(DAMAGED_WEIGHT)
  })

  test('hits of sunk ships are not attributed to any remaining ship, so they block placements through them', () => {
    const scores = scoreTargets(emptyState({ hits: [{ x: 0, y: 0 }], remaining: [{ length: 2, hits: [] }] }))
    expect(at(scores, 0, 0)).toBe(0)
    expect(at(scores, 1, 0)).toBeLessThan(at(scores, 5, 0))
  })

  test('with no remaining ships every score is zero', () => {
    const scores = scoreTargets(emptyState())
    expect(bestTargets(scores)).toEqual([])
  })
})

describe('bestTargets', () => {
  test('returns every cell tied at the highest score', () => {
    expect(bestTargets([[0, 2, 1], [2, 0, 0]])).toEqual([{ x: 1, y: 0 }, { x: 0, y: 1 }])
  })
})
