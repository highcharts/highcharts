Dashboards.board('container', {
    editMode: {
        enabled: true
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    layout: {
                        rows: [{
                            id: 'row',
                            cells: [{
                                id: 'cell-1'
                            }, {
                                id: 'cell-2'
                            }]
                        }]
                    }
                }]
            }]
        }]
    },
    components: [{
        renderTo: 'cell-1',
        type: 'HTML',
        elements: [{
            tagName: 'h1',
            textContent: 'cell-1'
        }]

    }, {
        renderTo: 'cell-2',
        type: 'HTML',
        elements: [{
            tagName: 'h1',
            textContent: 'cell-2'
        }]
    }]
}, true).then(board => board.editMode.activate());
