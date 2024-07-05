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
                    id: 'dashboard-cell-0'
                }]
            }]
        }]
    },
    components: [{
        renderTo: 'dashboard-cell-0',
        type: 'Highcharts',
        editableOptions: [{
            isStandalone: true,
            name: 'Component title',
            propertyPath: ['title'],
            type: 'input'
        }, {
            name: 'chartOptions',
            type: 'nested',
            nestedOptions: [{
                name: 'Marker Radius',
                options: [{
                    name: 'Marker Radius',
                    propertyPath: [
                        'chartOptions',
                        'plotOptions',
                        'series',
                        'marker',
                        'radius'
                    ],
                    type: 'select',
                    selectOptions: [{
                        name: 3
                    }, {
                        name: 5
                    }]
                }]
            }]
        }],
        chartOptions: {
            plotOptions: {
                series: {
                    animation: false,
                    marker: {
                        radius: 10
                    }
                }
            },
            chart: {
                animation: false
            },
            series: [{
                data: [1, 2, 1, 4]
            }]
        }
    }]
});
