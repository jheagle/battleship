/**
 * The defined attributes for each player
 * @function playerStats
 * @param {Object} [player={}]
 * @param {Object} [status=]
 * @returns {Object}
 */
const playerStats = (player = {}, status = '') => ({
  nodeName: 'div',
  attributes: {},
  children: [
    {
      nodeName: 'span',
      attributes: {
        innerHTML: `<strong>${player.name}</strong>: ${status}`
      }
    },
    {
      nodeName: 'ul',
      attributes: {},
      children: player.shipFleet.map(ship => ({
        nodeName: 'li',
        attributes: {
          innerHTML: `<strong>${ship.name} (${ship.parts.length}):</strong> ${Math.round(ship.status * 100) / 100}%`
        }
      }))
    }
  ]
})

export default playerStats
