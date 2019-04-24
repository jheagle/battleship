/**
 * @file Substitute for the DOM Event Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
'use strict'

/**
 * A selector function for retrieving existing parent PseudoNode from the given child item.
 * This function will check all the parents starting from node, and scan the attributes
 * property for matches. The return array contains all matching parent ancestors.
 * WARNING: This is a recursive function.
 * @param {string} attr
 * @param {number|string} value
 * @param {PseudoNode} node
 * @returns {Array.<PseudoNode>}
 */
const getParentNodesFromAttribute = (attr, value, node) =>
  !Object.keys(node.parent).length ? [] : (
    (node[attr] || false) === value
      ? getParentNodesFromAttribute(attr, value, node.parent).concat([node])
      : getParentNodesFromAttribute(attr, value, node.parent)
  )

/**
 * A helper selector function for retrieving all parent PseudoNode for the given child node.
 * @param {PseudoNode} node
 * @returns {Array.<PseudoNode>}
 */
const getParentNodes = require('../../core/core.js').curry(getParentNodesFromAttribute)('', false)

/**
 * Simulate the behaviour of the Event Class when there is no DOM available.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @class
 * @property {number} NONE
 * @property {number} CAPTURING_PHASE
 * @property {number} AT_TARGET
 * @property {number} BUBBLING_PHASE
 * @property {boolean} bubbles - A Boolean indicating whether the event bubbles up through the Dom or not.
 * @property {boolean} cancelable - A Boolean indicating whether the event is cancelable.
 * @property {boolean} composed - A Boolean value indicating whether or not the event can bubble across the boundary
 * between the shadow Dom and the regular Dom.
 * @property {function|PseudoEventTarget} currentTarget - A reference to the currently registered target for the event. This
 * is the object to which the event is currently slated to be sent; it's possible this has been changed along the way
 * through re-targeting.
 * @property {boolean} defaultPrevented - Indicates whether or not event.preventDefault() has been called on the event.
 * @property {string} eventPhase - Indicates which phase of the event flow is being processed.
 * @property {EventTarget|PseudoEventTarget} target - A reference to the target to which the event was originally
 * dispatched.
 * @property {int} timeStamp - The time at which the event was created (in milliseconds). By specification, this
 * value is time since epoch, but in reality browsers' definitions vary; in addition, work is underway to change this
 * to be a DomHighResTimeStamp instead.
 * @property {string} type - The name of the event (case-insensitive).
 * @property {boolean} isTrusted - Indicates whether or not the event was initiated by the browser (after a user
 * click for instance) or by a script (using an event creation method, like event.initEvent)
 * @property {function} createEvent - Creates a new event, which must then be initialized by calling its initEvent()
 * method.
 * @property {function} initEvent - Initializes the value of an Event created. If the event has already being
 * dispatched, this method does nothing.
 * @property {function} preventDefault - Cancels the event (if it is cancelable).
 * @property {function} stopImmediatePropagation - For this particular event, no other listener will be called.
 * Neither those attached on the same element, nor those attached on elements which will be traversed later (in
 * capture phase, for instance)
 * @property {function} stopPropagation - Stops the propagation of events further along in the Dom.
 */
class PseudoEvent {
  /**
   *
   * @param typeArg
   * @param bubbles
   * @param cancelable
   * @param composed
   * @param capture
   * @returns {PseudoEvent}
   * @constructor
   */
  constructor (typeArg = '', {bubbles = true, cancelable = true, composed = true} = {}) {
    let properties = {
      bubbles,
      cancelable,
      composed,
      currentTarget: () => undefined,
      defaultPrevented: false,
      immediatePropagationStopped: false,
      propagationStopped: false,
      eventPhase: '',
      target: {},
      timeStamp: Math.floor(Date.now() / 1000),
      type: typeArg,
      isTrusted: true
    }
    this.setReadOnlyProperties = (updateProps = {}) => {
      properties = Object.assign({}, properties, updateProps)
      this.getReadOnlyProperties = (
        (properties) => (name = '') => this.hasOwnProperty(name) ? properties[name] : properties
      )(properties)
      return properties
    }
    this.setReadOnlyProperties()
    Object.keys(properties).map(propKey => Object.defineProperty(this, propKey, {
        enumerable: true,
        get: () => this.getReadOnlyProperties(propKey)
      })
    )
  }

  createEvent (type = '') {
    return new this(type)
  }

  /**
   *
   * @returns {*}
   */
  composedPath () {
    switch (this.eventPhase) {
      case PseudoEvent.CAPTURING_PHASE:
        return getParentNodes(this.target)
      case PseudoEvent.BUBBLING_PHASE:
        return getParentNodes(this.target).slice().reverse()
      case PseudoEvent.AT_TARGET:
        return [this.target]
      default:
        return []
    }
  }

  /**
   *
   * @param type
   * @param bubbles
   * @param cancelable
   * @returns {PseudoEvent}
   */
  initEvent (type, bubbles, cancelable) {
    this.setReadOnlyProperties({type, bubbles, cancelable, isTrusted: false})
    return this
  }

  /**
   *
   * @returns {null}
   */
  preventDefault () {
    this.setReadOnlyProperties({defaultPrevented: true})
    return null
  }

  /**
   *
   * @returns {null}
   */
  stopImmediatePropagation () {
    this.setReadOnlyProperties({immediatePropagationStopped: true})
    return null
  }

  /**
   *
   * @returns {null}
   */
  stopPropagation () {
    this.setReadOnlyProperties({propagationStopped: true})
    return null
  }
}

/**
 *
 */
const phaseConstants = [
  'NONE',
  'CAPTURING_PHASE',
  'AT_TARGET',
  'BUBBLING_PHASE'
].reduce((phases, phase, key) => {
  Object.defineProperty(PseudoEvent, phase, {
    value: key,
    writable: false,
    static: {get: () => key}
  })
  return Object.assign({}, phases, {[`${phase}`]: key})
}, {})

module.exports = PseudoEvent
