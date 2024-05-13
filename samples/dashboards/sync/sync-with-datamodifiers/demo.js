Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'micro-element',
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                columnNames: ['Col-0', 'Col-1', 'Col-2'],
                data: [
                    ['Row-1', 6421, 9.9],
                    ['Row-2', 2122, 8.5],
                    ['Row-3', 1350, 6.9],
                    ['Row-4', 388, 3.9],
                    ['Row-5', 214, 1.6]
                ],
                dataModifier: {
                    type: 'Range',
                    additive: true,
                    ranges: [{
                        column: 'Col-1',
                        minValue: 0,
                        maxValue: 5000
                    }]
                }/*
                dataModifier: {
                    type: 'Sort',
                    direction: 'asc',
                    orderByColumn: 'Iron',
                    orderInColumn: 'Test'
                }
                */
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }]
            }]
        }]
    },
    components: [{
        type: 'Highcharts',
        renderTo: 'dashboard-col-0',
        connector: {
            id: 'micro-element',
            columnAssignment: [{
                seriesId: 'Col-2',
                data: ['Col-0', 'Col-2']
            }]
        },
        sync: {
            highlight: true
        }
    }, {
        type: 'DataGrid',
        renderTo: 'dashboard-col-1',
        connector: {
            id: 'micro-element'
        },
        sync: {
            highlight: true
        },
        dataGridOptions: {
            editable: true
        }
    }]
});
