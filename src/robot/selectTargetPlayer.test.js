/**
 * @jest-environment jsdom
 */
import selectTargetPlayer from './selectTargetPlayer'

describe('selectTargetPlayer', () => {
  test('prefers easy target of broken ship instead of total status', () => {
    const players = [
      { name: 'healthy', status: 100, shipFleet: [{ status: 100 }, { status: 100 }] },
      { name: 'damaged', status: 80, shipFleet: [{ status: 100 }, { status: 60 }] },
      { name: 'sunk only', status: 50, shipFleet: [{ status: 0 }, { status: 100 }] }
    ]
    const result = selectTargetPlayer(players)
    expect(result.name).toBe('damaged')
  })
  test('no damaged ship, use lowest status', () => {
    const players = [
      { name: 'healthy', status: 100, shipFleet: [{ status: 100 }, { status: 100 }] },
      { name: 'damaged', status: 66, shipFleet: [{ status: 100 }, { status: 0 }, { status: 100 }] },
      { name: 'sunk several', status: 33, shipFleet: [{ status: 0 }, { status: 100 }, { status: 0 }] }
    ]
    const result = selectTargetPlayer(players)
    expect(result.name).toBe('sunk several')
  })
  test('select any if all are the same', () => {
    const players = [
      { name: 'healthy', status: 100, shipFleet: [{ status: 100 }, { status: 100 }] },
      { name: 'possible', status: 100, shipFleet: [{ status: 100 }, { status: 100 }, { status: 100 }] },
      { name: 'other', status: 100, shipFleet: [{ status: 100 }, { status: 100 }, { status:100 }] }
    ]
    const result = selectTargetPlayer(players)
    expect(['healthy', 'possible', 'other']).toContain(result.name)
  })
})
