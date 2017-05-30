"use strict";
( function () {
    /**
     * Store the players which have status = 0
     * @type {Array}
     */
    let playersLost = [];

    /**
     * Create players and associated properties.
     * Takes an integer for the number of players to generate.
     * Returns an array of players.
     * @param num
     * @returns {Array}
     */
    const buildPlayers = (num) => {
        let players = []; // temporary players array
        let attacker = true; // set first player to attacker

        // build the player list up the the number provided
        for (let i = 0; i < num; ++i) {
            let player = playerSet(); // get default player object
            player.attacker = attacker;
            attacker = false; // set attacker status, all subsequent are false
            player.board = rect3d(waterTile(), 10, 10, 1); // generate matrix for player board
            createTable(locateCells(player.board), document.body); // translate matrix into visual HTML board
            player.shipFleet = defaultFleet(player.board, true); // generate fleet of ships
            // attach event listeners to each board tile
            bindListeners(player.board, launchAttack, player.board, player, players, playersLost);
            // add new player to array
            players.push(player);
        }
        return players;
    }

    /**
     *
     * @type {Array}
     */
    let players = buildPlayers(2);
    console.log(players);
    console.log(playersLost);
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
