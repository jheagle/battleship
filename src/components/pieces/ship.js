/**
 * Store properties of a ship which includes an array of all associated ship tiles.
 * @function ship
 * @param {string} name
 * @returns {{name: string, status: number, parts: Array}}
 */
const ship = (name = '') => ({
  name,
  status: 100,
  parts: []
})

export default ship
