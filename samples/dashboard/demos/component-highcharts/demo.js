const dashboard = new Dashboard.Dashboard('container', {
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'cell-id'
                }]
            }]
        }]
    },
    components: [{
        type: 'Highcharts',
        cell: 'cell-id',
        chartOptions: {
            series: [{
                data: [1, 2, 3, 2, 3]
            }]
        }
    }]
});