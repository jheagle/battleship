import jsonDom from 'json-dom'

/**
 * Display the final scores after a game has ended and have a button to restart.
 * @function finalScore
 * @param {Array} players
 * @returns {module:jDom/core/dom/objects.DomItem}
 */
const finalScore = (players = []) => jsonDom.createDomItem({
  nodeName: 'div',
  attributes: {
    className: 'final-scores'
  },
  children: [
    {
      nodeName: 'div',
      attributes: {
        className: 'score-cards'
      },
      children: players.map(player => ({
        nodeName: 'div',
        attributes: {
          className: 'score-card',
          innerHTML: `<strong>${player.name}</strong><hr><br></strong><strong>Status:</strong> ${Math.round(player.status * 100) / 100}%, <strong>Sunk:</strong> ${player.attacks.sunk}<br><strong>Hit:</strong> ${player.attacks.hit} / <strong>Miss:</strong> ${player.attacks.miss}<br><strong>Turns:</strong> ${player.turnCnt}`
        }
      }))
    },
    {
      nodeName: 'input',
      attributes: {
        type: 'button',
        value: 'Restart'
      },
      eventListeners: {
        click: [
          { listenerFunc: 'restart', listenerArgs: {}, listenerOptions: false }
        ]
      }
    }
  ]
})

export default finalScore
