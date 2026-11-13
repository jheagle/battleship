import treeloom from 'treeloom'
import type { DomItem } from 'treeloom/dist/domItem/types'
import type { Player } from '../../types'

/**
 * Wrapper div for player data / boards
 * @param players
 */
const boards = (players: Player[] = []): DomItem => treeloom.createDomItem({
  nodeName: 'div',
  attributes: {
    className: 'boards'
  },
  children: players
})

export default boards
