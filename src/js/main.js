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
     * @param players
     * @returns {Array}
     */
    const buildPlayers = (humans, robots = 0, players = []) => {
        if (humans < 1 && robots < 1) {
            return players
        }
        // 1. generate matrix for player board
        // 2. bind point data to each item in matrix
        // 3. bind HTML element data to each item in matrix
        // 4. bind event listeners to each board tile
        // 5. append the elements as HTML
        let player = bindListeners(...buildArray(bindElements(bindPointData(mergeObjects(playerSet(), {isRobot: humans <= 0}, square(waterTile(), 10)))), 2), players)
        player.shipFleet = defaultFleet(player) // generate fleet of ships
        players.push(player)
        return buildPlayers(--humans, humans < 0 ? --robots : robots, players)
    }

    /**
     * Logic for setting up and starting a new round
     * (selects random start player and calls computer attack if it is AI starting)
     * @param e
     * @param mainForm
     * @returns {boolean}
     */
    const beginRound = (e, mainForm) => {
        e.preventDefault()
        let humans = parseInt(getChildrenFromAttribute(mainForm, 'name', 'human-players')[0].element.value)
        let robots = parseInt(getChildrenFromAttribute(mainForm, 'name', 'robot-players')[0].element.value)
        let firstGoesFirst = getChildrenFromAttribute(mainForm, 'name', 'first-go-first')[0].element.checked
        humans = humans < 0 ? 0 : humans
        if (humans === 0) {
            robots = robots < 2 ? 2 : robots
        }
        if (humans === 1) {
            robots = robots < 1 ? 1 : robots
        }
        removeChild(getChildrenFromAttribute(documentItem.body, 'class', 'main-menu')[0])
        let players = buildPlayers(humans, robots)
        appendHTML(players, appendHTML(bindElements(boards()))) // create div for storing players
        let firstAttacker = updatePlayer(firstGoesFirst ? players[0] : players[Math.floor(Math.random() * players.length)])
        if (firstAttacker.isRobot) {
            computerAttack(firstAttacker, players, false)
        }
        return false
    }

    const main = () => {
        let menu = bindElements(mainMenu())
        bindListeners(mergeObjects(getChildrenFromAttribute(menu, 'class', 'main-menu-form')[0], {eventListeners: {submit: beginRound}}))
        appendHTML(menu, documentItem.body)
    }

    main()

    console.log(documentItem);

    //TODO: Create an update system to refresh all the elements with updated attributes / eventListeners / properties.
    //TODO: Synchronise all the DOMItem attributes with any changes on elements if this would ever happen
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
