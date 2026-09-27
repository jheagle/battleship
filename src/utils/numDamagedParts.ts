/**
 * Return the number of damaged ship parts. Performs math on the number of parts vs the damaged status.
 * @function numDamagedParts
 * @param total
 * @param status
 * @returns {number}
 */
const numDamagedParts = (total, status) => total - Math.ceil(((status / 100) * total))

export default numDamagedParts
