import type { Tile } from '../types'
import { colours } from '../theme'

/**
 * Colour a cell once it has been hit: a flare for a ship, dim empty space for a miss (see theme.ts). Cells only have a
 * style object once something has resized or highlighted them, so it is created here when it is missing.
 * @param config
 */
const colourHitCell = (config: Tile): void => {
  if (config.isHit) {
    config.attributes.style = config.attributes.style || {}
    config.attributes.style.backgroundColor = config.hasShip ? colours.hit : colours.miss
    // A shape as well as a colour (see matrix.sass): a hit is public, so this never reveals a hidden ship
    config.attributes['data-shot'] = config.hasShip ? 'hit' : 'miss'
  }
}

export default colourHitCell
