const { CSVConnector } = Dashboards.DataConnector.registry;
const csvData = document.getElementById('csv').innerText;

const connector = new CSVConnector(void 0, {
    csv: csvData,
    firstRowAsNames: true
});
connector.load();

const chartOptions = {
    xAxis: {
        type: 'category'
    },
    chart: {
        animation: false,
        type: 'column'
    },
    title: {
        text: 'Drag points to update the data grid'
    },
    plotOptions: {
        series: {
            dragDrop: {
                draggableY: true,
                dragPrecisionY: 1
            }
        }
    }
};

Dashboards.board('container', {
    connector,
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
            connector,
            type: 'Highcharts',
            sync: {
                highlight: true
            },
            columnKeyMap: {
                Food: 'x',
                'Vitamin A': 'y'
            },
            title: {
                text: 'allowConnectorUpdate: true',
                style: {
                    textAlign: 'center'
                }
            },
            chartOptions
        }, {
            cell: 'dashboard-col-1',
            connector,
            type: 'Highcharts',
            sync: {
                highlight: true
            },
            columnKeyMap: {
                Food: 'x',
                'Vitamin A': 'y'
            },
            title: {
                text: 'allowConnectorUpdate: false',
                style: {
                    textAlign: 'center'
                }
            },
            allowConnectorUpdate: false,
            chartOptions
        }, {
            cell: 'dashboard-col-2',
            type: 'DataGrid',
            connector,
            editable: true,
            sync: {
                highlight: true
            }
        }
    ]
});
