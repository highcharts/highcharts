Dashboards.board('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true
        }
    },
    dataPool: {
        connectors: [{
            type: 'JSON',
            id: 'fetched-data',
            options: {
                firstRowAsNames: false,
                enablePolling: true,
                dataRefreshRate: 10,
                columnNames: ['time', 'open', 'high', 'low', 'close', 'volume'],
                dataUrl: 'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }]
            }]
        }]
    },
    components: [{
        renderTo: 'dashboard-col-0',
        type: 'Highcharts',
        chartOptions: {
            title: {
                text: 'Connector polling'
            },
            xAxis: {
                type: 'datetime'
            }
        },
        connector: {
            id: 'fetched-data',
            columnAssignment: [{
                seriesId: 'series',
                data: {
                    x: 'time',
                    y: 'high'
                }
            }]
        }
    }]
});
