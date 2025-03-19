Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'conn-id',
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                columnNames: ['Col-A', 'Col-B', 'Col-C'],
                data: [
                    ['Row-1', 1349, 5],
                    ['Row-2', 1960, 4],
                    ['Row-3', 2024, 3],
                    ['Row-4', 1914, 9],
                    ['Row-5', 1223, 6],
                    ['Row-6', 2011, 12],
                    ['Row-7', 1300, 7],
                    ['Row-8', 800, 9],
                    ['Row-9', 800, 10],
                    ['Row-A', 1800, 11],
                    ['Row-B', 2000, 9],
                    ['Row-C', 2009, 3]
                ],
                dataModifier: {
                    type: 'Range',
                    ranges: [{
                        column: 'Col-B',
                        minValue: 500,
                        maxValue: 2010
                    }]
                }
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
            id: 'conn-id',
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
            id: 'conn-id'
        },
        sync: {
            highlight: {
                enabled: true,
                autoScroll: true
            }
        }
    }, {
        // Mirror of the editable datagrid
        type: 'DataGrid',
        renderTo: 'dashboard-col-2',
        connector: {
            id: 'conn-id'
        },
        sync: {
            highlight: {
                enabled: true,
                autoScroll: true
            }
        }
    }]
});
