Dashboards.board('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true
        }
    },
    dataPool: {
        connectors: [{
            type: 'CSV',
            id: 'fetched-data',
            enablePolling: true,
            dataRefreshRate: 1,
            csvURL: 'https://demo-live-data.highcharts.com/time-data.csv'
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
                    y: 'Value'
                }
            }]
        }
    }]
});
