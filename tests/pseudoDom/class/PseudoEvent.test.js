const PseudoEvent = require('../../../src/js/jDom/pseudoDom/class/PseudoEvent')

let testEvent = new PseudoEvent('click')

it('event has type', () => {
  expect(testEvent.type).toBe('click')
})

it('event has bubbles', () => {
  expect(testEvent.bubbles).toBe(true)
  let nonBubblesEvent = new PseudoEvent('click', {bubbles: false})
  expect(nonBubblesEvent.bubbles).toBe(false)
})

it('event has cancelable', () => {
  expect(testEvent.cancelable).toBe(true)
  let nonCancelableEvent = new PseudoEvent('click', {cancelable: false})
  expect(nonCancelableEvent.cancelable).toBe(false)
})

it('event has composed', () => {
  expect(testEvent.composed).toBe(true)
  let nonComposedEvent = new PseudoEvent('click', {composed: false})
  expect(nonComposedEvent.composed).toBe(false)
})

it('event has currentTarget', () => {
  expect(testEvent).toHaveProperty('currentTarget')
})

it('event has defaultPrevented, which can be updated with preventDefault()', () => {
  expect(testEvent.defaultPrevented).toBe(false)
  testEvent.preventDefault()
  expect(testEvent.defaultPrevented).toBe(true)
})

it('event has immediatePropagationStopped, which can be updated with stopImmediatePropagation()', () => {
  expect(testEvent.immediatePropagationStopped).toBe(false)
  testEvent.stopImmediatePropagation()
  expect(testEvent.immediatePropagationStopped).toBe(true)
})

it('event has propagationStopped, which can be updated with stopPropagation()', () => {
  expect(testEvent.propagationStopped).toBe(false)
  testEvent.stopPropagation()
  expect(testEvent.propagationStopped).toBe(true)
})

it('event has eventPhase', () => {
  expect(testEvent.eventPhase).toBe('')
})

it('event has target', () => {
  expect(testEvent).toHaveProperty('target')
})

it('event has timeStamp', () => {
  expect(testEvent.timeStamp).toBeCloseTo(Math.floor(Date.now() / 1000))
})

it('event has isTrusted as true', () => {
  expect(testEvent.isTrusted).toBe(true)
})

it('event constants are readable', () => {
  expect(PseudoEvent.NONE).toBe(0)
  expect(PseudoEvent.CAPTURING_PHASE).toBe(1)
  expect(PseudoEvent.AT_TARGET).toBe(2)
  expect(PseudoEvent.BUBBLING_PHASE).toBe(3)
})

it('event composedPath is empty when not running a phase', () => {
  expect(testEvent.composedPath()).toStrictEqual([])
})
