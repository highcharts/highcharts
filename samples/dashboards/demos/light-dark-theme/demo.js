const { CSVConnector } = Dashboards.DataConnector.registry;
const csvData = document.getElementById('csv').innerText;

const connector = new CSVConnector(void 0, {
    csv: csvData,
    firstRowAsNames: true
});

connector.load();


// Necessary to enable styled mode in order to properly style the
// chart depending on the theme.
Highcharts.setOptions({
    chart: {
        styledMode: true
    }
});


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
            connector,
            editable: true,
            sync: {
                highlight: true
            }
        }
    ]
});
