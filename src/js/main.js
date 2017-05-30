"use strict";
( function () {
    let playersLost = [];
    const buildPlayers = (num) => {
        let players = [];
        let attacker = true;
        for (let i = 0; i < num; ++i) {
            let player = playerSet();
            player.attacker = attacker;
            attacker = false;
            player.board = rect3d(waterTile(), 10, 10, 1);
            createTable(locateCells(player.board), document.body);
            player.shipFleet = defaultFleet(player.board, true);
            bindListeners(player.board, launchAttack, player.board, player, players, playersLost);
            players.push(player);
        }
        return players;
    }

    let players = buildPlayers(2);
    console.log(players);
    // samples expanded from https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge#new-answer
    // let results = mergeObjects({
    //     a: { a: 1},
    // },{
    //     a: { b: 1},
    // },{
    //     a: { b: 2, c: 1},
    //     b: 2,
    // });
    // console.log(results);
}() );
