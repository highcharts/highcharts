Dashboards.board('container', {
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-1'
                }]
            }]
        }]
    },
    components: [{
        type: 'HTML',
        cell: 'dashboard-1',
        elements: [{
            tagName: 'div',
            children: [{
                tagName: 'img',
                src: 'https://www.highcharts.com/samples/graphics/stock-dark.svg'
            }, {
                tagName: 'img',
                attributes: {
                    src: 'https://www.highcharts.com/samples/graphics/stock-dark.svg'
                }
            }]
        }]
    }]
});
