Dashboards.board('container', {
    dataPool: {
        connectors: [{
            type: 'JSON',
            id: 'fetched-data',
            firstRowAsNames: false,
            dataRefreshRate: 2,
            enablePolling: true,
            columnIds: ['time', 'value', 'rounded'],
            dataUrl: 'https://demo-live-data.highcharts.com/time-rows.json',
            beforeParse: function (data) {
                data.map(el => el.push(Math.round(el[1])));

                return data;
            }
        }]
    },
    components: [{
        renderTo: 'chart',
        type: 'Highcharts',
        connector: {
            id: 'fetched-data'
        }
    }, {
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
                    id: 'chart'
                }, {
                    id: 'fetched-columns'
                }]
            }]
        }]
    }
}, true);
