Highcharts.setOptions({
    chart: {
        type: 'area',
        spacingTop: 20,
        spacingBottom: 20
    },
    title: {
        align: 'left',
        margin: 0,
        x: 30
    },
    credits: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    xAxis: {
        crosshair: true,
        labels: {
            format: '{value} km'
        },
        accessibility: {
            description: 'Kilometers',
            rangeDescription: '0km to 6.5km'
        }
    },
    yAxis: {
        title: {
            text: null
        }
    },
    tooltip: {
        positioner: function () {
            return {
                // right aligned
                x: this.chart.chartWidth - this.label.width,
                y: 10 // align to title
            };
        },
        borderWidth: 0,
        backgroundColor: 'none',
        pointFormat: '{point.y}',
        headerFormat: '',
        shadow: false,
        valueDecimals: 0
    }
});

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'activity-data',
            type: 'JSON',
            options: {
                beforeParse: function (data) {
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
        connector: {
            id: 'activity-data',
            columnAssignment: [{
                seriesId: 'Speed',
                data: ['x', 'Speed']
            }]
        },
        renderTo: 'dashboard-cell-0',
        type: 'Highcharts',
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
        connector: {
            id: 'activity-data',
            columnAssignment: [{
                seriesId: 'Elevation',
                data: ['x', 'Elevation']
            }]
        },
        renderTo: 'dashboard-cell-1',
        type: 'Highcharts',
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
        sync: {
            highlight: true
        },
        connector: {
            id: 'activity-data',
            columnAssignment: [{
                seriesId: 'Heart rate',
                data: ['x', 'Heart rate']
            }]
        },
        renderTo: 'dashboard-cell-2',
        type: 'Highcharts',
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
