/**
 * @jest-environment jsdom
 */
import jsonDom from 'json-dom'
import boards from './boards'

describe('boards', () => {
  test('renders with parent of body', () => {
    const renderedItem = jsonDom.renderHtml(boards())
    expect(renderedItem.parentItem.nodeName).toBe('body')
  })
})
