import jsonDom from 'json-dom'
import startMenu from '../../src/setup/startMenu'
import beginRound from '../../src/setup/beginRound'
import restart from '../../src/setup/restart'
import attackListener from '../../src/attack/attackListener'
import attackLock from '../../src/attack/attackLock'
import waterTile from '../../src/components/pieces/waterTile'
import jDomMatrix from 'matrix-dom'

/**
 * Let the game's timed queue (turn changes, board resizing, robot attacks) run. Needs jest.useFakeTimers().
 * @param {number} [ms=5000] How much game time to let pass
 * @returns {Promise<void>}
 */
export const settle = (ms = 5000) => jest.advanceTimersByTimeAsync(ms)

/**
 * Start a game the way a player does: render the menu, fill the form in and press submit.
 * @param {Object} [options]
 * @param {number} [options.humans=0]
 * @param {number} [options.robots=0]
 * @param {boolean} [options.firstGoesFirst=true] Player 1 attacks first instead of a random player
 * @returns {{doc: Object, players: Array}}
 */
export const startGame = ({ humans = 0, robots = 0, firstGoesFirst = true } = {}) => {
  const doc = startMenu(jsonDom.documentDomItem({
    beginRound,
    attackListener,
    restart
  }))
  const form = jsonDom.getChildrenByClass('main-menu-form', doc.body)[0]
  jsonDom.getChildrenByName('human-players', form)[0].element.value = String(humans)
  jsonDom.getChildrenByName('robot-players', form)[0].element.value = String(robots)
  jsonDom.getChildrenByName('first-go-first', form)[0].element.checked = firstGoesFirst
  jsonDom.getChildrenFromAttribute('type', 'submit', form)[0].element.click()
  return { doc, players: getPlayers(doc) }
}

export const getPlayers = doc => (jsonDom.getChildrenByClass('boards', doc.body)[0] || { children: [] }).children

/** Every cell of a player's board, as an array of rows of cells. */
export const rows = player => player.board.children[0].children.map(row => row.children)
export const cells = player => rows(player).flat()
export const shipCells = player => cells(player).filter(cell => cell.hasShip)
export const waterCells = player => cells(player).filter(cell => !cell.hasShip)
export const unhitWaterCells = player => waterCells(player).filter(cell => !cell.isHit)
export const unhitShipCells = player => shipCells(player).filter(cell => !cell.isHit)
export const attacker = players => players.find(player => player.attacker)
export const victims = players => players.filter(player => !player.attacker)

/** Click a cell like a player would and let the turn change finish. */
export const click = async (cell, ms = 1000) => {
  cell.element.click()
  await settle(ms)
}

/** A bare 10 x 10 board of water tiles, with the point data filled in. */
export const makeBoard = () => jDomMatrix.updateMatrixPoints(jDomMatrix.square({ x: waterTile() }, 10))

/** All the cells the players' boards have been hit on. */
export const hitCells = player => cells(player).filter(cell => cell.isHit)

/** Keep letting game time pass until the final scores are on screen (or the limit runs out). */
export const playToTheEnd = async (limit = 600) => {
  for (let i = 0; i < limit && !document.querySelector('.final-scores'); i++) {
    await settle(1000)
  }
  return Boolean(document.querySelector('.final-scores'))
}

/**
 * The game keeps its timed queue and the attack lock in module state, so every test has to start with the lock off,
 * and end by letting everything queued finish - otherwise a test which stops mid-turn leaves the next one stuck.
 * Call once at the top of a test file.
 */
export const useGameLifecycle = () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.spyOn(console, 'log').mockImplementation(() => {})
    attackLock.isLocked = false
  })
  afterEach(async () => {
    await settle(60000)
    jest.useRealTimers()
    jest.restoreAllMocks()
  })
}

/** Start a game for two humans (player 1 attacks first) and let it settle. */
export const twoHumans = async () => {
  const game = startGame({ humans: 2 })
  await settle()
  return game
}

/** The other player in a two player game. */
export const other = (players, player) => players.find(p => p !== player)
