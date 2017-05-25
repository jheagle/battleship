"use strict";
( function () {
    const buildPlayers = (num) => {
        let players = [];
        for (let i = 0; i < num; ++i) {
            let player = playerSet();
            player.board = rect3d(waterTile(), 10, 10, 1);
            createTable(locateCells(player.board), document.body);
            player.shipFleet = defaultFleet(player.board[0], true);
            let focusFleet = (player.shipFleet);
            bindListeners(player.board, focusFleet, player.board, player.shipFleet);
            players.push(player);

        }
        return players;
    }

    let players = buildPlayers(1);
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
