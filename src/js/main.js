"use strict";
( function () {
    const buildPlayers = (num) => {
        let players = [];
        for (let i = 0; i < num; ++i) {
            let player = playerSet();
            player.board = squareMatrix(gameTile(), 10);
            createTable(locateCells(player.board), document.body);
            player.shipFleet = defaultFleet(player.board, true);
            let focusFleet = (player.shipFleet);
            bindListeners(player.board, focusFleet, player.board, player.shipFleet);
            players.push(player);

        }
        return players;
    }

    let players = buildPlayers(1);
    console.log(players);
    // let results = mergeObjects({
    //     a: 1,
    //     b: 2,
    //     c: 3,
    // },{
    //     b: 4,
    //     c: 5,
    //     d: 6,
    // },{
    //     c: 7,
    //     d: 8,
    //     e: 9,
    // });
    // console.log(results);
}() );
