/**
 * @jest-environment jsdom
 */
import jsonDom from 'json-dom'
import mainMenu from './mainMenu'

describe('mainMenu', () => {
  test('renders with parent of body', () => {
    jsonDom.registerListener((e) => {}, 'beginRound')
    jsonDom.registerListener((e) => {}, 'presetListener')
    jsonDom.registerListener((e) => {}, 'remoteListener')
    const renderedItem = jsonDom.renderHtml(mainMenu())
    expect(renderedItem.parentItem.nodeName).toBe('body')
  })
})
