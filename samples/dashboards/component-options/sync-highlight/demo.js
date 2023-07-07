const csvData = document.getElementById('csv').innerText;

const chartOptions = {
    xAxis: {
        type: 'category'
    },
    chart: {
        animation: false,
        type: 'column'
    }
};

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
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }, {
                    id: 'dashboard-col-2'
                }]
            }]
        }]
    },
    components: [
        {
            cell: 'dashboard-col-0',
            connector: {
                id: 'Vitamin'
            },
            type: 'Highcharts',
            sync: {
                highlight: true
            },
            columnAssignment: {
                Food: 'x',
                'Vitamin A': 'y'
            },
            title: {
                text: 'sync highlight: true'
            },
            chartOptions
        }, {
            cell: 'dashboard-col-1',
            connector: {
                id: 'Vitamin'
            },
            type: 'Highcharts',
            sync: {
                highlight: false
            },
            columnAssignment: {
                Food: 'x',
                'Vitamin A': 'y'
            },
            title: {
                text: 'sync highlight: false'
            },
            allowConnectorUpdate: false,
            chartOptions
        }, {
            title: {
                text: 'sync highlight: true'
            },
            cell: 'dashboard-col-2',
            type: 'DataGrid',
            connector: {
                id: 'Vitamin'
            },
            editable: true,
            sync: {
                highlight: true
            }
        }
    ]
}, true);
