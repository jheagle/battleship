import jsonDom from 'json-dom'

/**
 * This will be the main menu for the game.
 * @function mainMenu
 * @returns {module:jDom/core/dom/objects.DomItem}
 */
const mainMenu = () => jsonDom.createDomItem({
  nodeName: 'div',
  attributes: {
    className: 'main-menu'
  },
  children: [
    {
      nodeName: 'div',
      attributes: {
        className: 'content'
      },
      children: [
        {
          nodeName: 'form',
          attributes: {
            name: 'mainMenuForm',
            className: 'main-menu-form'
          },
          eventListeners: {
            submit: [
              {
                listenerFunc: 'beginRound',
                listenerArgs: {},
                listenerOptions: false
              }
            ]
          },
          children: [
            {
              nodeName: 'div',
              attributes: {
                className: 'form-group'
              },
              children: [
                {
                  nodeName: 'label',
                  attributes: {
                    for: 'human-players',
                    innerText: 'Humans'
                  }
                },
                {
                  nodeName: 'input',
                  attributes: {
                    id: 'human-players',
                    name: 'human-players',
                    type: 'number',
                    value: 0,
                    min: 0,
                    max: 100,
                    required: ''
                  }
                }
              ]
            },
            {
              nodeName: 'div',
              attributes: {
                className: 'form-group'
              },
              children: [
                {
                  nodeName: 'label',
                  attributes: {
                    for: 'robot-players',
                    innerText: 'Robots'
                  }
                },
                {
                  nodeName: 'input',
                  attributes: {
                    id: 'robot-players',
                    name: 'robot-players',
                    type: 'number',
                    value: 0,
                    min: 0,
                    max: 100,
                    required: ''
                  }
                }
              ]
            },
            {
              nodeName: 'label',
              attributes: {
                for: 'first-go-first',
                innerText: 'First Player Starts'
              }
            },
            {
              nodeName: 'input',
              attributes: {
                id: 'first-go-first',
                name: 'first-go-first',
                type: 'checkbox'
              }
            },
            {
              nodeName: 'input',
              attributes: {
                type: 'submit',
                value: 'Start'
              }
            }
          ]
        }
      ]
    }
  ]
})

export default mainMenu
