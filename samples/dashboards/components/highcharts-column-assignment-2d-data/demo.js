Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'data',
            type: 'JSON',
            firstRowAsNames: false,
            columnIds: ['time', 'open', 'high', 'low', 'close'],
            dataUrl: 'https://www.highcharts.com/samples/data/new-intraday.json'
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
        renderTo: 'dashboard-col-0',
        type: 'Highcharts',
        chartConstructor: 'stockChart',
        connector: {
            id: 'data',
            columnAssignment: [{
                seriesId: 'main-series',
                data: ['time', 'open', 'high', 'low', 'close']
            }]
        },
        chartOptions: {
            series: [{
                id: 'main-series',
                name: 'AAPL',
                type: 'candlestick'
            }]
        }
    }, {
        renderTo: 'dashboard-col-1',
        type: 'Grid',
        connector: {
            id: 'data'
        },
        gridOptions: {
            columnDefaults: {
                cells: {
                    editMode: {
                        enabled: true
                    }
                }
            },
            columns: [{
                id: 'time',
                cells: {
                    editMode: {
                        enabled: false
                    },
                    format: '{value:%[ebYHM]}'
                }
            }]
        }
    }]
});
