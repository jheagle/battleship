// Functions for computer generated actions
/**
 * Choose which player to attack.
 * @param players
 * @returns {*}
 */
const selectTargetPlayer = (players) => {
    // Get a list of all players with broken ships or with lowest status.
    let victims = getBrokenShipsPlayers(players).length ? getBrokenShipsPlayers(players) : getLowStatusItems(players)
    // If more than one possible victim, select a random target, otherwise return the lowest status player.
    return victims.length === 1 ? victims[0] : victims[Math.floor(Math.random() * victims.length)]
}

/**
 * Choose which coordinate to attack.
 * @param victim
 * @param lastTarget
 * @returns {*}
 */
const selectTargetCoord = (victim, lastTarget) => {
    // Try to get broken ships
    let brokenShips = getBrokenItems(victim.shipFleet)
    if (brokenShips.length) {
        // If there are broken ships, target those first, select the most broken ships (more than one damaged part)
        let moreBrokenShips = brokenShips.filter(ship => numDamangedParts(ship.parts.length, ship.status) > 1)
        // Of the broken ships, attack the lowest status ship
        let targetShip = getALowStatusItem(moreBrokenShips.length ? moreBrokenShips : brokenShips)
        // Get all of the parts which have been hit
        let hitParts = targetShip.parts.filter(part => checkIfHitCell(part.point, victim.board))
        if (moreBrokenShips.length) {
            // If there are more broken ships, attack the parts between hit points first.
            for (let i = 0; i < hitParts.length; ++i) {
                let targetPoints = getInBetween(hitParts[0].point, hitParts[i].point, victim.board, checkIfHitCell, false)
                if (targetPoints.false.length) {
                    return targetPoints.false[0]
                }
            }
            // If there are not points between, attack the outer points first.
            let pntDiff = pointDifference(hitParts[0].point, hitParts[1].point)
            let dirPnts = pntDiff.x > 0 ? [point(-1, 0, 0), point(1, 0, 0)] : [point(0, -1, 0), point(0, 1, 0)]
            // Check outer points which are valid and not hit.
            let target = dirPnts.map((p, i) => nextCell(hitParts[(hitParts.length - 1) * i].point, p)).filter(p => checkValidPoint(p, victim.board)).reduce((a, b) => checkIfHitCell(a, victim.board) ? b : a)
            if (target) {
                return target
            }
        }
        // If there is only one hit part, then set that as the lastTarget for detecting adjacent parts.
        lastTarget = hitParts[0].point
    }
    // Based on lastTarget hit (used for playAgain and broken ships), find the adjacent points which have not been hit
    let availTargets = lastTarget ? getAdjEdgeNonHitCells(lastTarget, victim.board) : getAllNonHitCells(victim.board)
    if (availTargets.length) {
        // If there are available targets then hit one at random
        return availTargets[Math.floor(Math.random() * availTargets.length)]
    }
    // If the adjacent hit function failed then we just default any point which was not hit
    return getAllNonHitCells(victim.board)[Math.floor(Math.random() * availTargets.length)]
}

/**
 * Main AI logic for computer to attack, selects a target then performs attack function.
 * @param player
 * @param players
 * @param playersLost
 * @param lastTarget
 */
const computerAttack = (player, players, playersLost = [], lastTarget = {}) => {
    let victim = selectTargetPlayer(players.filter(p => !p.attacker))
    attackFleet(selectTargetCoord(victim, lastTarget), victim.board, victim, players, playersLost)
}
