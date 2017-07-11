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
 * @returns {*}
 */
const selectTargetCoord = (victim) => {
    // Try to get broken ships
    let brokenShips = getBrokenItems(victim.shipFleet)
    let availTargets = []
    if (brokenShips.length) {
        // If there are broken ships, target those first, select the most broken ships (more than one damaged part)
        let moreBrokenShips = brokenShips.filter(ship => numDamangedParts(ship.parts.length, ship.status) > 1)
        // Of the broken ships, attack the lowest status ship
        let targetShip = getALowStatusItem(moreBrokenShips.length ? moreBrokenShips : brokenShips)
        // Get all of the parts which have been hit
        let hitParts = targetShip.parts.filter(part => checkIfHitCell(part.point, victim))
        if (moreBrokenShips.length) {
            // If there are more broken ships, attack the parts between hit points first.
            for (let i = 0; i < hitParts.length; ++i) {
                let targetPoints = getInBetween(hitParts[0].point, hitParts[i].point, victim, checkIfHitCell, false)
                if (targetPoints.false.length) {
                    displayTargets(targetPoints.false, targetPoints.false[0], victim)
                    return targetPoints.false[0]
                }
            }
            // If there are not points between, attack the outer points first.
            let pntDiff = pointDifference(hitParts[0].point, hitParts[1].point)
            let dirPnts = (pntDiff.x > 0 ? [point(-1, 0, 0), point(1, 0, 0)] : [point(0, -1, 0), point(0, 1, 0)]).map((p, i) => nextCell(hitParts[(hitParts.length - 1) * i].point, p)).filter(p => checkValidPoint(p, victim)).filter(a => !checkIfHitCell(a, victim))
            // Check outer points which are valid and not hit.
            let target = dirPnts.reduce((a, b) => checkIfHitCell(a, victim) ? b : a)
            if (target) {
                displayTargets(dirPnts, target, victim)
                return target
            }
        }
        // If there is only one hit part, then set that as the lastTarget for detecting adjacent parts.
        availTargets = getAdjEdgeNonHitCells(hitParts[0].point, victim)
    }
    let finalTargets = availTargets.length ? availTargets : getAllNonHitCells(victim).filter(t => filterAdjacentPoints(t))
    let target = finalTargets[Math.floor(Math.random() * finalTargets.length)]
    displayTargets(finalTargets, target, victim)

    // If there are available targets then hit one at random
    return target;
}

/**
 *
 * @param targets
 * @param target
 * @param victim
 * @returns {[*,*]}
 */
const displayTargets = (targets, target, victim) => {
    return [
        queueTimeout(resetTargets, 0, {targets: targets, victim: victim}),
        queueTimeout(resetTargets, 400, {targets: targets, target: target, victim: victim})
    ]
}

/**
 *
 * @param data
 * @returns {void|Array|Object|*}
 */
const resetTargets = data => {
    data.victim.children.map(l => addElementStyles(l.element, {borderColor: '#333'}))
    data.targets.forEach(t => addElementStyles(getDOMItemFromPoint(t, data.victim).element, {borderColor: '#333'}))
    if (data.target) {
        return setHit(data.victim, data.target.x, data.target.y, data.target.z, data.victim.isRobot)
    } else {
        data.victim.children.map(l => addElementStyles(l.element, {borderColor: 'yellow'}))
        return data.targets.forEach(t => addElementStyles(getDOMItemFromPoint(t, data.victim).element, {borderColor: 'yellow'}))
    }
}

/**
 * Main AI logic for computer to attack, selects a target then performs attack function.
 * @param player
 * @param players
 * @param lastTarget
 */
const computerAttack = (player, players, lastTarget = {}) => {
    let victim = selectTargetPlayer(players.filter(p => !p.attacker))
    attackFleet.isLocked = false
    attackFleet(selectTargetCoord(victim, lastTarget), victim, players)
}
