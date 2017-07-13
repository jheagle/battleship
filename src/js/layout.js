// Custom layout objects leveraging the DOMItem object
/**
 * This will be the main menu for the game.
 */
const mainMenu = () => DOMItem({
    attributes: {
        class: 'main-menu'
    },
    children: [
        DOMItem({
            attributes: {
                class: 'content'
            },
            children: [
                DOMItem({
                    attributes: {
                        element: 'form',
                        class: 'main-menu-form',
                    },
                    children: [
                        DOMItem({
                            attributes: {
                                class: 'form-group'
                            },
                            children: [
                                DOMItem({
                                    attributes: {
                                        element: 'label',
                                        for: 'human-players'
                                    },
                                    elementProperties: {
                                        innerText: 'Humans'
                                    }
                                }),
                                DOMItem({
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
                                })
                            ]
                        }),
                        DOMItem({
                            attributes: {
                                class: 'form-group'
                            },
                            children: [
                                DOMItem({
                                    attributes: {
                                        element: 'label',
                                        for: 'robot-players'
                                    },
                                    elementProperties: {
                                        innerText: 'Robots'
                                    }
                                }),
                                DOMItem({
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
                                })
                            ]
                        }),
                        DOMItem({
                            attributes: {
                                element: 'label',
                                for: 'first-go-first'
                            },
                            elementProperties: {
                                innerText: 'First Player Starts'
                            }
                        }),
                        DOMItem({
                            attributes: {
                                element: 'input',
                                id: 'first-go-first',
                                name: 'first-go-first',
                                type: 'checkbox',
                            }
                        }),
                        DOMItem({
                            attributes: {
                                element: 'input',
                                type: 'submit',
                                value: 'Start'
                            }
                        })
                    ]
                })
            ]
        })
    ]
})

/**
 * Wrapper div for player data / boards
 */
const boards = () => DOMItem({
    attributes: {
        class: 'boards'
    },
})

const finalScore = (players) => DOMItem({
    attributes: {
        class: 'final-scores'
    },
    children: [
        DOMItem({
            attributes: {
                class: 'score-cards'
            },
            children: players.map(player => DOMItem({
                attributes: {
                    class: 'score-card'
                },
                elementProperties: {
                    innerHTML: `<strong>Status:</strong> ${player.status}%, <strong>Sunk:</strong> ${player.attacks.sunk}<br><strong>Hit:</strong> ${player.attacks.hit} / <strong>Miss:</strong> ${player.attacks.miss}<br><strong>Turns:</strong> ${player.turnCnt}`
                }
            }))
        }),
        DOMItem({
            attributes: {
                element: 'input',
                type: 'button',
                value: 'Restart'
            },
            eventListeners: {
                click: restart
            }
        })
    ]
})
