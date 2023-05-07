Highcharts.chart('container', {
    chart: {
        type: 'spline',
        zoomType: 'xy'
    },
    title: {
        text: 'NASA Budget as a % of Fed Budget'
    },
    subtitle: {
        text:
        'Source <a href="https://en.wikipedia.org/wiki/Budget_of_NASA" target="_blank">Wikipedia</a>'
    },
    xAxis: {
        crosshair: true,
        title: {
            text: 'Year'
        },
        plotLines: [
            {
                useHTML: true,
                color: '#f15c80',
                dashStyle: 'dot',
                width: 2,
                value: 1957,
                label: {
                    y: 15,
                    text: 'USSR: Sputnik 1'
                },
                zIndex: 3
            },
            {
                color: '#f15c80',
                dashStyle: 'dot',
                width: 2,
                value: 1961,
                label: {
                    // y:15,
                    text: 'USSR: First human spaceflight'
                }
            },
            {
                color: '#f15c80',
                dashStyle: 'dot',
                width: 2,
                value: 1970,
                label: {
                    text: 'USSR: First lunar rover'
                }
            },
            {
                color: '#f15c80',
                dashStyle: 'dot',
                width: 2,
                value: 1961,
                label: {
                    // y:15,
                    text: 'USSR: First human spaceflight'
                }
            },
            {
                color: '#7cb5ec',
                dashStyle: 'dot',
                width: 2,
                value: 1973,
                label: {
                    text: 'US: First Jupiter flyby'
                }
            },
            {
                color: '#f15c80',
                dashStyle: 'dot',
                width: 2,
                value: 1986,
                label: {
                    text: 'USSR: First space station Mir'
                }
            },
            {
                color: '#7cb5ec',
                dashStyle: 'dot',
                width: 2,
                value: 1989,
                label: {
                    text: 'US: First Neptune flyby'
                }
            }
        ]
    },
    yAxis: {
        labels: {
            format: '{value}%'
        },
        title: {
            text: '% of Fed Budget'
        }
    },
    plotOptions: {
        series: {
            pointStart: 1954,
            marker: {
                enabled: false
            }
        }
    },

    annotations: [
        {
            draggable: '',
            labelOptions: {
                backgroundColor: 'rgba(255,255,255,0.5)',
                verticalAlign: 'top',
                borderColor: '#7cb5ec',
                y: 15
            },
            labels: [
                {
                    point: {
                        xAxis: 0,
                        yAxis: 0,
                        x: 1969,
                        y: 2.31
                    },
                    text: 'US: Moon landing'
                },
                {
                    point: {
                        xAxis: 0,
                        yAxis: 0,
                        x: 1986,
                        y: 0.75
                    },
                    text: 'US: Space shuttle challenger disaster'
                }
            ]
        }
    ],
    legend: {
        enabled: false
    },
    series: [
        {
            name: '% of Fed Budget',
            data: [
                0,
                0,
                0,
                0,
                0.1,
                0.2,
                0.5,
                0.9,
                1.18,
                2.29,
                3.52,
                4.31,
                4.41,
                3.45,
                2.65,
                2.31,
                1.92,
                1.61,
                1.48,
                1.35,
                1.21,
                0.98,
                0.99,
                0.98,
                0.91,
                0.87,
                0.84,
                0.82,
                0.83,
                0.85,
                0.83,
                0.77,
                0.75,
                0.76,
                0.85,
                0.96,
                0.99,
                1.05,
                1.01,
                1.01,
                0.94,
                0.88,
                0.89,
                0.9,
                0.86,
                0.8,
                0.75,
                0.76,
                0.72,
                0.68,
                0.66,
                0.63,
                0.57,
                0.58,
                0.6,
                0.57,
                0.52,
                0.51,
                0.5,
                0.49,
                0.5,
                0.49,
                0.5,
                0.47,
                0.5,
                0.47,
                0.48
            ],
            tooltip: {
                valueSuffix: ' %'
            }
        }
    ]
});