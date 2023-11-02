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
            }, {
                cells: [{
                    id: 'dashboard-col-2'
                }, {
                    id: 'dashboard-col-3'
                }]
            }]
        }]
    },
    components: [{
        cell: 'dashboard-col-0',
        type: 'Highchartss', // wrong type of the component
        chartOptions: {
            series: [{
                data: [1, 2, 3]
            }]
        }
    }, {
        type: 'HTML',
        cell: 'dashboard-col-1',
        elements: [{
            // tagName: 'img', // missing tagName param
            attributes: {
                src: 'https://www.highcharts.com/samples/graphics/stock-dark.svg'
            }
        }]
    }, {
        cell: 'dashboard-col-2',
        type: 'Highcharts',
        chartOptions: {
            series: [{
                type: 'myseries', // highcharts error
                data: [1, 2, 3]
            }]
        }
    }, {
        cell: 'dashboard-col-11', // missing cell id
        type: 'Highcharts',
        chartOptions: {
            series: [{
                data: [1, 2, 3]
            }]
        }
    }, {
        connector: {
            id: 'wrong-id'
        },
        cell: 'dashboard-col-3',
        type: 'Highcharts',
        chartOptions: {
            series: [{
                data: [1, 2, 3]
            }]
        }
    }]
});