/**
 * @file Substitute for the DOM EventTarget Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
'use strict'

const PseudoEvent = require('./PseudoEventTarget')

/**
 * Handle events as they are stored and implemented.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {string} eventType
 * @property {Object} eventOptions
 * @property {boolean} isDefault
 */
const PseudoEventListener = {
  eventType: '',
  eventOptions: {capture: false, once: false, passive: false},
  isDefault: false,
  /**
   * @method
   * @name PseudoEventListener#handleEvent
   * @param event
   * @returns {undefined}
   */
  handleEvent: event => undefined,
  /**
   * @method
   * @name PseudoEventListener#doCapturePhase
   * @param event
   * @returns {boolean}
   */
  doCapturePhase (event) {
    return event.eventPhase === PseudoEvent.CAPTURING_PHASE && this.eventOptions.capture
  },
  /**
   * @method
   * @name PseudoEventListener#doTargetPhase
   * @param event
   * @returns {boolean}
   */
  doTargetPhase (event) {
    return event.eventPhase === PseudoEvent.AT_TARGET
  },
  /**
   * @method
   * @name PseudoEventListener#doBubblePhase
   * @param event
   * @returns {boolean|*}
   */
  doBubblePhase (event) {
    return event.eventPhase === PseudoEvent.BUBBLING_PHASE && (event.bubbles || !this.eventOptions.capture)
  },
  /**
   * @method
   * @name PseudoEventListener#skipPhase
   * @param event
   * @returns {boolean}
   */
  skipPhase (event) {
    return !this.doCapturePhase(event) && !this.doTargetPhase(event) && !this.doBubblePhase(event)
  },
  /**
   * @method
   * @name PseudoEventListener#skipDefault
   * @param event
   * @returns {boolean|*}
   */
  skipDefault (event) {
    return this.isDefault && event.defaultPrevented
  },
  /**
   * @method
   * @name PseudoEventListener#stopPropagation
   * @param event
   * @returns {boolean}
   */
  stopPropagation (event) {
    return !this.doTargetPhase(event) && event.propagationStopped
  },
  /**
   * @method
   * @name PseudoEventListener#nonPassiveHalt
   * @param event
   * @returns {boolean|*}
   */
  nonPassiveHalt (event) {
    return !this.eventOptions.passive && (this.skipDefault(event)
      || event.immediatePropagationStopped
      || this.stopPropagation(event)
    )
  },
  /**
   * @method
   * @name PseudoEventListener#rejectEvent
   * @param event
   * @returns {*|boolean}
   */
  rejectEvent (event) {
    return this.nonPassiveHalt(event) || this.skipPhase(event)
  },
  /**
   * @method
   * @name PseudoEventListener#runEvent
   * @param event
   * @returns {Array.<PseudoEventListener>|Array}
   */
  runEvent (event) {
    if (this.rejectEvent(event)) {
      return [this]
    }
    this.handleEvent(event)
    if (this.eventOptions.once) {
      event.currentTarget.removeEventListener(this.eventType, this.handleEvent)
      return []
    }
    return [this]
  }
}

/**
 * Simulate the behaviour of the EventTarget Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {Object.<string, Array.<PseudoEventListener>>} listeners
 * @property {function} addEventListener
 * @property {function} removeEventListener
 * @property {function} dispatchEvent
 */
class PseudoEventTarget {
  /**
   * @constructor
   */
  constructor () {
    this.listeners = []
  }

  /**
   *
   * @param event
   * @returns {boolean}
   */
  runEvents (event) {
    if (!(event.type in this.listeners)) {
      return true
    }
    /**
     *
     * @type {Array<PseudoEventListener>}
     */
    const stack = this.listeners[event.type]
    this.listeners[event.type] = stack.reduce(
      /**
       *
       * @param {Array<PseudoEventListener>} listeners
       * @param {PseudoEventListener} listener
       * @returns {Array<PseudoEventListener>}
       */
      (listeners, listener) => event.immediatePropagationStopped
        ? listeners.concat([listener])
        : listeners.concat(listener.runEvent(event)),
      []
    )
  }

  /**
   *
   * @param eventType
   * @returns {boolean}
   */
  startEvents (eventType) {
    const event = new (require('./PseudoEvent'))(eventType)
    event.setReadOnlyProperties({target: this})
    // console.log('startEvents', event.type, event.target)
    ;[
      PseudoEvent.CAPTURING_PHASE,
      PseudoEvent.AT_TARGET,
      PseudoEvent.BUBBLING_PHASE
    ].forEach(phase => {
      if (phase === PseudoEvent.AT_TARGET || !event.propagationStopped) {
        event.setReadOnlyProperties({eventPhase: phase})
        event.composedPath().forEach((target) => {
          event.setReadOnlyProperties({currentTarget: target})
          event.currentTarget.runEvents(event)
        })
      }
    })
    return this.runEvents(event)
  }

  /**
   *
   * @param {string} type
   * @param {function|Object} callback
   * @param {boolean|Object} [useCapture=false]
   */
  addEventListener (type, callback, useCapture = false) {
    let options = {capture: false, once: false, passive: false}
    if (typeof useCapture === 'object') {
      options = Object.keys(useCapture).reduce((opts, opt) => {
        opts[opt] = useCapture[opt]
        return opts
      }, options)
    } else {
      options.capture = useCapture
    }
    if (!(type in this.listeners)) {
      this[type] = () => this.startEvents(type)
      this.listeners[type] = []
    }
    this.listeners[type] = this.listeners[type].concat([
      Object.assign(
        Object.create(PseudoEventListener),
        PseudoEventListener,
        {
          eventType: type,
          eventOptions: Object.assign({}, PseudoEventListener.eventOptions, options),
          handleEvent: (callback.handleEvent || callback).bind(this)
        }
      )
    ])
    const groupedDefault = this.listeners[type].reduce(
      (listeners, listener) => listener.isDefault
        ? Object.assign({}, listeners, {default: listeners.default.concat([listener])})
        : Object.assign({}, listeners, {explicit: listeners.explicit.concat([listener])}),
      {explicit: [], default: []}
    )
    this.listeners[type] = [].concat(groupedDefault.explicit, groupedDefault.default)
  }

  /**
   *
   * @param {string} type
   * @param {function} callback
   */
  removeEventListener (type, callback) {
    if (!(type in this.listeners)) {
      return
    }
    const stack = this.listeners[type]
    for (let i = 0, l = stack.length; i < l; i++) {
      if (stack[i].handleEvent === callback && !stack[i].isDefault) {
        stack.splice(i, 1)
        return
      }
    }
  }

  /**
   *
   * @param {Event|PseudoEvent} event
   * @param {EventTarget|PseudoEventTarget} target
   * @returns {boolean}
   */
  dispatchEvent (event, target = this) {
    event.setReadOnlyProperties({target})
    if (!(event.type in this.listeners)) {
      return true
    }
    this.runEvents(event)
    return !event.defaultPrevented
  }
}

module.exports = PseudoEventTarget
