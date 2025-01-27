Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'data',
            type: 'JSON',
            options: {
                data: [
                    ['Name', 'Value', 'Marker Radius', 'Data Label'],
                    ['A', 5, 4, true],
                    ['B', 6, 20, false],
                    ['C', 7, 10, false],
                    ['D', 6, 0, true],
                    ['E', 4, 6, true]
                ]
            }
        }]
    },
    gui: {
        layouts: [{
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
        connector: {
            id: 'data',
            columnAssignment: [{
                seriesId: 'my-series',
                data: {
                    name: 'Name',
                    y: 'Value',
                    'marker.radius': 'Marker Radius',
                    'dataLabels.enabled': 'Data Label'
                }
            }]
        },
        chartOptions: {
            title: {
                text: ''
            },
            legend: {
                enabled: false
            },
            series: [{
                id: 'my-series',
                type: 'spline',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }]
        }
    }, {
        renderTo: 'dashboard-col-1',
        type: 'DataGrid',
        connector: {
            id: 'data'
        },
        dataGridOptions: {
            columnDefaults: {
                cells: {
                    editable: true
                }
            }
        }
    }]
});
