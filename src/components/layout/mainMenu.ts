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
            { nodeName: 'button', attributes: { className: 'preset-robots', type: 'button', innerHTML: 'Robots only' }, eventListeners: { click: listener('presetListener') } },
            { nodeName: 'button', attributes: { className: 'preset-remote', type: 'button', innerHTML: 'Online Multiplayer' }, eventListeners: { click: listener('remoteListener') } }
          ]
        },
        {
          nodeName: 'div',
          attributes: {
            className: 'remote-entry',
            style: { display: 'none' }
          },
          children: [
            { nodeName: 'button', attributes: { className: 'remote-back', type: 'button', innerHTML: 'Back' }, eventListeners: { click: listener('remoteListener') } },
            { nodeName: 'h2', attributes: { className: 'lobby-title', innerHTML: 'Online Multiplayer' } },
            {
              nodeName: 'div',
              attributes: { className: 'form-group' },
              children: [
                { nodeName: 'label', attributes: { for: 'remote-name', innerText: 'Your Name' } },
                { nodeName: 'input', attributes: { id: 'remote-name', name: 'remote-name', type: 'text', required: '' } }
              ]
            },
            {
              nodeName: 'div',
              attributes: { className: 'form-group' },
              children: [
                { nodeName: 'button', attributes: { className: 'remote-host', type: 'button', innerHTML: 'Host a Game' }, eventListeners: { click: listener('remoteListener') } }
              ]
            },
            {
              nodeName: 'div',
              attributes: { className: 'form-group' },
              children: [
                { nodeName: 'label', attributes: { for: 'remote-code', innerText: 'Room Code' } },
                { nodeName: 'input', attributes: { id: 'remote-code', name: 'remote-code', type: 'text', maxlength: 4 } },
                { nodeName: 'button', attributes: { className: 'remote-join', type: 'button', innerHTML: 'Join a Game' }, eventListeners: { click: listener('remoteListener') } }
              ]
            },
            { nodeName: 'div', attributes: { className: 'remote-status' } }
          ]
        },
        {
          nodeName: 'div',
          attributes: {
            className: 'waiting-room',
            style: { display: 'none' }
          },
          children: [
            { nodeName: 'h2', attributes: { className: 'lobby-title', innerHTML: 'Waiting Room' } },
            { nodeName: 'div', attributes: { className: 'waiting-room-code' } },
            { nodeName: 'ul', attributes: { className: 'waiting-room-players' } },
            {
              nodeName: 'div',
              attributes: { className: 'waiting-room-host-controls', style: { display: 'none' } },
              children: [
                {
                  nodeName: 'div',
                  attributes: { className: 'form-group' },
                  children: [
                    { nodeName: 'label', attributes: { for: 'waiting-room-hints', innerText: 'Heat-map hints' } },
                    {
                      nodeName: 'select',
                      attributes: { id: 'waiting-room-hints', name: 'waiting-room-hints' },
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
                  attributes: { className: 'first-group' },
                  children: [
                    { nodeName: 'label', attributes: { for: 'waiting-room-first', innerText: 'First Player Starts' } },
                    { nodeName: 'input', attributes: { id: 'waiting-room-first', name: 'waiting-room-first', type: 'checkbox', checked: true } }
                  ]
                },
                { nodeName: 'button', attributes: { className: 'waiting-room-start', type: 'button', innerHTML: 'Start Game' }, eventListeners: { click: listener('remoteListener') } }
              ]
            },
            { nodeName: 'div', attributes: { className: 'waiting-room-status' } },
            { nodeName: 'button', attributes: { className: 'waiting-room-leave', type: 'button', innerHTML: 'Leave' }, eventListeners: { click: listener('remoteListener') } }
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
                className: 'lobby-title',
                innerHTML: 'Lobby'
              }
            },
            {
              nodeName: 'div',
              attributes: {
                className: 'human-group'
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
                className: 'first-group'
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
