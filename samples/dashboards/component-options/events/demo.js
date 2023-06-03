const CSVConnector = Dashboards.DataConnector.types.CSV;
const csvData = document.getElementById('csv').innerText;

const connector = new CSVConnector({
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

const dashboards = Dashboards.board('container', {
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
                text: 'highlight: true'
            },
            chartOptions
        }, {
            cell: 'dashboard-col-1',
            connector,
            type: 'Highcharts',
            sync: {
                highlight: false
            },
            columnKeyMap: {
                Food: 'x',
                'Vitamin A': 'y'
            },
            title: {
                text: 'highlight: false'
            },
            allowConnectorUpdate: false,
            chartOptions
        }, {
            title: {
                text: 'highlight: true'
            },
            events: {
                mount: function () {
                    console.log('mount');
                },
                unmount: function () {
                    console.log('unmount');
                }


            },
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

setTimeout(() => {
    dashboards.mountedComponents[2].cell.destroy();
}, 3000);