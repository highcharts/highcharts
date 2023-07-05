const csvData = document.getElementById('csv').innerText;

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'Vitamin',
            type: 'CSV',
            options: {
                csv: csvData,
                firstRowAsNames: true
            }
        }]
    },
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true,
            items: ['editMode']
        }
    },
    gui: {
        layouts: [{
            id: 'layout-1',
            rowClassName: 'custom-row',
            cellClassName: 'custom-cell',
            rows: [{
                cells: [
                    { id: 'dashboard-col-0',  width: '50%' },
                    { id: 'dashboard-col-1' },
                    { id: 'dashboard-col-2' }
                ]
            }]
        }]
    },
    components: [{
        sync: {
            visibility: true
        },
        title: {
            text: 'visibility: true'
        },
        cell: 'dashboard-col-0',
        type: 'Highcharts',
        connector: {
            id: 'Vitamin'
        },
        connectorName: 'Vitamin',
        columnAssignment: {
            Food: 'x',
            'Vitamin A': 'value'
        },
        chartOptions: {
            chart: {
                type: 'pie'
            }
        }
    },
    {
        cell: 'dashboard-col-1',
        sync: {
            visibility: false
        },
        title: {
            text: 'sync visibility: false'
        },
        type: 'Highcharts',
        connector: {
            id: 'Vitamin'
        },
        columnAssignment: {
            Food: 'x',
            'Vitamin A': 'y'
        },
        chartOptions: {
            xAxis: {
                type: 'category'
            },
            chart: {
                type: 'column'
            }
        }
    },
    {
        cell: 'dashboard-col-2',
        sync: {
            visibility: true
        },
        title: {
            text: 'sync visibility: true'
        },
        type: 'Highcharts',
        connector: {
            id: 'Vitamin'
        },
        columnAssignment: {
            Food: 'x',
            'Vitamin A': 'y'
        },
        chartOptions: {
            xAxis: {
                type: 'category'
            },
            chart: {
                type: 'scatter'
            }
        }
    }]
}, true);