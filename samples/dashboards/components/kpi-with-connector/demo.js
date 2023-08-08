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
        connector: {
            id: 'value'
        }
    }, {
        cell: 'chart',
        type: 'Highcharts',
        chartOptions: {
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
        type: 'DataGrid',
        cell: 'datagrid',
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
            }, {
                cells: [{
                    id: 'datagrid'
                }]
            }]
        }]
    }
});
