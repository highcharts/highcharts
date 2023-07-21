Dashboards.board('container', {
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
    components: [{
        cell: 'dashboard-col-0',
        type: 'Highcharts',
        chartOptions: {
            legend: {
                align: 'right',
                verticalAlign: 'top',
                layout: 'vertical',
                x: 0,
                y: 100
            },
            series: [{
                data: [1, 2, 3, 4]
            }]
        }
    }, {
        cell: 'dashboard-col-1',
        type: 'Highcharts',
        chartOptions: {
            chart: {
                type: 'column'
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                layout: 'vertical',
                x: 0,
                y: 100
            },
            series: [{
                data: [1, 2, 3, 4]
            }]
        }
    }]
});
