const { CSVStore } = Dashboards;

const csvData = document.getElementById('csv').innerText,
    store = new CSVStore(void 0, {
        csv: csvData,
        firstRowAsNames: true
    });

store.load();

Dashboards.board('container', {
    store: store,
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true,
            items: ['editMode']
        }
    },
    gui: {
        enabled: true,
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
            store,
            sync: {
                visibility: true,
                tooltip: true,
                selection: true
            },
            cell: 'dashboard-col-0',
            isResizable: true,
            type: 'Highcharts',
            tableAxisMap: {
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
            store,
            sync: {
                visibility: true,
                tooltip: true,
                selection: true
            },
            type: 'Highcharts',
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
                }
            }
        }, {
            cell: 'dashboard-col-12',
            store,
            sync: {
                visibility: true,
                tooltip: true,
                selection: true
            },
            type: 'Highcharts',
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
                    type: 'scatter'
                }
            }
        }, {
            cell: 'dashboard-col-2',
            type: 'DataGrid',
            store,
            editable: true,
            sync: {
                tooltip: true
            }
        }]
});
