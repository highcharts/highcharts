const dashboard = new Dashboards.Dashboard('container', {
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'cell-id'
                }, {
                    id: 'cell-id-2'
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
    }, {
        type: 'Highcharts',
        cell: 'cell-id-2',
        chartOptions: {
            series: [{
                type: 'pie',
                data: [1, 2, 3, 2, 3]
            }]
        }
    }]
});