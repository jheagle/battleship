'use strict'

/**
 * A reference to all functions to be used globally / exported
 * @typedef (Object) gameStart
 * @module game/setup
 */
const gameStart = {}

/**
 * Generate a ship with the provided line of points.
 * The visibility of the ship on the board is determined by the view parameter.
 * @param shipInfo
 * @param line
 * @param matrix
 * @param view
 * @returns {{name: string, status: number, parts: Array}}
 */
const buildShip = (shipInfo, line, matrix, view = false) => jDomCore.mergeObjects(gamePieces.ship(shipInfo.name), { parts: line.map(p => gameActions.setShip(matrix, p, view)) })

/**
 *
 * @param lengths
 * @param shipLength
 */
const selectShipDirection = (lengths, shipLength) => jsonDom.randDirection([jsonDom.point(1, 0, 0), jsonDom.point(0, 1, 0), jsonDom.point(0, 0, 1)].filter(p => lengths[jsonDom.getFirstAxisOfCoordinate(p, 1)] > shipLength))

/**
 *
 * @param lengths
 * @param shipLength
 * @param dir
 * @returns {{start: {x: number, y: number, z: number}, dir}}
 */
const randomStartDir = (lengths, shipLength, dir = selectShipDirection(lengths, shipLength)) => ({
  start: jsonDom.randomStart(shipLength, dir, lengths),
  dir: dir
})

/**
 * Get a qualifying start and direction point for a ship of specified length
 * WARNING: This is a recursive function.
 * @param matrix
 * @param shipLength
 * @param lengths
 * @param startDir
 * @returns {Array}
 */
const generateStartEnd = (matrix, shipLength, lengths, startDir = randomStartDir(lengths, shipLength)) =>
  jsonDom.getHighestAbsoluteCoordinate(startDir.dir) === 0 ? [jsonDom.point(0, 0, 0), jsonDom.point(0, 0, 0)] : jsonDom.checkInBetween(...[startDir.start, jsonDom.lineEndPoint(startDir.start, shipLength, startDir.dir)], matrix, gameUtils.checkIfShipCell) ? generateStartEnd(matrix, shipLength, lengths) : [startDir.start, jsonDom.lineEndPoint(startDir.start, shipLength, startDir.dir)]

/**
 * Create a series of randomly placed ships based on the provided shipLengths.
 * The optional parameter view will set the visibility of the ships.
 * @param {Array} ships
 * @param {Object} matrix
 * @param {boolean} [view=false]
 * @returns {Array}
 */
const generateRandomFleet = (ships, matrix, view = false) => ships.map(ship => buildShip(ship, jsonDom.getPointsLine(...generateStartEnd(matrix, ship.size, jsonDom.getAxisLengths(matrix))), matrix, view))

/**
 * Create a default fleet using the standard battleship lengths.
 * @param {Object} matrix
 * @param {boolean} [view=false]
 * @returns {Array}
 */
const defaultFleet = jDomCore.curry(generateRandomFleet)([
  { name: 'Aircraft Carrier', size: 5 },
  { name: 'Battleship', size: 4 },
  { name: 'Submarine', size: 3 },
  { name: 'Cruiser', size: 3 },
  { name: 'Destroyer', size: 2 }
])

/**
 * Create players and associated properties.
 * Takes an integer for the number of players to generate.
 * Returns an array of players.
 * WARNING: This is a recursive function.
 * @param humans
 * @param robots
 * @param players
 * @returns {Array}
 */
const buildPlayers = (humans, robots = 0, players = []) => {
  if (humans < 1 && robots < 1) {
    return players
  }
  const player = gamePieces.playerSet({}, `Player ${players.length + 1}`)
  player.isRobot = humans <= 0
  player.board = jDomMatrixCore.bindPointData(jsonDom.square({
    x: [
      gamePieces.waterTile(player, players)
    ],
    matrixProps: [
      {
        eventListeners: {
          click: { listenerFunc: 'attackListener', listenerArgs: {}, listenerOptions: false }
        }
      }
    ]
  }, 10))
  player.shipFleet = defaultFleet(player.board, false) // generate fleet of ships
  player.playerStats = gamePieces.playerStats(player, `${Math.round(player.status * 100) / 100}%`)
  player.children = [player.board, player.playerStats]
  players.push(player)
  return buildPlayers(--humans, humans < 0 ? --robots : robots, players)
}

/**
 * Logic for setting up and starting a new round
 * (selects random start player and calls computer attack if it is AI starting)
 * @function beginRound
 * @param e
 * @param mainForm
 * @returns {boolean}
 */
gameStart.beginRound = (e, mainForm) => {
  if (e.eventPhase !== 2) {
    return false
  }
  console.log('beginRound', e.eventPhase, e.type)
  e.preventDefault()
  const parent = jsonDom.getTopParentItem(mainForm)
  let humans = parseInt(jsonDom.getChildrenByName('human-players', mainForm)[0].element.value)
  let robots = parseInt(jsonDom.getChildrenByName('robot-players', mainForm)[0].element.value)
  if (humans < 0 || humans > 100 || robots < 0 || robots > 100) {
    return false
  }
  const firstGoesFirst = jsonDom.getChildrenByName('first-go-first', mainForm)[0].element.checked
  humans = humans < 0 ? 0 : humans
  if (humans === 0) {
    robots = robots < 2 ? 2 : robots
  }
  if (humans === 1) {
    robots = robots < 1 ? 1 : robots
  }
  jsonDom.removeChild(jsonDom.getChildrenByClass('main-menu', parent.body)[0], parent.body)
  const players = jDomCoreDom.renderHTML(gameLayout.boards(buildPlayers(humans, robots)), parent).children
  const firstAttacker = gameActions.updatePlayer(firstGoesFirst ? players[0] : players[functionalHelpers.randomInteger(players.length)])
  if (firstAttacker.isRobot) {
    gameActions.computerAttack(firstAttacker, players)
  }
  return false
}

/**
 * The entry function
 * @function main
 * @param parent
 * @returns {module:jDom/core/dom/objects.documentItem}
 */
gameStart.main = (parent) => {
  for (let i = parent.body.children.length - 1; i >= 0; --i) {
    jsonDom.removeChild(parent.body.children[i], parent.body)
  }
  jDomCoreDom.renderHTML(gameLayout.mainMenu(), parent)
  return parent
}

/**
 * @function restart
 * @param e
 * @param button
 */
gameStart.restart = (e, button) => gameStart.main(jsonDom.getTopParentItem(button))
