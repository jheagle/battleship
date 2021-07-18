/**
 * @file All of the core matrix functions for working with a grid of points.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 */
'use strict'
/**
 * All methods exported from this module are encapsulated within jDomMatrixCore.
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @typedef {Object} jDomMatrixCore
 * @module jDom/matrix/core
 */
const jDomMatrixCore = {}

/**
 * Generate point data for each item in the matrix
 * WARNING: This is a recursive function.
 * @function bindPointData
 * @param {module:jDom/matrix/objects.MatrixColumn|module:jDom/matrix/objects.MatrixRow} item - A special DomItem
 * which is either a layer, row, or column in a matrix.
 * @param {module:jDom/matrix/objects.Point} pnt - A point to be added to a specific Matrix Column
 * @returns {module:jDom/matrix/objects.MatrixColumn|module:jDom/matrix/objects.MatrixRow}
 */
jDomMatrixCore.bindPointData = (item, pnt = jsonDom.point(0, 0, 0)) => {
  if (item.point) {
    return functionalHelpers.setValue(
      'point',
      functionalHelpers.cloneObject(pnt),
      item
    )
  }
  return jDomCore.mergeObjects(
    item,
    {
      children: item.children.map(
        (el, i) => jDomMatrixCore.bindPointData(el, functionalHelpers.setValue(el.axis, i, pnt))
      )
    }
  )
}
