import treeloom from 'treeloom'
import type { Tile } from '../../types'

/**
 * Default properties for a tile in Cloakfall.
 */
const gameTile = (): Tile => treeloom.createDomItem({
  has: { 'cloakfall.tile': true },
  hasShip: false,
  isHit: false
}) as unknown as Tile

export default gameTile
