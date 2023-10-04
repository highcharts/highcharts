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
        cell: 'kpi-2',
        type: 'KPI',
        title: 'Mixed values',
        columnName: 'Value',
        sync: {
            extremes: true
        },
        connector: {
            id: 'value'
        },
        value: 'OTHER_VALUE'
    }, {
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
    }, {
        cell: 'kpi-2'
    }],
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'kpi'
                }, {
                    id: 'kpi-2'
                }]
            }, {
                cells: [{
                    id: 'chart'
                }]
            }]
        }]
    }
});
