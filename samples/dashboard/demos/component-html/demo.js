const dashboard = new Dashboard.Dashboard('container', {
    gui: {
        enabled: true,
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-1'
                }, {
                    id: 'dashboard-2'
                }]
            }]
        }]
    },
    components: [{
        type: 'html',
        cell: 'dashboard-1',
        elements: [{
            tagName: 'img',
            attributes: {
                src: 'https://www.highcharts.com/docs/assets/images/hollow-candlestick-89ede73673a823ad1e222f9280da27e8.png'
            }
        }]
    }, {
        type: 'html',
        cell: 'dashboard-2',
        elements: [{
            tagName: 'img',
            attributes: {
                src: 'https://www.highcharts.com/docs/assets/images/axis_description-a5a5c48c754b2eb89d105edfb07b24f2.png'
            }
        }]
    }]
});