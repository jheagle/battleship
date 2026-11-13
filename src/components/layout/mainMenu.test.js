/**
 * @jest-environment jsdom
 */
import treeloom from 'treeloom'
import mainMenu from './mainMenu'

describe('mainMenu', () => {
  test('renders with parent of body', () => {
    treeloom.registerListener((e) => {}, 'beginRound')
    treeloom.registerListener((e) => {}, 'presetListener')
    treeloom.registerListener((e) => {}, 'remoteListener')
    const renderedItem = treeloom.renderHtml(mainMenu())
    expect(renderedItem.parentItem.nodeName).toBe('body')
  })
})
