// Necessary to enable styled mode in order to properly style the
// chart depending on the theme.
Highcharts.setOptions({
    chart: {
        styledMode: true
    }
});

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
        type: 'HTML',
        cell: 'dashboard-col-0',
        elements: [
            {
                tagName: 'h1',
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
