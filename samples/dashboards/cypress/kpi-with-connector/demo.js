Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'value',
            type: 'CSV',
            options: {
                csv: document.getElementById('csv').innerText
            }
        }]
    },
    components: [{
        cell: 'kpi',
        type: 'KPI',
        title: 'Last day\'s value',
        columnName: 'Value',
        sync: {
            extremes: true
        },
        connector: {
            id: 'value'
        }
    }, {
        cell: 'chart',
        type: 'Highcharts',
        sync: {
            extremes: true
        },
        chartOptions: {
            chart: {
                zooming: {
                    enabled: true,
                    type: 'x'
                }
            },
            xAxis: {
                type: 'datetime'
            }
        },
        columnAssignment: {
            Date: 'x',
            Value: 'y'
        },
        connector: {
            id: 'value'
        }
    }],
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'kpi'
                }, {
                    id: 'chart'
                }]
            }]
        }]
    }
});
