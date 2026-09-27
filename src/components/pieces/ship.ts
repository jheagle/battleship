import type { Ship } from '../../types'

/**
 * Store properties of a ship which includes an array of all associated ship tiles.
 * @param name
 */
const ship = (name: string = ''): Ship => ({
  name,
  status: 100,
  parts: []
})

export default ship
