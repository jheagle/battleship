import getALowStatusItem from './getALowStatusItem'

/**
 * Given an array of items, return all items which have the lowest status property
 * @param items
 */
const getLowStatusItems = <Item extends { status: number }> (items: Item[]): Item[] => items.filter(i => i.status <= getALowStatusItem(items).status)

export default getLowStatusItems
