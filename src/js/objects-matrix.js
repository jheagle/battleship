'use strict'
// Core Matrix Objects
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this || {}

  /**
   * Store reference to any pre-existing module of the same name
   * @type {jDomObjectsMatrix|*}
   */
  const previousJDomObjectsMatrix = root.jDomObjectsMatrix || {}

  /**
   * A reference to all functions to be used globally / exported
   * @module jDomObjectsMatrix
   */
  const jDomObjectsMatrix = {}
  root.jDomObjectsMatrix = jDomObjectsMatrix

  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {jDomObjectsMatrix}
   */
  jDomObjectsMatrix.noConflict = () => {
    root.jDomObjectsMatrix = previousJDomObjectsMatrix
    return jDomObjectsMatrix
  }

  /**
   * Verify availability of jDomCore
   * @type {*|jDomCore}
   */
  let jDomCore = root.jDomCore

  /**
   * If jDomCore remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomCore === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomCore = require('./core.js')
    } else {
      console.error('objects-dom.js requires jDomCore')
    }
  }

  /**
   * Verify availability of jDomObjects
   * @type {*|jDomObjects}
   */
  let jDomObjects = root.jDomObjects

  /**
   * If jDomObjects remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomObjects === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomObjects = require('./objects-dom.js')
    } else {
      console.error('core-dom.js requires jDomObjects')
    }
  }

  /**
   * A string representing an axis: x, y, z
   * @typedef {string} axis
   */

  /**
   * A number representing a coordinate in a {@link Matrix}
   * @typedef {number} coordinate
   */

  /**
   * Point stores a location in a {@link Matrix} defined by three key-value pairs ({@link axis}=>{@link coordinate})
   * @typedef {Object.<axis, coordinate>} Point
   * @property {coordinate} x - The X-coordinate of a Point
   * @property {coordinate} y - The Y-coordinate of a Point
   * @property {coordinate} z - The Z-coordinate of a Point
   */

  /**
   * Store the point data for an x, y, z {@link Matrix}.
   * @function point
   * @param {coordinate} x - The numeric value for X-coordinate
   * @param {coordinate} y - The numeric value for Y-coordinate
   * @param {coordinate} [z=0] - The numeric value for Z-coordinate (default to 0 for 2D {@link Matrix})
   * @returns {Point}
   */
  jDomObjectsMatrix.point = (x, y, z = 0) => ({
    x: x,
    y: y,
    z: z
  })

  /**
   * MatrixTile is an Object which stores a reference a {@link Point} and can be populated with additionally associated fields.
   * @typedef {Object.<string, Point>} MatrixTile
   * @property {Point} point - a reference to its location in a {@link Matrix}
   */

  /**
   * A default tile in the {@link Matrix}
   * @function tile
   * @returns {MatrixTile}
   */
  jDomObjectsMatrix.tile = () => ({
    point: {}
  })

  /**
   * Matrix is a multi-level {@link DOMItem} which is used to visually represent a mathematical grid / matrix.
   * The matrix consists of four DOMItem levels, at the top tier is the Matrix container with class matrix.
   * The second tier represents the z axis (with property axis='z') and has the class layer.
   * The third tier represents the y axis (with property axis='y') and has the class row.
   * The fourth (final) tier represents the x axis (with property axis='x') and has the class column.
   * The {@link MatrixTile} is attached on the x axis tier.
   * The number of children at each level is defined by the size of the matrix, the end result is a multidimensional array.
   * @typedef {DOMItem} Matrix
   * @augments DOMItem
   */

  /**
   * Create a 3d matrix of i with x by y by z size,
   * add additional objects for each layer as well
   * @function matrix
   * @param {MatrixTile} i - All the data to be presented as part of the specified point, requires MatrixTile base
   * @param {coordinate} x - A number / coordinate defining the width of the matrix.
   * @param {coordinate} y - A number / coordinate defining the height of the matrix.
   * @param {coordinate} [z=1] - A number / coordinate defining the depth of the matrix.
   * @param {...Object} [props] - Additional data may be merged into every level of the matrix.
   * @returns {Matrix}
   */
  jDomObjectsMatrix.matrix = (i, x, y, z = 1, ...props) => jDomObjects.DOMItem({
    tagName: 'div',
    attributes: {
      className: 'matrix'
    },
    children: jDomCore.buildArray(jDomObjects.DOMItem({
      axis: 'z',
      tagName: 'div',
      attributes: {
        className: 'layer'
      },
      children: jDomCore.buildArray(jDomObjects.DOMItem({
        axis: 'y',
        tagName: 'div',
        attributes: {
          className: 'row'
        },
        children: jDomCore.buildArray(jDomObjects.DOMItem({
          axis: 'x',
          tagName: 'div',
          attributes: {
            className: 'column'
          }
        }, ...props, i), x)
      }, ...props), y)
    }, ...props), z)
  })

  /**
   * Return a single layer matrix where x and y are equal
   * @function square
   * @param {MatrixTile} i - All the data to be presented as part of the specified point, requires MatrixTile base
   * @param {number} size - Used to define height and width as equal values (depth is set to 1)
   * @returns {Matrix}
   */
  jDomObjectsMatrix.square = (i, size) => jDomObjectsMatrix.matrix(i, size, size)

  /**
   * Return a matrix where x, y, and z are equal
   * @function cube
   * @param {MatrixTile} i - All the data to be presented as part of the specified point, requires MatrixTile base
   * @param {number} size - Used to define height, width, and depth as equal values
   * @returns {Matrix}
   */
  jDomObjectsMatrix.cube = (i, size) => jDomObjectsMatrix.matrix(i, size, size, size)

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = jDomObjectsMatrix
    }
    exports = Object.assign(exports, jDomObjectsMatrix)
  }
}).call(this || window || base || {}) // Use the external context to assign this, which will be Window if rendered via browser
