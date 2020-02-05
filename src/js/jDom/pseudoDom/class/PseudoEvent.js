/**
 * @file Substitute for the DOM Event Class.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
'use strict'
const { curry } = require('../../core/core.js')

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
 * @property {boolean} immediatePropagationStopped - Flag that no further propagation should occur, including on current
 * target.
 * @property {boolean} propagationStopped - Flag that no further propagation should occur.
 * @property {int} eventPhase - Indicates which phase of the event flow is being processed. Uses PseudoEvent constants.
 * @property {EventTarget|PseudoEventTarget} target - A reference to the target to which the event was originally
 * dispatched.
 * @property {int} timeStamp - The time at which the event was created (in milliseconds). By specification, this
 * value is time since epoch, but in reality browsers' definitions vary; in addition, work is underway to change this
 * to be a DomHighResTimeStamp instead.
 * @property {string} type - The name of the event (case-insensitive).
 * @property {boolean} isTrusted - Indicates whether or not the event was initiated by the browser (after a user
 * click for instance) or by a script (using an event creation method, like event.initEvent)
 */
class PseudoEvent {
  /**
   *
   * @param typeArg
   * @param bubbles
   * @param cancelable
   * @param composed
   * @returns {PseudoEvent}
   * @constructor
   */
  constructor (typeArg = '', { bubbles = true, cancelable = true, composed = true } = {}) {
    let properties = {
      bubbles,
      cancelable,
      composed,
      currentTarget: () => undefined,
      defaultPrevented: false,
      immediatePropagationStopped: false,
      propagationStopped: false,
      eventPhase: '',
      target: () => undefined,
      timeStamp: Math.floor(Date.now() / 1000),
      type: typeArg,
      isTrusted: true
    }
    this.setReadOnlyProperties = (updateProps = {}) => {
      properties = Object.assign({}, properties, updateProps)
      this.getReadOnlyProperties = (
        (properties) => (name = '') => properties[name]
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
  static getParentNodesFromAttribute (attr, value, node) {
    return Object.keys(node.parent).length
      ? (node.parent[attr] || false) === value
        ? PseudoEvent.getParentNodesFromAttribute(attr, value, node.parent).concat([node.parent])
        : PseudoEvent.getParentNodesFromAttribute(attr, value, node.parent)
      : []
  }

  /**
   * A helper selector function for retrieving all parent PseudoNode for the given child node.
   * @param {PseudoNode} node
   * @returns {Array.<PseudoNode>}
   */
  static getParentNodes () {
    return curry(PseudoEvent.getParentNodesFromAttribute)('', false)()
  }

  /**
   * Return an array of targets that will have the event executed open them. The order is based on the eventPhase
   * @method
   * @returns {Array.<PseudoEventTarget>}
   */
  composedPath () {
    switch (this.eventPhase) {
      case PseudoEvent.CAPTURING_PHASE:
        return PseudoEvent.getParentNodes(this.target)
      case PseudoEvent.BUBBLING_PHASE:
        return PseudoEvent.getParentNodes(this.target).slice().reverse()
      case PseudoEvent.AT_TARGET:
        return [this.target]
      default:
        return []
    }
  }

  /**
   * Cancels the event (if it is cancelable).
   * @method
   * @returns {null}
   */
  preventDefault () {
    this.setReadOnlyProperties({ defaultPrevented: true })
    return null
  }

  /**
   * For this particular event, no other listener will be called.
   * Neither those attached on the same element, nor those attached on elements which will be traversed later (in
   * capture phase, for instance)
   * @method
   * @returns {null}
   */
  stopImmediatePropagation () {
    this.setReadOnlyProperties({ immediatePropagationStopped: true })
    return null
  }

  /**
   * Stops the propagation of events further along in the Dom.
   * @method
   * @returns {null}
   */
  stopPropagation () {
    this.setReadOnlyProperties({ propagationStopped: true })
    return null
  }
}

// Set up the class constants
[
  'NONE',
  'CAPTURING_PHASE',
  'AT_TARGET',
  'BUBBLING_PHASE'
].reduce((phases, phase, key) => {
  Object.defineProperty(PseudoEvent, phase, {
    value: key,
    writable: false,
    static: { get: () => key }
  })
  return Object.assign({}, phases, { [`${phase}`]: key })
}, {})

module.exports = PseudoEvent
