/**
 * @jest-environment jsdom
 */
import treeloom from 'treeloom'
import remoteLeaveListener from './remoteLeaveListener'
import { leaveRemoteGame } from '../network/remoteGame'
import { disconnectLobbySocket } from '../network/lobbySocket'
import presetListener from './presetListener'
import remoteListener from './remoteListener'
import beginRound from './beginRound'

jest.mock('../network/remoteGame')
jest.mock('../network/lobbySocket')

describe('remoteLeaveListener: the final-score screen\'s Leave button', () => {
  // remoteLeaveListener re-renders the main menu for real (startMenu) - its own markup references
  // presetListener/remoteListener/beginRound by name (the game-type tiles and lobby form it lands back on),
  // so the root needs all three registered for real, same as any other root the real app builds (main.ts).
  const setUp = () => {
    const root = treeloom.documentDomItem({ presetListener, remoteListener, beginRound })
    treeloom.renderHtml(treeloom.createDomItem({
      nodeName: 'div',
      attributes: { className: 'final-scores' },
      children: [{ nodeName: 'p', attributes: { className: 'remote-final-score-message', innerHTML: 'Game over!' } }]
    }), root.body)
    const target = treeloom.getChildrenByClass('final-scores', root.body)[0]
    return { root, target }
  }

  afterEach(() => {
    jest.resetAllMocks()
    window.history.pushState(null, '', '/')
  })

  test('leaves the finished game, disconnects, clears the shared join link, and lands on a fresh menu showing the game types', () => {
    window.history.pushState(null, '', '/?room=ABCD')
    const { root, target } = setUp()

    remoteLeaveListener({}, target)

    expect(leaveRemoteGame).toHaveBeenCalledWith(root)
    expect(disconnectLobbySocket).toHaveBeenCalledTimes(1)
    expect(window.location.search).toBe('')
    expect(document.querySelector('.main-menu')).not.toBeNull()
    expect(document.querySelector('.presets').style.display).not.toBe('none')
    expect(document.querySelector('.final-scores')).toBeNull()
  })
})
