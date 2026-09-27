import jsonDom from 'json-dom'
import type { DomItem } from 'json-dom/dist/domItem/types'
import type { Player } from '../../types'

/**
 * Wrapper div for player data / boards
 * @param players
 */
const boards = (players: Player[] = []): DomItem => jsonDom.createDomItem({
  nodeName: 'div',
  attributes: {
    className: 'boards'
  },
  children: players
})

export default boards
