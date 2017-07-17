// Custom layout objects leveraging the DOMItem object
/**
 * This will be the main menu for the game.
 */
const mainMenu = () => ({
    attributes: {
        element: 'div',
        class: 'main-menu'
    },
    children: [
        {
            attributes: {
                element: 'div',
                class: 'content'
            },
            children: [
                {
                    attributes: {
                        element: 'form',
                        class: 'main-menu-form',
                    },
                    children: [
                        {
                            attributes: {
                                class: 'form-group'
                            },
                            children: [
                                {
                                    attributes: {
                                        element: 'label',
                                        for: 'human-players'
                                    },
                                    elementProperties: {
                                        innerText: 'Humans'
                                    }
                                },
                                {
                                    attributes: {
                                        element: 'input',
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
                            attributes: {
                                element: 'div',
                                class: 'form-group'
                            },
                            children: [
                                {
                                    attributes: {
                                        element: 'label',
                                        for: 'robot-players'
                                    },
                                    elementProperties: {
                                        innerText: 'Robots'
                                    }
                                },
                                {
                                    attributes: {
                                        element: 'input',
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
                            attributes: {
                                element: 'label',
                                for: 'first-go-first'
                            },
                            elementProperties: {
                                innerText: 'First Player Starts'
                            }
                        },
                        {
                            attributes: {
                                element: 'input',
                                id: 'first-go-first',
                                name: 'first-go-first',
                                type: 'checkbox',
                            }
                        },
                        {
                            attributes: {
                                element: 'input',
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
 */
const boards = () => ({
    attributes: {
        element: 'div',
        class: 'boards'
    },
})

const finalScore = (players) => ({
    attributes: {
        element: 'div',
        class: 'final-scores'
    },
    children: [
        {
            attributes: {
                element: 'div',
                class: 'score-cards'
            },
            children: players.map(player => ({
                attributes: {
                    element: 'div',
                    class: 'score-card'
                },
                elementProperties: {
                    innerHTML: `<strong>${player.name}</strong><hr><br></strong><strong>Status:</strong> ${Math.round(player.status * 100) / 100}%, <strong>Sunk:</strong> ${player.attacks.sunk}<br><strong>Hit:</strong> ${player.attacks.hit} / <strong>Miss:</strong> ${player.attacks.miss}<br><strong>Turns:</strong> ${player.turnCnt}`
                }
            }))
        },
        {
            attributes: {
                element: 'input',
                type: 'button',
                value: 'Restart'
            },
            eventListeners: {
                click: restart
            }
        }
    ]
})
