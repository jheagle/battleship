/**
 * @file Core Matrix objects for representing DOM grid in JSON.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
'use strict'
;(function () {
  /**
   * Store a reference to this scope which will be Window if rendered via browser
   */
  let root = this || {}

  /**
   * Store reference to any pre-existing module of the same name
   * @type {module|*}
   */
  const previousJDomMatrixObjects = root.jDomMatrixObjects || {}

  /**
   * All methods exported from this module are encapsulated within jDomMatrixObjects.
   * @author Joshua Heagle <joshuaheagle@gmail.com>
   * @typedef {Object} jDomMatrixObjects
   * @module jDom/matrix/objects
   */
  const jDomMatrixObjects = {}
  root.jDomMatrixObjects = jDomMatrixObjects

  /**
   * Return a reference to this library while preserving the original same-named library
   * @function noConflict
   * @returns {jDomMatrixObjects}
   */
  jDomMatrixObjects.noConflict = () => {
    root.jDomMatrixObjects = previousJDomMatrixObjects
    return jDomMatrixObjects
  }

  /**
   * Verify availability of jDomCore
   * @typedef {*|module:jDom/core/core} jDomCore
   */
  let jDomCore = root.jDomCore

  /**
   * If jDomCore remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomCore === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomCore = require('../core/core.js')
    } else {
      console.error('objects.js requires jDomCore')
    }
  }

  /**
   * Verify availability of jDomObjects
   * @typedef {*|module:jDom/core/dom/objects} jDomObjects
   */
  let jDomObjects = root.jDomObjects

  /**
   * If jDomObjects remains undefined, attempt to retrieve it as a module
   */
  if (typeof jDomObjects === 'undefined') {
    if (typeof require !== 'undefined') {
      jDomObjects = require('../core/dom/objects.js')
    } else {
      console.error('core.js requires jDomObjects')
    }
  }

  /**
   * A string representing an axis: x, y, z
   * @typedef {string} module:jDom/matrix/objects.axis
   */

  /**
   * A number representing a coordinate in a {@link module:jDom/matrix/objects.Matrix}
   * @typedef {number} module:jDom/matrix/objects.coordinate
   */

  /**
   * Point stores a location in a {@link module:jDom/matrix/objects.Matrix} defined by three key-value pairs
   * ({@link module:jDom/matrix/objects.axis}=>{@link module:jDom/matrix/objects.coordinate})
   * @typedef {
   * Object.<module:jDom/matrix/objects.axis, module:jDom/matrix/objects.coordinate>
   *   } module:jDom/matrix/objects.Point
   * @property {module:jDom/matrix/objects.coordinate} x - The X-coordinate of a Point
   * @property {module:jDom/matrix/objects.coordinate} y - The Y-coordinate of a Point
   * @property {module:jDom/matrix/objects.coordinate} z - The Z-coordinate of a Point
   */

  /**
   * Point stores a location in a {@link module:jDom/matrix/objects.Matrix} defined by three key-value pairs
   * @typedef {module:jDom/matrix/objects.Point} module:jDom/matrix/objects.Direction
   * @property {module:jDom/matrix/objects.coordinate} x - The X-coordinate must be either -1, 0, or 1
   * @property {module:jDom/matrix/objects.coordinate} y - The Y-coordinate must be either -1, 0, or 1
   * @property {module:jDom/matrix/objects.coordinate} z - The Z-coordinate must be either -1, 0, or 1
   */

  /**
   * Store the point data for an x, y, z {@link module:jDom/matrix/objects.Matrix}.
   * @function point
   * @param {module:jDom/matrix/objects.coordinate} x - The numeric value for X-coordinate
   * @param {module:jDom/matrix/objects.coordinate} y - The numeric value for Y-coordinate
   * @param {module:jDom/matrix/objects.coordinate} [z=0] - The numeric value for Z-coordinate (default to 0 for 2D
   * {@link module:jDom/matrix/objects.Matrix})
   * @returns {module:jDom/matrix/objects.Point}
   */
  jDomMatrixObjects.point = (x, y, z = 0) => ({
    x: x,
    y: y,
    z: z
  })

  /**
   * MatrixTile is an Object which stores a reference a {@link Point} and can be populated with additionally associated
   * fields.
   * @typedef {Object.<string, module:jDom/matrix/objects.Point>} module:jDom/matrix/objects.MatrixTile
   * @property {module:jDom/matrix/objects.Point} point - a reference to its location in a
   * {@link module:jDom/matrix/objects.Matrix}
   * @property {module:jDom/matrix/objects.axis} axis - The axis will be 'x'
   */

  /**
   * A default tile in the {@link module:jDom/matrix/objects.Matrix}
   * @function tile
   * @returns {module:jDom/matrix/objects.MatrixTile}
   */
  jDomMatrixObjects.tile = () => ({
    point: {}
  })

  /**
   * MatrixColumn is a DomItem which represents the x axis and also stores {@link module:jDom/matrix/objects.MatrixTile}
   * @typedef {
   * module:jDom/core/dom/objects.DomItem|module:jDom/matrix/objects.MatrixTile
   * } module:jDom/matrix/objects.MatrixColumn
   */

  /**
   * MatrixRow is the parent of a group of {@link module:jDom/matrix/objects.MatrixTile}
   * @typedef {module:jDom/core/dom/objects.DomItem} module:jDom/matrix/objects.MatrixRow
   * @property {module:jDom/matrix/objects.axis} axis - The axis will be 'y'
   * @property {Array.<module:jDom/matrix/objects.MatrixColumn>} children - all of the MatrixTile items as part of this
   * MatrixRow
   */

  /**
   * MatrixLayer is the parent of a group of {@link module:jDom/matrix/objects.MatrixTile}
   * @typedef {module:jDom/core/dom/objects.DomItem} module:jDom/matrix/objects.MatrixLayer
   * @property {module:jDom/matrix/objects.axis} axis - The axis will be 'y'
   * @property {Array.<module:jDom/matrix/objects.MatrixRow>} children - all of the MatrixRow items as part of this
   * MatrixLayer
   */

  /**
   * Matrix is a multi-level {@link module:jDom/core/dom/objects.DomItem} which is used to visually represent a
   * mathematical grid / matrix.
   * The matrix consists of four DomItem levels, at the top tier is the Matrix container with class matrix.
   * The second tier represents the z axis (with property axis='z') and has the class layer.
   * The third tier represents the y axis (with property axis='y') and has the class row.
   * The fourth (final) tier represents the x axis (with property axis='x') and has the class column.
   * The {@link module:jDom/matrix/objects.MatrixTile} is attached on the x axis tier.
   * The number of children at each level is defined by the size of the matrix, the end result is a multidimensional
   * array.
   * @typedef {module:jDom/core/dom/objects.DomItem} module:jDom/matrix/objects.Matrix
   * @augments module:jDom/core/dom/objects.DomItem
   */

  /**
   * Create a 3d matrix of i with x by y by z size, add additional objects for each layer as well
   * @function matrix
   * @param {
   * {coordinate: module:jDom/matrix/objects.coordinate, props: Array.<module:jDom/matrix/objects.MatrixTile>}
   * } x - Properties and a coordinate defining the width of the matrix.
   * @param {
   * {coordinate: module:jDom/matrix/objects.coordinate, props: Array.<module:jDom/matrix/objects.MatrixRow>}
   * } y - Properties and a coordinate defining the height of the matrix.
   * @param {
   * {coordinate: module:jDom/matrix/objects.coordinate, props: Array.<module:jDom/matrix/objects.MatrixLayer>}
   * } z - Properties and a coordinate defining the depth of the matrix.
   * @param {Array.<module:jDom/matrix/objects.Matrix>} matrixProps - Properties to be added to the matrix
   * @returns {module:jDom/matrix/objects.Matrix}
   */
  jDomMatrixObjects.matrix = (
    x = {coordinate: 0, props: []},
    y = {coordinate: 0, props: []},
    z = {coordinate: 1, props: []},
    matrixProps = []
  ) => jDomObjects.createDomItem({
    tagName: 'div',
    attributes: {
      className: 'matrix'
    },
    children: jDomCore.buildArray(jDomObjects.createDomItem({
      axis: 'z',
      tagName: 'div',
      attributes: {
        className: 'layer'
      },
      children: jDomCore.buildArray(jDomObjects.createDomItem({
        axis: 'y',
        tagName: 'div',
        attributes: {
          className: 'row'
        },
        children: jDomCore.buildArray(jDomObjects.createDomItem({
          axis: 'x',
          tagName: 'div',
          attributes: {
            className: 'column'
          }
        }, ...x.props), x.coordinate)
      }, ...y.props), y.coordinate)
    }, ...z.props), z.coordinate)
  }, ...matrixProps)

  /**
   * Return a single layer matrix where x and y are equal
   * @function square
   * @param {Array.<module:jDom/matrix/objects.MatrixTile>} [x=[]] - All the data to be presented as part of the
   * specified point, requires MatrixTile base
   * @param {Array.<module:jDom/matrix/objects.MatrixRow>} [y=[]] - Additional data to append to the MatrixRow
   * @param {Array.<module:jDom/matrix/objects.MatrixLayer>} [z=[]] - Additional data to append to the MatrixLayer
   * @param {Array.<module:jDom/matrix/objects.Matrix>} [matrixProps=[]] - Additional data to append to the Matrix
   * @param {number} size - Used to define height and width as equal values (depth is set to 1)
   * @returns {module:jDom/matrix/objects.Matrix}
   */
  jDomMatrixObjects.square = ({x = [], y = [], z = [], matrixProps = []} = {}, size) => jDomMatrixObjects.matrix(
    {coordinate: size, props: x},
    {coordinate: size, props: y},
    {coordinate: 1, props: z},
    matrixProps
  )

  /**
   * Return a matrix where x, y, and z are equal
   * @function cube
   * @param {Array.<module:jDom/matrix/objects.MatrixTile>} [x=[]] - All the data to be presented as part of the
   * specified point, requires MatrixTile base
   * @param {Array.<module:jDom/matrix/objects.MatrixRow>} [y=[]] - Additional data to append to the MatrixRow
   * @param {Array.<module:jDom/matrix/objects.MatrixLayer>} [z=[]] - Additional data to append to the MatrixLayer
   * @param {Array.<module:jDom/matrix/objects.Matrix>} [matrixProps=[]] - Additional data to append to the Matrix
   * @param {number} size - Used to define height, width, and depth as equal values
   * @returns {module:jDom/matrix/objects.Matrix}
   */
  jDomMatrixObjects.cube = ({x = [], y = [], z = [], matrixProps = []} = {}, size) => jDomMatrixObjects.matrix(
    {coordinate: size, props: x},
    {coordinate: size, props: y},
    {coordinate: size, props: z},
    matrixProps
  )

  /**
   * Either export all functions to be exported, or assign to the Window context
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = jDomMatrixObjects
    }
    exports = Object.assign(exports, jDomMatrixObjects)
  }
}).call(this || window || base || {})
// Use the external context to assign this, which will be Window if rendered via browser
