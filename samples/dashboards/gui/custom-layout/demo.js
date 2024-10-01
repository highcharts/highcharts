Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'data',
            type: 'JSON',
            options: {
                data: [
                    ['Product Name', 'Quantity'],
                    ['Laptop', 100],
                    ['Smartphone', 150]
                ]
            }
        }]
    },
    gui: {
        enabled: false
    },
    components: [{
        renderTo: 'dashboard-col-0',
        type: 'Highcharts',
        connector: {
            id: 'data'
        }
    }, {
        connector: {
            id: 'data'
        },
        type: 'DataGrid',
        renderTo: 'dashboard-col-1'
    }]
});
