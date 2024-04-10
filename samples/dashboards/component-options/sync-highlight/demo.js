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
            renderTo: 'dashboard-col-0',
            connector: {
                id: 'Vitamin'
            },
            type: 'Highcharts',
            sync: {
                highlight: true
            },
            title: {
                text: 'sync highlight: true'
            },
            chartOptions
        }, {
            renderTo: 'dashboard-col-1',
            connector: {
                id: 'Vitamin'
            },
            type: 'Highcharts',
            sync: {
                highlight: false
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
            renderTo: 'dashboard-col-2',
            type: 'DataGrid',
            connector: {
                id: 'Vitamin'
            },
            sync: {
                highlight: true
            }
        }
    ]
}, true);
