// Data retrieved from https://www.vikjavev.no/ver/#2022-06-13,2022-06-14

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
        text: '30th of December, 2015 at two locations in Vik i Sogn, Norway',
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
            pointStart: Date.UTC(2015, 12, 30, 0, 0, 0)
        }
    },
    series: [{
        name: 'Hestavollane',
        data: [
            11.1, 11.3, 11.7, 10.5, 13.5, 15.9, 18,
            16.8, 17.7, 14.7, 15.0, 15.3, 15.5, 15.8,
            15.9, 14.6, 13.2, 15.6, 19.9, 17.3, 16.4,
            15, 13.4, 13.1, 12.5]

    }, {
        name: 'Vik',
        data: [
            0.7, 0.2, 0.1, 0.2, 0.3, 0.7, 0.3, 0.9,
            1.2, 2.9, 2.2, 1.8, 1.7, 1.8, 1.7, 0.8,
            2.3, 1.7, 0.9, 1, 0.9, 1.3, 1.4, 1.4, 1.3]
    }],
    navigation: {
        menuItemStyle: {
            fontSize: '10px'
        }
    }
});
