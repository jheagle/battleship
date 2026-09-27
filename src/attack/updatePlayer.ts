import jsonDom from 'json-dom'
import siFunciona from 'si-funciona'
import attackLock from './attackLock'
import queueTimeout from '../queue'
import updatePlayerStats from './updatePlayerStats'

/**
 * Track player stats such as attacks and turns
 * @function updatePlayer
 * @param player
 * @param hitShip
 * @param sunkShip
 */
const updatePlayer = (player, hitShip, sunkShip = 0) => {
  if (player.attacker) {
    if (hitShip) {
      ++player.attacks.hit
    } else {
      ++player.attacks.miss
    }
    if (sunkShip) {
      ++player.attacks.sunk
    }
  }
  // If we add house rules options, enable replay on successful hit here
  // if (hitShip) {
  //   queueTimeout(() => updatePlayerStats(player, player.attacker ? 'ATTACKER' : `${Math.round(player.status * 100) / 100}%`), 0)
  //   return player
  // }
  player.attacker = !player.attacker
  attackLock.isLocked = true
  if (player.attacker) {
    if (!player.isRobot) {
      queueTimeout(() => {
        attackLock.isLocked = false
        return player.board.children.map(l => l.children.map(r => r.children.map(c => jsonDom.updateElement(siFunciona.mergeObjectsMutable(c, {
          attributes: {
            style: {
              width: '17px',
              height: '17px'
            }
          }
        })))))
      }, 400)
    }
    ++player.turnCnt
  } else {
    queueTimeout(() => {
      attackLock.isLocked = false
      return player.board.children.map(l => l.children.map(r => r.children.map(c => jsonDom.updateElement(siFunciona.mergeObjectsMutable(c, {
        attributes: {
          style: {
            width: '35px',
            height: '35px'
          }
        }
      })))))
    }, 0)
  }
  queueTimeout(() => updatePlayerStats(player, player.attacker ? 'ATTACKER' : `${Math.round(player.status * 100) / 100}%`), 0)
  return player
}

export default updatePlayer
