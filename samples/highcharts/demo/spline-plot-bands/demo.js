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
        text: '15th & 16th of April, 2020 at two locations in Vik i Sogn, Norway',
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
            pointStart: Date.UTC(2020, 3, 15, 0, 0, 0)
        }
    },
    series: [{
        name: 'Hestavollane',
        data: [5.4, 5.2, 5.7, 6.3, 5.2, 5.6, 6.1,
            5.6, 5.9, 7.1, 8.6, 7.8, 8.6,
            8.0, 9.7, 11.2, 12.5, 13.1, 10.6,
            10.9, 8.9, 9.5, 7.5, 3.5, 4.2]

    }, {
        name: 'Vik',
        data: [0.2, 0.1, 0.1, 0.5, 0.3, 0.2, 0.1,
            0.1, 0.1, 0.1, 0.2, 1.1, 1.3,
            2.0, 1.5, 1.5, 1.5, 1.4, 1.7,
            2.0, 2.9, 2.1, 2.1, 3.5, 2.9]
    }],
    navigation: {
        menuItemStyle: {
            fontSize: '10px'
        }
    }
});
