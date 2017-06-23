const DOMItem = (...attributes) => mergeObjects({
    attributes: {
        element: 'div',
        styles: {}
    },
    element: {},
    children: []
}, ...attributes);

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
                                value: 'Start'
                            }
                        }),
                        DOMItem({
                            attributes: {
                                element: 'input',
                                type: 'button',
                                value: 'Quit'
                            }
                        })
                    ]
                })
            ]
        })
    ]
});
