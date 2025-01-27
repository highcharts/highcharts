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
        // that in JavaScript, months start at 0 for January, 1 for February
        // etc.
        data: [
            ['1970-10-27', 0],
            ['1970-11-10', 0.6],
            ['1970-11-18', 0.7],
            ['1970-12-02', 0.8],
            ['1970-12-09', 0.6],
            ['1970-12-16', 0.6],
            ['1970-12-28', 0.67],
            ['1971-01-01', 0.81],
            ['1971-01-08', 0.78],
            ['1971-01-10', 0.98],
            ['1971-01-27', 1.84],
            ['1971-02-10', 1.80],
            ['1971-02-18', 1.80],
            ['1971-02-24', 1.92],
            ['1971-03-04', 2.49],
            ['1971-03-11', 2.79],
            ['1971-03-15', 2.73],
            ['1971-03-25', 2.61],
            ['1971-04-02', 2.76],
            ['1971-04-06', 2.82],
            ['1971-04-13', 2.8],
            ['1971-05-03', 2.1],
            ['1971-05-26', 1.1],
            ['1971-06-09', 0.25],
            ['1971-06-12', 0]
        ]
    }]
});