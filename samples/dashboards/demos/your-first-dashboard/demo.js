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
        type: 'html',
        cell: 'dashboard-col-0',
        elements: [
            {
                tagName: 'h1',
                style: {
                    height: '400px',
                    'text-align': 'center'
                },
                textContent: 'Your first dashboard'
            }
        ]
    }, {
        cell: 'dashboard-col-1',
        type: 'Highcharts',
        chartOptions: {
            series: [{
                data: [1, 2, 3, 4]
            }]
        }
    }]
});
