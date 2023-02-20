const { CSVStore } = Dashboards;
const csvData = document.getElementById('csv').innerText;

const store = new CSVStore(void 0, {
    csv: csvData,
    firstRowAsNames: true
});
store.load();

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
    store: store,
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
            store,
            type: 'Highcharts',
            sync: {
                tooltip: true
            },
            tableAxisMap: {
                Food: 'x',
                'Vitamin A': 'y'
            },
            title: {
                text: 'allowStoreUpdate: true',
                style: {
                    textAlign: 'center'
                }
            },
            chartOptions
        }, {
            cell: 'dashboard-col-1',
            store,
            type: 'Highcharts',
            sync: {
                tooltip: true
            },
            tableAxisMap: {
                Food: 'x',
                'Vitamin A': 'y'
            },
            title: {
                text: 'allowStoreUpdate: false',
                style: {
                    textAlign: 'center'
                }
            },
            allowStoreUpdate: false,
            chartOptions
        }, {
            cell: 'dashboard-col-2',
            type: 'DataGrid',
            store,
            editable: true,
            sync: {
                tooltip: true
            }
        }
    ]
});
