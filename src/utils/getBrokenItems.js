/**
 * Given an array of items, return all of the items which have a status less than 100, but more than 0
 * @function getBrokenItems
 * @param items
 * @returns {Array}
 */
const getBrokenItems = items => items.filter(i => i.status < 100 && i.status > 0)

export default getBrokenItems
