Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'data',
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                columnNames: ['time', 'open', 'high', 'low', 'close'],
                dataUrl: 'https://www.highcharts.com/samples/data/new-intraday.json'
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
        type: 'DataGrid',
        connector: {
            id: 'data'
        },
        dataGridOptions: {
            columnDefaults: {
                cells: {
                    editable: true
                }
            },
            columns: [{
                id: 'time',
                cells: {
                    editable: false
                }
            }]
        }
    }]
});
