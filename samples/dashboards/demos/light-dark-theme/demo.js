const { CSVStore } = Dashboards;
const csvData = document.getElementById('csv').innerText;

const store = new CSVStore(void 0, {
    csv: csvData,
    firstRowAsNames: true
});

store.load();


// Necessary to enable styled mode in order to properly style the
// chart depending on the theme.
Highcharts.setOptions({
    chart: {
        styledMode: true
    }
});


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
            chartOptions: {
                xAxis: {
                    type: 'category'
                },
                chart: {
                    animation: false,
                    type: 'column'
                },
                plotOptions: {
                    series: {
                        dragDrop: {
                            draggableY: true,
                            dragPrecisionY: 1
                        }
                    }
                }
            }
        }, {
            cell: 'dashboard-col-1',
            type: 'DataGrid',
            store,
            editable: true,
            sync: {
                tooltip: true
            }
        }
    ]
});
