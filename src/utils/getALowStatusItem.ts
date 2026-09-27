/**
 * Given an array of items, return the item with the lowest status property (at the end of the array)
 * @param items
 */
const getALowStatusItem = <Item extends { status: number }> (items: Item[]): Item => items.reduce((a, b) => b.status <= a.status ? b : a)

export default getALowStatusItem
