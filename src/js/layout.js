// Custom layout objects leveraging the DOMItem object
/**
 * This will be the main menu for the game.
 * @param parent
 * @returns {{tagName: string, attributes: {class: string}, children: [*]}}
 */
const mainMenu = (parent = {}) => ({
    tagName: 'div',
    attributes: {
        class: 'main-menu'
    },
    children: [
        {
            tagName: 'div',
            attributes: {
                class: 'content'
            },
            children: [
                {
                    tagName: 'form',
                    attributes: {
                        class: 'main-menu-form',
                    },
                    eventListeners: {
                        submit: {
                            listenerFunc: beginRound,
                            listenerArgs: {parent: parent},
                            listenerOptions: false
                        }
                    },
                    children: [
                        {
                            tagName: 'div',
                            attributes: {
                                class: 'form-group'
                            },
                            children: [
                                {
                                    tagName: 'label',
                                    attributes: {
                                        for: 'human-players',
                                        innerText: 'Humans'
                                    },
                                },
                                {
                                    tagName: 'input',
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
                            tagName: 'div',
                            attributes: {
                                class: 'form-group'
                            },
                            children: [
                                {
                                    tagName: 'label',
                                    attributes: {
                                        for: 'robot-players',
                                        innerText: 'Robots'
                                    },
                                },
                                {
                                    tagName: 'input',
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
                            tagName: 'label',
                            attributes: {
                                for: 'first-go-first',
                                innerText: 'First Player Starts'
                            },
                        },
                        {
                            tagName: 'input',
                            attributes: {
                                id: 'first-go-first',
                                name: 'first-go-first',
                                type: 'checkbox',
                            }
                        },
                        {
                            tagName: 'input',
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

/**
 * Wrapper div for player data / boards
 * @returns {{tagName: string, attributes: {class: string}}}
 */
const boards = (players = []) => ({
    tagName: 'div',
    attributes: {
        class: 'boards'
    },
    children: players
})

/**
 *
 * @param players
 * @param parent
 * @returns {{tagName: string, attributes: {class: string}, children: [*,*]}}
 */
const finalScore = (players, parent = {}) => ({
    tagName: 'div',
    attributes: {
        class: 'final-scores'
    },
    children: [
        {
            tagName: 'div',
            attributes: {
                class: 'score-cards'
            },
            children: players.map(player => ({
                tagName: 'div',
                attributes: {
                    class: 'score-card',
                    innerHTML: `<strong>${player.name}</strong><hr><br></strong><strong>Status:</strong> ${Math.round(player.status * 100) / 100}%, <strong>Sunk:</strong> ${player.attacks.sunk}<br><strong>Hit:</strong> ${player.attacks.hit} / <strong>Miss:</strong> ${player.attacks.miss}<br><strong>Turns:</strong> ${player.turnCnt}`
                },
            }))
        },
        {
            tagName: 'input',
            attributes: {
                type: 'button',
                value: 'Restart'
            },
            eventListeners: {
                click: {listenerFunc: restart, listenerArgs: {parent: parent}, listenerOptions: false}
            }
        }
    ]
})
