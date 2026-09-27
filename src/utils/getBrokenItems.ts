/**
 * Given an array of items, return all of the items which have a status less than 100, but more than 0
 * @param items
 */
const getBrokenItems = <Item extends { status: number }> (items: Item[]): Item[] => items.filter(i => i.status < 100 && i.status > 0)

export default getBrokenItems
