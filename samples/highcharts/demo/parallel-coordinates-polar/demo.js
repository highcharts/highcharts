const data = [
    // Name (Sybol), Atomic Number, Atomic Radius, Boiling Point, Density, Phase
    ['Mercury (Hg)', 80, 151, 629, 13.546, 1],
    ['Iron (Fe)', 26, 126, 3134, 7.874, 2],
    ['Silver (Ag)', 47, 144, 2435, 10.503, 2],
    ['Xenon (Xe)', 54, 108, 165, 3.408, 0]
];

Highcharts.chart('container', {
    chart: {
        parallelCoordinates: true,
        parallelAxes: {
            labels: {
                style: {
                    opacity: 0.7
                }
            },
            gridLineWidth: 0,
            showFirstLabel: false,
            startOnTick: false,
            endOnTick: false,
            minPadding: 0.2,
            tickPixelInterval: 42
        },
        polar: true,
        type: 'area'
    },
    pane: {
        size: '80%',
        startAngle: 72
    },
    title: {
        text: 'Elemental property trends'
    },
    subtitle: {
        text: 'Exploring diverse behaviors across states and groups'
    },
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
        '{series.name}: <b>{point.formattedValue}</b><br/>'
    },
    legend: {
        enabled: true,
        borderWidth: 1,
        borderRadius: 5,
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        symbolHeight: 8,
        symbolWidth: 17,
        symbolRadius: 3,
        squareSymbol: false
    },
    xAxis: {
        categories: [
            'Atomic Number',
            'Atomic Radius',
            'Boiling Point',
            'Density',
            'Phase at STP'
        ],
        labels: {
            distance: 20,
            style: {
                fontWeight: 'bold'
            }
        },
        gridLineWidth: 0
    },
    yAxis: [{
        // Atomic Number
        min: 0
    }, {
        // Atomic Radius
        labels: {
            format: '{value} pm'
        }
    }, {
        // Boiling Point
        labels: {
            format: '{value} K'
        },
        min: 0
    }, {
        // Density
        labels: {
            format: '{value:.2f} g/cm³'
        }
    }, {
        // Phase
        categories: [
            'gas',
            'liquid',
            'solid',
            ''
        ],
        min: -0.5,
        max: 2.5
    }],
    series: data.map(function (set, i) {
        return {
            name: set[0],
            data: set.slice(1)
        };
    }),
    plotOptions: {
        series: {
            fillOpacity: 0,
            states: {
                hover: {
                    lineWidthPlus: 2
                }
            },
            legendSymbol: 'rectangle'
        }
    },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 400
            },
            chartOptions: {
                legend: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'bottom',
                    layout: 'horizontal'
                },
                pane: {
                    size: '50%'
                },
                chart: {
                    parallelAxes: {
                        labels: {
                            enabled: false
                        }
                    }
                }
            }
        }, {
            condition: {
                maxWidth: 520
            },
            chartOptions: {
                pane: {
                    size: '65%'
                }
            }
        }, {
            condition: {
                minWidth: 420
            },
            chartOptions: {
                chart: {
                    parallelAxes: {
                        labels: {
                            enabled: true
                        }
                    }
                }
            }
        }]
    }
});
