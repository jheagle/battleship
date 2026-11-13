/**
 * @jest-environment jsdom
 */
import treeloom from 'treeloom'
import boards from './boards'

describe('boards', () => {
  test('renders with parent of body', () => {
    const renderedItem = treeloom.renderHtml(boards())
    expect(renderedItem.parentItem.nodeName).toBe('body')
  })
})
