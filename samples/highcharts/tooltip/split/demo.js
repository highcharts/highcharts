// Create the chart
Highcharts.chart('container', {

    chart: {
        type: 'spline'
    },

    title: {
        text: 'Mountain house indoor temperatures'
    },

    subtitle: {
        text: 'Split tooltips in Highcharts makes it easier to read ' +
            'overlapping line series'
    },

    tooltip: {
        valueSuffix: '°C',
        split: true,
        distance: 30,
        padding: 5,
        header: {
            distance: 8
        }
    },

    xAxis: {
        type: 'datetime',
        crosshair: {
            enabled: true
        }
    },

    yAxis: {
        title: {
            text: 'Temperatur'
        }
    },

    plotOptions: {
        series: {
            dataMapping: {
                x: 'Time'
            },
            lineWidth: 1.5,
            marker: {
                radius: 2
            }
        }
    },

    dataTable: {
        columns: {
            Time: [
                '2016-01-01 02:02:00',
                '2016-01-04 00:12:00',
                '2016-01-05 00:12:00',
                '2016-01-06 00:12:00',
                '2016-01-07 00:12:00',
                '2016-01-08 00:12:00',
                '2016-01-09 00:12:00',
                '2016-01-10 00:12:00',
                '2016-01-11 00:12:00',
                '2016-01-12 00:12:00',
                '2016-01-13 00:12:00',
                '2016-01-14 00:12:00',
                '2016-01-15 00:12:00',
                '2016-01-16 00:12:00',
                '2016-01-17 00:12:00',
                '2016-01-18 00:12:00',
                '2016-01-19 00:12:00',
                '2016-01-20 00:12:00',
                '2016-01-21 00:12:00',
                '2016-01-22 00:12:00',
                '2016-01-23 00:12:00',
                '2016-01-24 00:12:00',
                '2016-01-25 00:12:00',
                '2016-01-26 00:12:00',
                '2016-01-27 00:12:00',
                '2016-01-28 00:12:00',
                '2016-01-29 00:12:00'
            ],
            Kitchen: [
                5, 4, 5, 9, 6, 15, 19, 14, 6, 5, 6, 6, 15, 18, 15,
                6, 6, 6, 6, 6, 6, 6, 16, 10, 6, 6, 6
            ],
            'Living room': [
                9, 10, 16, 13, 6, 20, 24, 16, 7, 7, 6, 6, 20, 23,
                18, 9, 7, 6, 6, 7, 6, 21, 20, 16, 6, 6, 6
            ],
            Hall: [
                7, 7, 13, 12, 5, 17, 22, 14, 4, 5, 5, 6, 18, 21, 17, 9,
                5, 6, 5, 6, 6, 18, 20, 14, 5, 5, 5
            ],
            Bathroom: [
                7, 7, 13, 12, 5, 17, 22, 14, 4, 5, 5, 6, 18, 21, 17,
                9, 5, 6, 5, 6, 6, 18, 20, 14, 5, 5, 5
            ],
            'Bedroom 1': [
                6, 19, 19, 10, 5, 15, 21, 14, 6, 6, 5, 5, 17, 21,
                16, 6, 5, 5, 5, 5, 5, 17, 18, 13, 5, 5, 5
            ],
            'Bedroom 2': [
                7, 19, 19, 9, 5, 11, 19, 15, 6, 5, 6, 6, 16, 19,
                17, 8, 9, 6, 5, 6, 5, 17, 19, 14, 6, 6, 6
            ],
            Shed: [
                6, 6, 5, 5, 6, 6, 6, 5, 5, 6, 6, 5, 6, 6, 6, 6, 6, 6,
                null, null, 6, 6, 6, 6, 6, 6, 6
            ]
        }
    },

    series: [{
        dataMapping: {
            y: 'Kitchen'
        }
    }, {
        dataMapping: {
            y: 'Living room'
        }
    }, {
        dataMapping: {
            y: 'Hall'
        }
    }, {
        dataMapping: {
            y: 'Bathroom'
        }
    }, {
        dataMapping: {
            y: 'Bedroom 1'
        }
    }, {
        dataMapping: {
            y: 'Bedroom 2'
        }
    }, {
        dataMapping: {
            y: 'Shed'
        }
    }]

});
