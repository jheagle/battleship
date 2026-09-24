import jsonDom from 'json-dom'

/**
 * Default properties for a tile in the battleship game.
 * @returns {module:jDom/core/dom/objects.DomItem}
 */
const gameTile = () => jsonDom.createDomItem({
  hasShip: false,
  isHit: false
})

export default gameTile
