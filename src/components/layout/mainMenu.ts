import jsonDom from 'json-dom'
import type { DomItem } from 'json-dom/dist/domItem/types'

const listener = (listenerFunc: string) => [{ listenerFunc, listenerArgs: {}, listenerOptions: false }]

/**
 * The entry screen. It shows the game types (presets) first. Choosing one reveals the lobby, which is the form for the
 * game: how many humans and robots, the hint setting, and who goes first. Start in the lobby submits the form, as before.
 */
const mainMenu = (): DomItem => jsonDom.createDomItem({
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
          nodeName: 'div',
          attributes: {
            className: 'presets'
          },
          children: [
            { nodeName: 'button', attributes: { className: 'preset-solo', type: 'button', innerHTML: '1 player vs robots' }, eventListeners: { click: listener('presetListener') } },
            { nodeName: 'button', attributes: { className: 'preset-multi', type: 'button', innerHTML: 'Multiplayer (2 to 4 players, one screen)' }, eventListeners: { click: listener('presetListener') } },
            { nodeName: 'button', attributes: { className: 'preset-robots', type: 'button', innerHTML: 'Robots only' }, eventListeners: { click: listener('presetListener') } }
          ]
        },
        {
          nodeName: 'form',
          attributes: {
            name: 'mainMenuForm',
            className: 'main-menu-form',
            style: { display: 'none' }
          },
          eventListeners: {
            submit: listener('beginRound')
          },
          children: [
            { nodeName: 'button', attributes: { className: 'lobby-back', type: 'button', innerHTML: 'Back' }, eventListeners: { click: listener('presetListener') } },
            {
              nodeName: 'h2',
              attributes: {
                innerHTML: 'Lobby'
              }
            },
            {
              nodeName: 'div',
              attributes: {
                className: 'form-group'
              },
              children: [
                { nodeName: 'label', attributes: { for: 'human-players', innerText: 'Humans' } },
                { nodeName: 'input', attributes: { id: 'human-players', name: 'human-players', type: 'number', value: 0, min: 0, max: 4, required: '' } }
              ]
            },
            {
              nodeName: 'div',
              attributes: {
                className: 'form-group'
              },
              children: [
                { nodeName: 'label', attributes: { for: 'robot-players', innerText: 'Robots' } },
                { nodeName: 'input', attributes: { id: 'robot-players', name: 'robot-players', type: 'number', value: 0, min: 0, max: 4, required: '' } }
              ]
            },
            {
              nodeName: 'div',
              attributes: {
                className: 'form-group'
              },
              children: [
                { nodeName: 'label', attributes: { for: 'hint-setting', innerText: 'Heat-map hints' } },
                {
                  nodeName: 'select',
                  attributes: { id: 'hint-setting', name: 'hint-setting' },
                  children: [
                    { nodeName: 'option', attributes: { value: 'off', innerHTML: 'Off' } },
                    { nodeName: 'option', attributes: { value: 'optional', selected: true, innerHTML: 'Optional (each player chooses)' } },
                    { nodeName: 'option', attributes: { value: 'on', innerHTML: 'On for everyone' } }
                  ]
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
                }
              ]
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
