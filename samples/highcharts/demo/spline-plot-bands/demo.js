// Data retrieved from https://www.vikjavev.no/ver/#2020-04-15,2020-04-16

Highcharts.chart('container', {
    chart: {
        type: 'spline',
        scrollablePlotArea: {
            minWidth: 600,
            scrollPositionX: 1
        }
    },
    title: {
        text: 'Wind speed during a day',
        align: 'left'
    },
    subtitle: {
        text: '29th of February, 2024 at two locations in Vik i Sogn, Norway',
        align: 'left'
    },
    xAxis: {
        type: 'datetime',
        labels: {
            overflow: 'justify'
        }
    },
    yAxis: {
        title: {
            text: 'Wind speed (m/s)'
        },
        minorGridLineWidth: 0,
        gridLineWidth: 0,
        alternateGridColor: null,
        plotBands: [{ // Light air
            from: 0.3,
            to: 1.5,
            color: 'rgba(68, 170, 213, 0.1)',
            label: {
                text: 'Light air',
                style: {
                    color: '#606060'
                }
            }
        }, { // Light breeze
            from: 1.5,
            to: 3.3,
            color: 'rgba(0, 0, 0, 0)',
            label: {
                text: 'Light breeze',
                style: {
                    color: '#606060'
                }
            }
        }, { // Gentle breeze
            from: 3.3,
            to: 5.5,
            color: 'rgba(68, 170, 213, 0.1)',
            label: {
                text: 'Gentle breeze',
                style: {
                    color: '#606060'
                }
            }
        }, { // Moderate breeze
            from: 5.5,
            to: 8,
            color: 'rgba(0, 0, 0, 0)',
            label: {
                text: 'Moderate breeze',
                style: {
                    color: '#606060'
                }
            }
        }, { // Fresh breeze
            from: 8,
            to: 11,
            color: 'rgba(68, 170, 213, 0.1)',
            label: {
                text: 'Fresh breeze',
                style: {
                    color: '#606060'
                }
            }
        }, { // Strong breeze
            from: 11,
            to: 14,
            color: 'rgba(0, 0, 0, 0)',
            label: {
                text: 'Strong breeze',
                style: {
                    color: '#606060'
                }
            }
        }, { // Near Gale
            from: 14,
            to: 17,
            color: 'rgba(68, 170, 213, 0.1)',
            label: {
                text: 'Near gale',
                style: {
                    color: '#606060'
                }
            }
        }, { // Fresh Gale
            from: 17,
            to: 20.5,
            color: 'rgba(0, 0, 0, 0)',
            label: {
                text: 'Fresh gale',
                style: {
                    color: '#606060'
                }
            }
        }, { // Strong Gale
            from: 20.5,
            to: 24,
            color: 'rgba(68, 170, 213, 0.1)',
            label: {
                text: 'Strong gale',
                style: {
                    color: '#606060'
                }
            }
        }]
    },
    tooltip: {
        valueSuffix: ' m/s'
    },
    plotOptions: {
        spline: {
            lineWidth: 4,
            states: {
                hover: {
                    lineWidth: 5
                }
            },
            marker: {
                enabled: false
            },
            pointInterval: 3600000, // one hour
            pointStart: Date.UTC(2024, 1, 29, 0, 0, 0)
        }
    },
    series: [{
        name: 'Hestavollane',
        data: [
            12.9, 13.8, 10.2, 8.4, 10.0, 9.2, 10.0,
            12.2, 13.2, 12.7, 12.5, 11.4, 10.4,
            7.9, 8.0, 11.4, 11.5, 12.0, 12.0,
            10.4, 11.2, 11.5, 12.2, 11.5, 8.3
        ]

    }, {
        name: 'Vik',
        data: [
            null, 1.3, 1.1, 0.8, 1.8, 1.7, 0.8,
            0.8, 1.0, 1.0, 1.0, 0.8, 1.4,
            1.3, 2.9, 6.1, 6.4, 6.6, 6.4,
            6.3, 5.4, 3.9, 3.0, 1.7, 1.4
        ]
    }],
    navigation: {
        menuItemStyle: {
            fontSize: '10px'
        }
    }
});
