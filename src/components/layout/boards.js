import jsonDom from 'json-dom'

/**
 * Wrapper div for player data / boards
 * @function boards
 * @param {Array} [players=[]]
 * @returns {module:jDom/core/dom/objects.DomItem}
 */
const boards = (players = []) => jsonDom.createDomItem({
  nodeName: 'div',
  attributes: {
    className: 'boards'
  },
  children: players
})

export default boards
