const csvData = document.getElementById('csv').innerText;

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            type: 'CSV',
            id: 'data',
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
                    id: 'dashboard-col-1'
                }]
            }]
        }]
    },
    components: [{
        cell: 'dashboard-col-1',
        connector: {
            id: 'data'
        },
        type: 'DataGrid',
        dataGridOptions: {
            columns: {
                'Vitamin A': {
                    headerFormat: '{text} mg'
                }
            }
        }
    }]
});
