Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'horizon',
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                data: JSON.parse(document.getElementById('data').innerText)
                    .elevationProfile
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'horizon-chart'
                }]
            }]
        }]
    },
    components: [{
        connector: {
            id: 'horizon'
        },
        cell: 'horizon-chart',
        type: 'Highcharts',
        columnAssignment: {
            azimuth: 'x',
            Horizon: {
                y: 'angle'
            }
        },
        chartOptions: {
            chart: {
                zoomType: 'xy',
                scrollablePlotArea: {
                    minWidth: 3000,
                    scrollPositionX: 0.5
                },
                plotBackgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, 'lightblue'],
                        [1, 'white']
                    ]
                },
                styledMode: false
                // @todo
                // Note: should have used staticScale, but it doesn't work
                // well with scrollablePlotArea
                // height: (yExtremes.max - yExtremes.min) * 10 + 90
            },
            title: {
                text: null
            },
            xAxis: {
                tickInterval: 30,
                minPadding: 0,
                maxPadding: 0
            },
            yAxis: {
                labels: {
                    enabled: false
                },
                title: {
                    enabled: false
                },
                gridLineWidth: 0,
                tickPixelInterval: 30,
                endOnTick: false,
                startOnTick: false,
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'gray',
                    zIndex: 10
                }],
                staticScale: 10
                // ...yExtremes
            },
            legend: {
                enabled: false
            },
            tooltip: {
                valueDecimals: 2,
                valueSuffix: '°'
            },
            plotOptions: {
                series: {
                    states: {
                        inactive: {
                            enabled: false
                        }
                    },
                    turboThreshold: Infinity
                }
            },
            series: [{
                type: 'area',
                lineColor: 'gray',
                color: '#b4d0a4',
                name: 'Horizon',
                marker: {
                    enabled: false
                }
            }]
        }
    }]
}, true);
