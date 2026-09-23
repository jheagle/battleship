/**
 * @jest-environment jsdom
 */
import jsonDom from 'json-dom'
import jDomLayout from './layout.js'
import { logObject } from 'test-filesystem'

describe('layout', () => {
  // mainMenu
  test('mainMenu renders with parent of body', () => {
    jsonDom.registerListener((e) => {}, 'beginRound')
    const renderedItem = jsonDom.renderHtml(jDomLayout.mainMenu())
    expect(renderedItem.parentItem.nodeName).toBe('body')
  })
  // boards
  test('boards renders with parent of body', () => {
    const renderedItem = jsonDom.renderHtml(jDomLayout.boards())
    expect(renderedItem.parentItem.nodeName).toBe('body')
  })
  // finalScore
  test('finalScore renders with parent of body', () => {
    jsonDom.registerListener((e) => {}, 'restart')
    const renderedItem = jsonDom.renderHtml(jDomLayout.finalScore())
    expect(renderedItem.parentItem.nodeName).toBe('body')
  })
})
