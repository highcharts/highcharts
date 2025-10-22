Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'value',
            type: 'CSV',
            csv: document.getElementById('csv').innerText
        }]
    },
    components: [{
        renderTo: 'kpi-2',
        type: 'KPI',
        title: 'Mixed values',
        columnId: 'Value',
        sync: {
            extremes: true
        },
        connector: {
            id: 'value'
        },
        value: 'OTHER_VALUE'
    }, {
        renderTo: 'kpi',
        type: 'KPI',
        title: 'Last day\'s value',
        columnId: 'Value',
        sync: {
            extremes: true
        },
        connector: {
            id: 'value'
        }
    }, {
        renderTo: 'chart',
        type: 'Highcharts',
        sync: {
            extremes: true
        },
        chartOptions: {
            chart: {
                zooming: {
                    enabled: true,
                    type: 'x'
                },
                animation: false
            },
            xAxis: {
                type: 'datetime'
            },
            plotOptions: {
                series: {
                    animation: false
                }
            }
        },
        connector: {
            id: 'value',
            columnAssignment: [{
                seriesId: 'Values',
                data: ['Date', 'Value']
            }]
        }
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
