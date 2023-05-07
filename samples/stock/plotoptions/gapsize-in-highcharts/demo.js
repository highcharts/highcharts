Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },

    title: {
        text: 'Snow depth at Vikjafjellet, Norway'
    },

    subtitle: {
        text: 'Irregular time data in Highcharts JS'
    },

    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the year
            month: '%e. %b',
            year: '%b'
        },
        title: {
            text: 'Date'
        }
    },

    yAxis: {
        title: {
            text: 'Snow depth (m)'
        },
        min: 0
    },

    tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
    },

    series: [{
        name: 'Winter 2007-2008',
        gapSize: 5,
        // Define the data points. All series have a year
        // of 1970/71 in order to be compared on the same x axis. Note
        // that in JavaScript, months start at 0 for January, 1 for February etc.
        data: [
            [Date.UTC(1970, 9, 27), 0],
            [Date.UTC(1970, 10, 10), 0.6],
            [Date.UTC(1970, 10, 18), 0.7],
            [Date.UTC(1970, 11, 2), 0.8],
            [Date.UTC(1970, 11, 9), 0.6],
            [Date.UTC(1970, 11, 16), 0.6],
            [Date.UTC(1970, 11, 28), 0.67],
            [Date.UTC(1971, 0, 1), 0.81],
            [Date.UTC(1971, 0, 8), 0.78],
            [Date.UTC(1971, 0, 10), 0.98],
            [Date.UTC(1971, 0, 27), 1.84],
            [Date.UTC(1971, 1, 10), 1.80],
            [Date.UTC(1971, 1, 18), 1.80],
            [Date.UTC(1971, 1, 24), 1.92],
            [Date.UTC(1971, 2, 4), 2.49],
            [Date.UTC(1971, 2, 11), 2.79],
            [Date.UTC(1971, 2, 15), 2.73],
            [Date.UTC(1971, 2, 25), 2.61],
            [Date.UTC(1971, 3, 2), 2.76],
            [Date.UTC(1971, 3, 6), 2.82],
            [Date.UTC(1971, 3, 13), 2.8],
            [Date.UTC(1971, 4, 3), 2.1],
            [Date.UTC(1971, 4, 26), 1.1],
            [Date.UTC(1971, 5, 9), 0.25],
            [Date.UTC(1971, 5, 12), 0]
        ]
    }]
});