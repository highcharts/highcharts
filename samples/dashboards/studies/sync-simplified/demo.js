Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'activity-data',
            type: 'JSON',
            options: {
                beforeParse: function (data) {
                    console.log(data);
                    return [
                        data.xData,
                        data.datasets[0].data,
                        data.datasets[1].data,
                        data.datasets[2].data
                    ];
                },
                dataUrl: 'https://www.highcharts.com/samples/data/activity.json',
                firstRowAsNames: false,
                orientation: 'columns',
                columnNames: ['x', 'Speed', 'Elevation', 'Heart rate']
            }
        }]
    },
    components: [{
        type: 'Highcharts',
        renderTo: 'dashboard-cell-0',
        connector: {
            id: 'activity-data',
            columnAssignment: [{
                seriesId: 'Speed',
                data: ['x', 'Speed']
            }]
        },
        sync: {
            highlight: true
        },
        chartOptions: {
            title: {
                text: 'Speed'
            },
            tooltip: {
                valueDecimals: 1,
                valueSuffix: ' km/h'
            },
            series: [{
                type: 'line',
                id: 'Speed'
            }]
        }
    }, {
        type: 'Highcharts',
        renderTo: 'dashboard-cell-1',
        connector: {
            id: 'activity-data',
            columnAssignment: [{
                seriesId: 'Elevation',
                data: ['x', 'Elevation']
            }]
        },
        sync: {
            highlight: true
        },
        chartOptions: {
            title: {
                text: 'Elevation'
            },
            tooltip: {
                valueSuffix: ' m'
            }
        }
    }, {
        type: 'Highcharts',
        renderTo: 'dashboard-cell-2',
        connector: {
            id: 'activity-data',
            columnAssignment: [{
                seriesId: 'Heart rate',
                data: ['x', 'Heart rate']
            }]
        },
        sync: {
            highlight: true
        },
        chartOptions: {
            title: {
                text: 'Heart rate'
            },
            tooltip: {
                valueSuffix: ' bpm'
            }
        }
    }]
}, true);
