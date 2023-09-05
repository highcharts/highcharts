Dashboards.board('container', {
    dataPool: {
        connectors: [{
            type: 'JSON',
            id: 'fetched-data',
            options: {
                firstRowAsNames: false,
                columnNames: ['time', 'open', 'high', 'low', 'close', 'volume'],
                dataUrl: 'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
            }
        }]

    },
    components: [{
        cell: 'fetched-columns',
        type: 'DataGrid',
        connector: {
            id: 'fetched-data'
        }
    }],
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'fetched-columns'
                }]
            }]
        }]
    }
});
