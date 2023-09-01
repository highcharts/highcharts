Dashboards.board('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true
        },
        events: {
            activate: function () {
                console.log('Activated Edit Mode');
            },
            deactivate: function () {
                console.log('Deactivated Edit Mode');
            }
        }
    },
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
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
    }]
});