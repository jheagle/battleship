/**
 * @jest-environment jsdom
 */
import jsonDom from 'json-dom'
import remotePlayAgainListener from './remotePlayAgainListener'
import { leaveRemoteGame } from '../network/remoteGame'
import * as remoteListenerModule from './remoteListener'
import presetListener from './presetListener'
import beginRound from './beginRound'

jest.mock('../network/remoteGame')
jest.mock('./remoteListener')

describe('remotePlayAgainListener: the final-score screen\'s Play Again button', () => {
  // remotePlayAgainListener re-renders the main menu for real (startMenu) before showing the waiting room -
  // its own markup references presetListener/remoteListener/beginRound by name, so the root needs all three
  // registered for real, the same as any other root the real app builds (see main.ts).
  const setUp = () => {
    const root = jsonDom.documentDomItem({ presetListener, remoteListener: remoteListenerModule.default, beginRound })
    jsonDom.renderHtml(jsonDom.createDomItem({
      nodeName: 'div',
      attributes: { className: 'final-scores' },
      children: [{ nodeName: 'p', attributes: { className: 'remote-final-score-message', innerHTML: 'Game over!' } }]
    }), root.body)
    const target = jsonDom.getChildrenByClass('final-scores', root.body)[0]
    return { root, target }
  }

  afterEach(() => jest.resetAllMocks())

  test('does nothing if there is no remembered room state - should never happen in practice', () => {
    remoteListenerModule.getLastRoomState.mockReturnValue(null)
    const { target } = setUp()
    remotePlayAgainListener({}, target)
    expect(leaveRemoteGame).not.toHaveBeenCalled()
    expect(remoteListenerModule.enterWaitingRoom).not.toHaveBeenCalled()
  })

  test('leaves the finished game and shows the same room\'s own waiting room again, for whoever clicked it', () => {
    const state = { roomCode: 'ABCD', hostId: 'host-1', players: [{ id: 'host-1', name: 'Alice' }, { id: 'p2', name: 'Bob' }] }
    remoteListenerModule.getLastRoomState.mockReturnValue(state)
    const { root, target } = setUp()

    remotePlayAgainListener({}, target)

    expect(leaveRemoteGame).toHaveBeenCalledWith(root)
    expect(remoteListenerModule.enterWaitingRoom).toHaveBeenCalledTimes(1)
    const [menuArg, stateArg] = remoteListenerModule.enterWaitingRoom.mock.calls[0]
    // startMenu ran for real - the main menu genuinely exists by the time enterWaitingRoom is handed it, with
    // the same room state getLastRoomState provided (same room, same players, same host).
    expect(menuArg.attributes.className).toBe('main-menu')
    expect(stateArg).toBe(state)
    expect(document.querySelector('.main-menu')).not.toBeNull()
  })
})
