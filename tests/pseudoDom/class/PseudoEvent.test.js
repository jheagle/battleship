const PseudoEvent = require('../../../src/js/jDom/pseudoDom/class/PseudoEvent')

let testEvent = new PseudoEvent('click')

test('event has type', () => {
  expect(testEvent.type).toBe('click')
})

test('event has bubbles', () => {
  expect(testEvent.bubbles).toBe(true)
  let nonBubblesEvent = new PseudoEvent('click', {bubbles: false})
  expect(nonBubblesEvent.bubbles).toBe(false)
})

test('event has cancelable', () => {
  expect(testEvent.cancelable).toBe(true)
  let nonCancelableEvent = new PseudoEvent('click', {cancelable: false})
  expect(nonCancelableEvent.cancelable).toBe(false)
})

test('event has composed', () => {
  expect(testEvent.composed).toBe(true)
  let nonComposedEvent = new PseudoEvent('click', {composed: false})
  expect(nonComposedEvent.composed).toBe(false)
})

test('event has currentTarget', () => {
  expect(testEvent).toHaveProperty('currentTarget')
})

test('event has defaultPrevented, which can be updated with preventDefault()', () => {
  expect(testEvent.defaultPrevented).toBe(false)
  testEvent.preventDefault()
  expect(testEvent.defaultPrevented).toBe(true)
})

test('event has immediatePropagationStopped, which can be updated with stopImmediatePropagation()', () => {
  expect(testEvent.immediatePropagationStopped).toBe(false)
  testEvent.stopImmediatePropagation()
  expect(testEvent.immediatePropagationStopped).toBe(true)
})

test('event has propagationStopped, which can be updated with stopPropagation()', () => {
  expect(testEvent.propagationStopped).toBe(false)
  testEvent.stopPropagation()
  expect(testEvent.propagationStopped).toBe(true)
})

test('event has eventPhase', () => {
  expect(testEvent.eventPhase).toBe('')
})

test('event has target', () => {
  expect(testEvent).toHaveProperty('target')
})

test('event has timeStamp', () => {
  expect(testEvent.timeStamp).toBeCloseTo(Math.floor(Date.now() / 1000))
})

test('event has isTrusted as true', () => {
  expect(testEvent.isTrusted).toBe(true)
})

test('event constants are readable', () => {
  expect(PseudoEvent.NONE).toBe(0)
  expect(PseudoEvent.CAPTURING_PHASE).toBe(1)
  expect(PseudoEvent.AT_TARGET).toBe(2)
  expect(PseudoEvent.BUBBLING_PHASE).toBe(3)
})

test('event composedPath is empty when not running a phase', () => {
  expect(testEvent.composedPath()).toStrictEqual([])
})
