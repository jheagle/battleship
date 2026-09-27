/**
 * Given an array of items, return the item with the lowest status property (at the end of the array)
 * @function getALowStatusItem
 * @param items
 * @returns {Array}
 */
const getALowStatusItem = items => items.reduce((a, b) => b.status <= a.status ? b : a)

export default getALowStatusItem
