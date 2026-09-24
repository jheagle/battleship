import getALowStatusItem from './getALowStatusItem'

/**
 * Given an array of items, return all items which have the lowest status property
 * @function getLowStatusItems
 * @param items
 * @returns {Array}
 */
const getLowStatusItems = items => items.filter(i => i.status <= getALowStatusItem(items).status)

export default getLowStatusItems
