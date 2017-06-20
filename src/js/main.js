"use strict";
(function () {
    /**
     * Store the players which have status = 0
     * @type {Array}
     */
    let playersLost = [];

    /**
     * Create players and associated properties.
     * Takes an integer for the number of players to generate.
     * Returns an array of players.
     * @param humans
     * @param robots
     * @returns {Array}
     */
    const buildPlayers = (humans, robots = 0) => {
        let players = []; // temporary players array
        let playerCnt = humans + robots;
        if (playerCnt < 2) {
            playerCnt = 2;
        }

        // build the player list up the the number provided
        for (let i = 0; i < playerCnt; ++i) {
            let player = playerSet(); // get default player object
            player.isRobot = --humans < 0;
            let board = square(waterTile(), 10); // generate matrix for player board
            board = bindPointData(board); // bind point data to each item in matrix
            board = bindElements(boardHTML(), board); // bind HTML element data to each item in matrix
            player.board = board;
            let htmlBoard = appendHTML(player.board); // translate matrix into visual HTML board
            player.shipFleet = defaultFleet(player.board, false); // generate fleet of ships
            // attach event listeners to each board tile
            bindListeners(player.board, 'click', launchAttack, player.board, player, players, playersLost);
            // add new player to array
            players.push(player);
        }
        return players;
    }

    /**
     * Logic for setting up and starting a new round
     * (selects random start player and calls computer attack if it is AI starting)
     * @param players
     * @param playersLost
     * @param firstGoesFirst
     */
    const beginRound = (players, playersLost, firstGoesFirst = false) => {
        let firstAttacker = updatePlayer(firstGoesFirst ? players[0] : players[Math.floor(Math.random() * players.length)]);
        if (firstAttacker.isRobot) {
            computerAttack(firstAttacker, players, playersLost, false);
        }
    }

    /**
     *
     * @type {Array}
     */
    let players = buildPlayers(1);

    console.log(players);
    console.log(playersLost);

    beginRound(players, playersLost, false);
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
}());
