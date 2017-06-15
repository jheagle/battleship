// Functions for computer generated actions
const selectTargetPlayer = (players) => {
    return players.length === 1? players[0]: players[Math.floor(Math.random() * players.length)];
    // return players.reduce( (a, b) => Math.min(a, b));
}

const selectTargetCoord = (matrix, lastTarget) => {

    let lengths = {x: matrix.z[0].y[0].x.length, y: matrix.z[0].y.length, z: matrix.z.length};
    let target = point(0, 0, 0);
    return point(randCoords(lengths.x), randCoords(lengths.y), randCoords(lengths.z))
}

const computerAttack = (player, players, playersLost = [], lastTarget = {}) => {
    let victim = selectTargetPlayer(players.filter(p => !p.attacker));
    console.log('Victim:');
    console.log(victim);
    let target = selectTargetCoord(victim.board, lastTarget);
    console.log('Target:');
    console.log(target);
    attackFleet(target, victim.board, victim, players, playersLost);
}
