import jDomMatrix from 'matrix-dom'
import siFunciona from 'si-funciona'

/**
 */
const selectShipDirection = () => {
  // Since ships can only go along a single axis, just randomly pick the one that is 1, and use 0 for the other, z is always 0
  // Using the real random direction function gets diagonals, and even we can use z-axis
  // It might be interesting to have diagonal ships in a future version, or even ships on z axis for 3d locations (submarines?)
  const dirX = siFunciona.randomInteger(2, 0)
  const dirY = dirX === 0 ? 1 : 0
  return jDomMatrix.direction(dirX, dirY, 0)
}

export default selectShipDirection
