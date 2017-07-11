'use strict';
(function () {

    /**
     * Create new private reference to the document
     */
    let documentItem = documentDOMItem()

    /**
     * Create players and associated properties.
     * Takes an integer for the number of players to generate.
     * Returns an array of players.
     * @param humans
     * @param robots
     * @returns {Array}
     */
    const buildPlayers = (humans, robots = 0) => {
        let playerBoards = bindElements(boards())
        appendHTML(playerBoards, documentItem.body) // create div for storing players
        let playerCnt = humans + robots
        if (playerCnt < 2) {
            playerCnt = 2
        }
        let players = playerBoards.children

        // build the player list up the the number provided
        for (let i = 0; i < playerCnt; ++i) {
            // 1. generate matrix for player board
            // 2. bind point data to each item in matrix
            // 3. bind HTML element data to each item in matrix
            let player = bindElements(bindPointData(mergeObjects(playerSet(), square(waterTile(), 10))))
            player.isRobot = --humans < 0
            appendHTML(player, playerBoards) // translate matrix into visual HTML board
            player.shipFleet = defaultFleet(player, false) // generate fleet of ships
            // attach event listeners to each board tile
            bindListeners(player, player, players)
        }
        return players
    }

    /**
     * Logic for setting up and starting a new round
     * (selects random start player and calls computer attack if it is AI starting)
     * @param players
     * @param firstGoesFirst
     */
    const beginRound = (players, firstGoesFirst = false) => {
        let firstAttacker = updatePlayer(firstGoesFirst ? players[0] : players[Math.floor(Math.random() * players.length)])
        if (firstAttacker.isRobot) {
            computerAttack(firstAttacker, players, false)
        }
    }

    const main = () => {
        let menu = bindElements(mainMenu())
        appendHTML(menu, documentItem.body)
    }

    main()

    beginRound(buildPlayers(1), false)

    console.log(documentItem);
    // samples expanded from https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge#new-answer
    // let results = mergeObjects({
    //     a: { a: 1},
    // },{
    //     a: { b: 1},
    // },{
    //     a: { b: 2, c: 1},
    //     b: 2,
    // })
    // console.log(results)
}())
