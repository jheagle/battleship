/**
 * Return the number of damaged ship parts. Performs math on the number of parts vs the damaged status.
 * @param total
 * @param status
 */
const numDamagedParts = (total: number, status: number): number => total - Math.ceil(((status / 100) * total))

export default numDamagedParts
