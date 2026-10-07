import jsonDom from 'json-dom'
import matrixDom from 'matrix-dom'
import getAttackLock from './attackLock'
import setHit from '../cells/setHit'
import updatePlayerStats from './updatePlayerStats'
import updateScore from './updateScore'
import type { Player, Ship, Tile } from '../types'

/**
 * Perform attack on an enemy board / cell
 * @param target
 */
const attackFleet = (target: Tile): Player[] => {
  const attackLock = getAttackLock(target)
  let player = jsonDom.getParentsByClass('player', target)[0] as Player
  const players = jsonDom.getParentsByClass('boards', target)[0].children as Player[]
  // Player cannot attack themselves (current attacker), if they have bad status, or a cell which was already hit
  if (player.status <= 0 || player.attacker || attackLock.isLocked || target.isHit) {
    return players
  }
  // Update cell to hit
  const hitCell = setHit(player.board, target.point.x, target.point.y, target.point.z, players.reduce((p1, p2) => p1.attacker ? p1 : p2).isRobot)
  let hitShip: Ship | false = false
  let sunkShip = 0
  if (hitCell.hasShip) {
    let status = 0
    // Update all ship status and player status by checking all ships / parts
    player.shipFleet.map((ship) => {
      // Get all healthy ships
      const healthy = ship.parts.filter((part) => {
        if (matrixDom.areEqualPoints(part.point, target.point)) {
          hitShip = ship
        }
        return !part.isHit
      })
      // Create percentage health status
      ship.status = healthy.length / ship.parts.length * 100
      // Create sum of ship status
      status += ship.status
      return ship
    })
    // Divide sum of ship statuses by number of ships to get player status
    player.status = status / player.shipFleet.length
  }
  if (hitShip) {
    // TS cannot track the reassignment inside the map() callback above, hitShip is really a Ship here
    const theHitShip = hitShip as unknown as Ship
    player = updatePlayerStats(player, `${Math.round(player.status * 100) / 100}%`)
    // Check if the hit ship was sunk
    sunkShip = theHitShip.status <= 0 ? theHitShip.parts.length : 0
  }
  return updateScore(hitCell.hasShip, sunkShip, players)
}

export default attackFleet
