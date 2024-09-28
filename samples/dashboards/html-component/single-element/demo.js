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
        renderTo: 'dashboard-1',
        elements: [{
            tagName: 'img',
            attributes: {
                src: 'https://www.highcharts.com/samples/graphics/stock-dark.svg'
            }
        }]
    }]
});
