Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'micro-element',
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                columnNames: ['Col-0', 'Col-1', 'Col-2'],
                data: [
                    ['Row-0', 1349, 5],
                    ['Row-1', 1960, 4],
                    ['Row-2', 2024, 3],
                    ['Row-3', 1918, 2],
                    ['Row-4', 1792, 1]
                ],
                dataModifier: {
                    type: 'Range',
                    additive: true,
                    ranges: [{
                        column: 'Col-1',
                        minValue: 0,
                        maxValue: 2010
                    }]
                }
                /*
                dataModifier: {
                    type: 'Sort',
                    direction: 'asc',
                    orderByColumn: 'Col-1'
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
