/**
 * @jest-environment jsdom
 */
import jsonDom from 'json-dom'
import remotePlayAgainListener from './remotePlayAgainListener'
import * as lobbySocket from '../network/lobbySocket'
import * as remoteListenerModule from './remoteListener'

jest.mock('../network/lobbySocket')
jest.mock('./remoteListener')

describe('remotePlayAgainListener: the final-score screen\'s Play Again button', () => {
  const setUp = () => {
    const root = jsonDom.documentDomItem({})
    jsonDom.renderHtml(jsonDom.createDomItem({
      nodeName: 'div',
      attributes: { className: 'final-scores' },
      children: [{ nodeName: 'p', attributes: { className: 'remote-final-score-message', innerHTML: 'Game over!' } }]
    }), root.body)
    const target = jsonDom.getChildrenByClass('final-scores', root.body)[0]
    return { root, target }
  }

  afterEach(() => jest.resetAllMocks())

  test('does nothing if there are no remembered settings - should never happen in practice', async () => {
    remoteListenerModule.getLastGameSettings.mockReturnValue(null)
    const { target } = setUp()
    await remotePlayAgainListener({}, target)
    expect(lobbySocket.startGame).not.toHaveBeenCalled()
  })

  test('starts a new game with whatever settings the last real game actually used', async () => {
    remoteListenerModule.getLastGameSettings.mockReturnValue({ hints: 'on', firstGoesFirst: false })
    lobbySocket.startGame.mockResolvedValue({ started: true })
    const { target } = setUp()
    await remotePlayAgainListener({}, target)
    expect(lobbySocket.startGame).toHaveBeenCalledWith('on', false)
  })

  test('shows the server\'s own error in the final-score message if it refuses - e.g. someone left', async () => {
    remoteListenerModule.getLastGameSettings.mockReturnValue({ hints: 'optional', firstGoesFirst: true })
    lobbySocket.startGame.mockResolvedValue({ error: 'Need at least 2 players to start' })
    const { root, target } = setUp()
    await remotePlayAgainListener({}, target)
    expect(jsonDom.getChildrenByClass('remote-final-score-message', root.body)[0].attributes.innerHTML).toBe('Need at least 2 players to start')
  })
})
