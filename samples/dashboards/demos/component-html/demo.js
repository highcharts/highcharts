const dashboard = new Dashboards.Dashboard('container', {
    gui: {
        enabled: true,
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-1'
                }, {
                    id: 'dashboard-2'
                }]
            }, {
                cells: [{
                    id: 'dashboard-3'
                }]
            }]
        }]
    },
    components: [{
        type: 'html',
        cell: 'dashboard-1',
        dimentions: {
            height: 500
        },
        elements: [{
            tagName: 'img',
            attributes: {
                src: 'https://www.highcharts.com/samples/graphics/stock-dark.svg'
            }
        }]
    }, {
        type: 'html',
        cell: 'dashboard-2',
        elements: [{
            tagName: 'img',
            attributes: {
                src: 'https://www.highcharts.com/samples/graphics/maps-dark.svg'
            }
        }]
    }, {
        type: 'html',
        cell: 'dashboard-3',
        elements: [{
            tagName: 'h1',
            style: {
                height: '400px',
                'text-align': 'center'
            },
            textContent: 'Placeholder text'
        }]
    }]
});