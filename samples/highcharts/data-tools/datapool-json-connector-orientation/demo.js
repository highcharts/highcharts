Dashboards.board('container', {
    dataPool: {
        connectors: [{
            type: 'JSON',
            id: 'rows',
            // orientation: 'rows', Default value
            data: [
                ['a', 'b', 'c'],
                [1, 2, 3],
                [2, 3, 4],
                [3, 4, 5],
                [4, 5, 6],
                [5, 6, 7],
                [6, 7, 8]
            ]
        }, {
            type: 'JSON',
            id: 'columns',
            orientation: 'columns',
            data: [
                ['a', 1, 2, 5, 6],
                ['b', 2, 3, 5, 6],
                ['c', 3, 4, 5, 6],
                ['d', 4, 5, 5, 6],
                ['e', 5, 6, 5, 6]
            ]
        }]

    },
    components: [{
        renderTo: 'dg-rows',
        type: 'Grid',
        connector: {
            id: 'rows'
        }
    }, {
        renderTo: 'dg-columns',
        type: 'Grid',
        connector: {
            id: 'columns'
        }
    }],
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dg-rows'
                }, {
                    id: 'dg-columns'
                }]
            }]
        }]
    }
});
