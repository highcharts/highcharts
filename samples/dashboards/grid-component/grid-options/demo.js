const csvData = document.getElementById('csv').innerText;

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            type: 'CSV',
            id: 'data',
            csv: csvData,
            firstRowAsNames: true
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
        renderTo: 'dashboard-col-1',
        connector: {
            id: 'data'
        },
        type: 'Grid',
        gridOptions: {
            credits: {
                enabled: false
            },
            columns: [{
                id: 'Vitamin A',
                headerFormat: '{id} [mg]'
            }],
            rendering: {
                rows: {
                    minVisibleRows: 5
                }
            }
        }
    }]
});
