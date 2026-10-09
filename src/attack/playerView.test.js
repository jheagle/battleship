import { roleFor } from './playerView'

const player = (overrides = {}) => ({ status: 100, attacker: false, ...overrides })

describe('roleFor', () => {
  test('a viewer is always their own role, regardless of status or turn', () => {
    const viewer = player({ attacker: true })
    expect(roleFor(viewer, viewer)).toBe('own')

    const eliminatedSelf = player({ status: 0 })
    expect(roleFor(eliminatedSelf, eliminatedSelf)).toBe('own')
  })

  test('a live opponent is a target only on the viewer\'s own turn', () => {
    const viewer = player({ attacker: true })
    const opponent = player()
    expect(roleFor(opponent, viewer)).toBe('target')
  })

  test('a live opponent is a summary when it is not the viewer\'s turn', () => {
    const viewer = player({ attacker: false })
    const opponent = player()
    expect(roleFor(opponent, viewer)).toBe('summary')
  })

  test('an eliminated opponent is always a summary, even on the viewer\'s own turn', () => {
    const viewer = player({ attacker: true })
    const eliminated = player({ status: 0 })
    expect(roleFor(eliminated, viewer)).toBe('summary')
  })
})
