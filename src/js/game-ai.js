// Functions for computer generated actions
const selectTargetPlayer = (players) => {
    let victims = getBrokenShipsPlayers(players).length ? getBrokenShipsPlayers(players) : getLowStatusItems(players);
    return victims.length === 1 ? victims[0] : victims[Math.floor(Math.random() * victims.length)];
}

const selectTargetCoord = (victim, lastTarget) => {
    let brokenShips = getBrokenItems(victim.shipFleet);
    if (brokenShips.length) {
        let moreBrokenShips = brokenShips.filter(ship => numDamangedParts(ship.parts.length, ship.status) > 1);
        let targetShip = getALowStatusItem(moreBrokenShips.length ? moreBrokenShips : brokenShips);
        let hitParts = targetShip.parts.filter(part => checkIfHitCell(part.point, victim.board));
        if (moreBrokenShips.length) {
            for (let i = 0; i < hitParts.length; ++i) {
                if (!checkInBetween(hitParts[0].point, hitParts[i].point, victim.board, checkIfHitCell, false)) {
                    return hitParts[--i].point;
                }
            }
            let pntDiff = pointDifference(hitParts[0].point, hitParts[1].point);
            let dirPnts = pntDiff.x > 0 ? [point(-1, 0, 0), point(1, 0, 0)] : [point(0, -1, 0), point(0, 1, 0)];
            let target = dirPnts.map((p, i) => nextCell(hitParts[(hitParts.length - 1) * i].point, p)).filter(p => checkValidPoint(p, victim.board)).reduce((a, b) => checkIfHitCell(a, victim.board) ? b : a);
            if (target) {
                return target;
            }
        }
        lastTarget = hitParts[0].point;
    }
    let availTargets = lastTarget ? getAdjEdgeNonHitCells(lastTarget, victim.board) : getAllNonHitCells(victim.board);
    if (availTargets.length) {
        return availTargets[Math.floor(Math.random() * availTargets.length)];
    }
    return getAllNonHitCells(victim.board)[Math.floor(Math.random() * availTargets.length)];
}

const computerAttack = (player, players, playersLost = [], lastTarget = {}) => {
    let victim = selectTargetPlayer(players.filter(p => !p.attacker));
    attackFleet(selectTargetCoord(victim, lastTarget), victim.board, victim, players, playersLost);
}
