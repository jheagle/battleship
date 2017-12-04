// Core Matrix Objects
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
 * @param {coordinate} x - The numeric value for X-coordinate
 * @param {coordinate} y - The numeric value for Y-coordinate
 * @param {coordinate} [z=0] - The numeric value for Z-coordinate (default to 0 for 2D {@link Matrix})
 * @returns {Point}
 */
const point = (x, y, z = 0) => ({
  x: x,
  y: y,
  z: z,
})

/**
 * MatrixTile is an Object which stores a reference a {@link Point} and can be populated with additionally associated fields.
 * @typedef {Object.<string, Point>} MatrixTile
 * @property {Point} point - a reference to its location in a {@link Matrix}
 */

/**
 * A default tile in the {@link Matrix}
 * @returns {MatrixTile}
 */
const tile = () => ({
  point: {},
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
 * @param {MatrixTile} i - All the data to be presented as part of the specified point, requires MatrixTile base
 * @param {coordinate} x - A number / coordinate defining the width of the matrix.
 * @param {coordinate} y - A number / coordinate defining the height of the matrix.
 * @param {coordinate} [z=1] - A number / coordinate defining the depth of the matrix.
 * @param {...Object} [props] - Additional data may be merged into every level of the matrix.
 * @returns {Matrix}
 */
const matrix = (i, x, y, z = 1, ...props) => DOMItem({
  tagName: 'div',
  attributes: {
    className: 'matrix'
  },
  children: buildArray(DOMItem({
    axis: 'z',
    tagName: 'div',
    attributes: {
      className: 'layer'
    },
    children: buildArray(DOMItem({
      axis: 'y',
      tagName: 'div',
      attributes: {
        className: 'row'
      },
      children: buildArray(DOMItem({
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
 * @param {MatrixTile} i - All the data to be presented as part of the specified point, requires MatrixTile base
 * @param {number} size - Used to define height and width as equal values (depth is set to 1)
 * @returns {Matrix}
 */
const square = (i, size) => matrix(i, size, size)

/**
 * Return a matrix where x, y, and z are equal
 * @param {MatrixTile} i - All the data to be presented as part of the specified point, requires MatrixTile base
 * @param {number} size - Used to define height, width, and depth as equal values
 * @returns {Matrix}
 */
const cube = (i, size) => matrix(i, size, size, size)
