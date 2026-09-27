import jsonDom from 'json-dom'
import attackLock from '../attack/attackLock'
import colourHitCell from './colourHitCell'
import queueTimeout from '../queue'

/**
 * Update view based on actions performed
 * @param config
 * @param isRobot
 * @returns {*}
 */
const configureHtml = (config, isRobot) => {
  // Update cell colour once it has been hit
  // Add any other style changes to the cell
  if (isRobot) {
    attackLock.isLocked = true
    queueTimeout(() => {
      colourHitCell(config)
      config = jsonDom.updateElement(config)
      attackLock.isLocked = false
      return config
    }, 0)
  } else {
    colourHitCell(config)
    config = jsonDom.updateElement(config)
  }
  return config
}

export default configureHtml
