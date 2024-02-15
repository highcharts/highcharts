Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'data',
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                columnNames: ['x', 'myLow', 'myHigh', 'mySeries'],
                data: [
                    [1699434920314, 6, 5, 4, 1, 6, 9],
                    [1699494920314, 2, 6, 2, 5, 7, 9],
                    [1699534920314, 1, 9, 5, 3, 8, 8]
                ]
            }
        }]
    },
    gui: {
        layouts: [{
            id: 'layout-1',
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
        renderTo: 'dashboard-col-0',
        type: 'Highcharts',
        connector: {
            id: 'data'
        },
        columnAssignment: {
            x: 'x',
            mySeries: 'value'
        },
        chartOptions: {
            title: {
                text: 'Example chart'
            }
        }
    }, {
        renderTo: 'dashboard-col-1',
        type: 'Highcharts',
        connector: {
            id: 'data'
        },
        columnAssignment: {
            x: 'x',
            mySeries: 'value',
            mySeriesName: {
                high: 'myHigh',
                low: 'myLow'
            }
        },
        chartOptions: {
            title: {
                text: 'Example chart'
            },
            series: [{
                name: 'mySeriesName',
                type: 'columnrange'
            }, {
                name: 'mySeries',
                type: 'line'
            }]
        }
    }]
});