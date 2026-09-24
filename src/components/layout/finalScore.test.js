/**
 * @jest-environment jsdom
 */
import jsonDom from 'json-dom'
import finalScore from './finalScore'

describe('finalScore', () => {
  test('renders with parent of body', () => {
    jsonDom.registerListener((e) => {}, 'restart')
    const renderedItem = jsonDom.renderHtml(finalScore())
    expect(renderedItem.parentItem.nodeName).toBe('body')
  })
})
