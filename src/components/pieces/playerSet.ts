/**
 * Store the player attributes.
 * @function playerSet
 * @param {Object} board
 * @param {string} name
 * @returns {Object}
 */
const playerSet = (board = {}, name = '') => ({
  name,
  isRobot: false,
  status: 100,
  turnCnt: 0,
  attacker: false,
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
})

export default playerSet
