Dashboards.board('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true
        }
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-main'
                }]
            }, {
                cells: [{
                    id: 'dashboard-1',
                    height: 400
                }, {
                    id: 'dashboard-2',
                    height: 400
                }]
            }]
        }]
    },
    components: [{
        type: 'HTML',
        renderTo: 'dashboard-main',
        elements: [{
            tagName: 'div',
            children: [{
                tagName: 'h1',
                textContent: 'Title',
                attributes: {
                    id: 'main-title'
                }
            }, {
                tagName: 'p',
                textContent: 'Description',
                attributes: {
                    id: 'description'
                }
            }]
        }]
    }, {
        type: 'HTML',
        renderTo: 'dashboard-1',
        elements: [{
            tagName: 'img',
            attributes: {
                src: 'https://www.highcharts.com/samples/graphics/stock-dark.svg'
            }
        }]
    }, {
        type: 'HTML',
        renderTo: 'dashboard-2',
        html: '<img src="https://www.highcharts.com/samples/graphics/maps-dark.svg">'
    }]
});