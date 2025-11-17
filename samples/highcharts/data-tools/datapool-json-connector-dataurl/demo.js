Dashboards.board('container', {
    dataPool: {
        connectors: [{
            type: 'JSON',
            id: 'fetched-data',
            firstRowAsNames: false,
            columnIds: ['time', 'open', 'high', 'low', 'close', 'volume'],
            dataUrl: 'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
        }]

    },
    components: [{
        renderTo: 'fetched-columns',
        type: 'Grid',
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
