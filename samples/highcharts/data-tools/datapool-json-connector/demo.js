Dashboards.board('container', {
    dataPool: {
        connectors: [{
            type: 'JSON',
            id: 'rows',
            options: {
                orientation: 'rows',
                data: [
                    ['a', 'b', 'c'],
                    [1, 2, 3],
                    [2, 3, 4]
                ]
            }
        }, {
            type: 'JSON',
            id: 'columns',
            options: {
                orientation: 'columns', // default
                data: [
                    ['a', 1, 2],
                    ['b', 2, 3],
                    ['c', 3, 4],
                    ['d', 4, 5],
                    ['e', 5, 6]
                ]
            }
        }]

    },
    components: [{
        cell: 'dg-rows',
        type: 'DataGrid',
        connector: {
            id: 'rows'
        }
    }, {
        cell: 'dg-columns',
        type: 'DataGrid',
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
