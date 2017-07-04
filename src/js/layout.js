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
                        class: 'form-group'
                    },
                    children: [
                        DOMItem({
                            attributes: {
                                element: 'input',
                                type: 'button',
                                value: 'Vs Computer'
                            }
                        }),
                        DOMItem({
                            attributes: {
                                element: 'input',
                                type: 'button',
                                value: 'Vs Human'
                            }
                        })
                    ]
                })
            ]
        })
    ]
})
