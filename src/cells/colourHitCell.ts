/**
 * Colour a cell once it has been hit: red for a ship, white for water. Cells only have a style object once something
 * has resized or highlighted them, so it is created here when it is missing.
 * @param config
 */
const colourHitCell = config => {
  if (config.isHit) {
    config.attributes.style = config.attributes.style || {}
    config.attributes.style.backgroundColor = config.hasShip ? 'red' : 'white'
  }
}

export default colourHitCell
