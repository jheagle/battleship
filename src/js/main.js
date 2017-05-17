"use strict";
( function () {
    const buildPlayers = (num) => {
        let players = [];
        for (let i = 0; i < num; ++i) {
            let player = playerSet();
            player.board = squareMatrix(10);
            let boardAttack = launchAttack(player.board);
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

}() );
