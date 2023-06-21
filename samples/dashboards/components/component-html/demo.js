Dashboards.board('container', {
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-1',
                    height: 400
                }, {
                    id: 'dashboard-2',
                    height: 400
                }]
            }, {
                cells: [{
                    id: 'dashboard-3'
                }]
            }]
        }]
    },
    components: [{
        type: 'HTML',
        cell: 'dashboard-1',
        elements: [{
            tagName: 'img',
            attributes: {
                src: 'https://www.highcharts.com/samples/graphics/stock-dark.svg'
            }
        }]
    }, {
        type: 'HTML',
        cell: 'dashboard-2',
        elements: [{
            tagName: 'img',
            attributes: {
                src: 'https://www.highcharts.com/samples/graphics/maps-dark.svg'
            }
        }]
    }, {
        type: 'HTML',
        cell: 'dashboard-3',
        elements: [{
            tagName: 'h1',
            textContent: 'Placeholder text'
        }]
    }]
});