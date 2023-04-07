Highcharts.mapChart('container', {
    chart: {
        margin: 0
    },

    title: {
        text: ''
    },

    navigation: {
        buttonOptions: {
            align: 'left',
            x: -1,
            y: 10,
            height: 28,
            width: 28,
            symbolSize: 14,
            symbolX: 14.5,
            symbolY: 13.5,
            theme: {
                'stroke-width': 1,
                stroke: 'silver',
                r: 8,
                padding: 10
            }
        }
    },

    mapNavigation: {
        enabled: true,
        buttonOptions: {
            x: 10,
            theme: {
                r: 8
            }
        },
        buttons: {
            zoomIn: {
                y: 10
            },
            zoomOut: {
                y: 38
            }
        }
    },

    mapView: {
        center: [0, 20],
        zoom: 2
    },

    legend: {
        backgroundColor: 'rgba(255,255,255, 0.5)'
    },

    plotOptions: {
        series: {
            events: {
                legendItemClick: function () {
                    const clicked = this,
                        chart = this.chart;
                    chart.series.forEach(series => {
                        if (series.name !== clicked.name && series.type === 'tiledwebmap') {
                            series.setVisible(false);
                        } else if (clicked) {
                            clicked.setVisible(!clicked.visible);
                        }
                    });
                }
            }
        }
    },

    series: [{
        type: 'tiledwebmap',
        name: 'Map',
        provider: {
            type: 'OpenStreetMap',
            theme: 'Standard'
        },
        visible: true
    },
    {
        type: 'tiledwebmap',
        name: 'Satellite',
        provider: {
            type: 'USGS',
            theme: 'USImagery'
        },
        visible: false
    },
    {
        type: 'tiledwebmap',
        name: 'Terrain',
        provider: {
            type: 'OpenStreetMap',
            theme: 'OpenTopoMap'
        },
        visible: false
    }, {
        type: 'mappoint',
        name: 'Map points',
        dataLabels: {
            enabled: true
        },
        showInLegend: false,
        data: [{
            name: 'London',
            lat: 51.507222,
            lon: -0.1275
        }, {
            name: 'Vik i Sogn',
            lat: 61.087220,
            lon: 6.579700
        }, {
            name: 'Krakow',
            lon: 19.944981,
            lat: 50.064651
        }, {
            name: 'Kowloon',
            lon: 114.183,
            lat: 22.317
        }, {
            name: 'Windhoek',
            lat: -22.55900,
            lon: 17.06429
        }, {
            name: 'Doha',
            lat: 25.28547,
            lon: 51.53037
        }, {
            name: 'Vancouver',
            lat: 49.28315,
            lon: -123.12202
        }]
    }
    ]
});
