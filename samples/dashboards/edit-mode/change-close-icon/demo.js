Dashboards.board('container', {
    editMode: {
        enabled: true,
        confirmationPopup: {
            close: {
                icon: 'https://code.highcharts.com/dashboards/gfx/dashboards-icons/series-types/icon-gauge.svg'
            }
        },
        contextMenu: {
            enabled: true
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
        renderTo: 'dashboard-col-0',
        type: 'Highcharts',
        chartOptions: {
            series: [{
                data: [1, 2, 3, 4]
            }]
        }
    }, {
        renderTo: 'dashboard-col-1',
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
