import jsonDom from 'json-dom'
import attackLock from '../attack/attackLock'
import colourHitCell from './colourHitCell'
import queueTimeout from '../queue'

import type { Tile } from '../types'

/**
 * Update view based on actions performed
 * @param config
 * @param isRobot
 */
const configureHtml = (config: Tile, isRobot: boolean): Tile => {
  // Update cell colour once it has been hit
  // Add any other style changes to the cell
  if (isRobot) {
    attackLock.isLocked = true
    queueTimeout(() => {
      colourHitCell(config)
      config = jsonDom.updateElement(config) as Tile
      attackLock.isLocked = false
      return config
    }, 0)
  } else {
    colourHitCell(config)
    config = jsonDom.updateElement(config) as Tile
  }
  return config
}

export default configureHtml
