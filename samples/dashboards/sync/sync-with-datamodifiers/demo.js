Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'micro-element',
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                columnNames: ['Col-A', 'Col-B', 'Col-C'],
                data: [
                    ['Row-1', 1349, 5],
                    ['Row-2', 1960, 4],
                    ['Row-3', 2024, 3],
                    ['Row-4', 1914, 9],
                    ['Row-5', 1789, 6]
                ],
                dataTable: {
                    rowKeysId: 'rkey'
                },
                dataModifier: {
                    type: 'Range',
                    additive: true,
                    ranges: [{
                        column: 'Col-B',
                        minValue: 0,
                        maxValue: 2010
                    }]
                }
                /*
                dataModifier: {
                    type: 'Sort',
                    direction: 'asc',
                    orderByColumn: 'Col-B'
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
                }, {
                    id: 'dashboard-col-2'
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
                seriesId: 'Col-C',
                data: ['Col-A', 'Col-C']
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
    }, {
        // Mirror of editable datagrid
        type: 'DataGrid',
        renderTo: 'dashboard-col-2',
        connector: {
            id: 'micro-element'
        },
        sync: {
            highlight: true
        },
        dataGridOptions: {
            editable: false
        }
    }]
});
