import type { Board, Player } from '../../types'

/**
 * Store the player attributes. board and shipFleet start as placeholders (an empty object, an empty array); they are
 * given their real values once the board is built (see buildPlayers).
 * @param board
 * @param name
 */
const playerSet = (board: Board | Record<string, never> = {}, name: string = ''): Player => ({
  has: { 'battleship.player': true },
  name,
  isRobot: false,
  colour: '',
  status: 100,
  turnCnt: 0,
  attacker: false,
  showHint: false,
  attacks: { hit: 0, miss: 0, sunk: 0 },
  board,
  shipFleet: [],
  playerStats: {},
  nodeName: 'div',
  attributes: {
    className: 'player'
  },
  children: [
    board
  ]
}) as unknown as Player

export default playerSet
