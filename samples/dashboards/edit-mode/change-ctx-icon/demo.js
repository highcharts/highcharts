const dash = Dashboards.board('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true,
            icon: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@381ddd81b2100b6f4851a05cdbcd38658b662c18/gfx/dashboard-icons/series-types/icon-gauge.svg'
        }
    },
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
            series: [{
                data: [1, 2, 3, 4]
            }]
        }
    }, {
        cell: 'dashboard-col-1',
        type: 'Highcharts',
        chartOptions: {
            chart: {
                type: 'bar'
            },
            series: [{
                data: [1, 2, 3, 4]
            }]
        }
    }]
});
