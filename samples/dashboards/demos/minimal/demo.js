const CSVConnector = Dashboards.DataConnector.types.CSV;

const csvData = document.getElementById('csv').innerText,
    connector = new CSVConnector({
        csv: csvData,
        firstRowAsNames: true
    });

connector.load();

Dashboards.board('container', {
    connector,
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
                cells: [{
                    id: 'dashboard-col-0',
                    width: '50%'
                }, {
                    id: 'dashboard-col-1'
                }, {
                    id: 'dashboard-col-12'
                }]
            }, {
                id: 'dashboard-row-1',
                cells: [{
                    id: 'dashboard-col-2',
                    width: '1'
                }]
            }]
        }]
    },
    components: [
        {
            connector,
            sync: {
                visibility: true,
                highlight: true,
                selection: true
            },
            cell: 'dashboard-col-0',
            type: 'Highcharts',
            columnKeyMap: {
                Food: 'x',
                'Vitamin A': 'value'
            },
            chartOptions: {
                chart: {
                    type: 'pie'
                }
            }
        }, {
            cell: 'dashboard-col-1',
            connector,
            sync: {
                visibility: true,
                highlight: true,
                selection: true
            },
            type: 'Highcharts',
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
                }
            }
        }, {
            cell: 'dashboard-col-12',
            connector,
            sync: {
                visibility: true,
                highlight: true,
                selection: true
            },
            type: 'Highcharts',
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
                    type: 'scatter'
                }
            }
        }, {
            cell: 'dashboard-col-2',
            type: 'DataGrid',
            connector,
            editable: true,
            sync: {
                highlight: true
            }
        }]
});
