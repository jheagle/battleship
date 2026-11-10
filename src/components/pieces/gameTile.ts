import jsonDom from 'json-dom'
import type { Tile } from '../../types'

/**
 * Default properties for a tile in Cloakfall.
 */
const gameTile = (): Tile => jsonDom.createDomItem({
  has: { 'cloakfall.tile': true },
  hasShip: false,
  isHit: false
}) as unknown as Tile

export default gameTile
