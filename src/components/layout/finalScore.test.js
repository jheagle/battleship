/**
 * @jest-environment jsdom
 */
import treeloom from 'treeloom'
import finalScore from './finalScore'

describe('finalScore', () => {
  test('renders with parent of body', () => {
    treeloom.registerListener((e) => {}, 'restart')
    treeloom.registerListener((e) => {}, 'playAgain')
    treeloom.registerListener((e) => {}, 'returnToLobby')
    const renderedItem = treeloom.renderHtml(finalScore())
    expect(renderedItem.parentItem.nodeName).toBe('body')
  })
})
