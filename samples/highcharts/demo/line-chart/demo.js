Highcharts.chart('container', {
    chart: {
        type: 'spline' // Smoothed line
    },

    title: {
        text: 'Application users last 24 hours',
        align: 'left'
    },

    subtitle: {
        text: 'All traffic sources combined'
    },

    yAxis: {
        title: {
            text: 'Unique users'
        }
    },

    xAxis: {
        type: 'datetime',
        crosshair: true,
        dateTimeLabelFormats: {
            day: '%H:%M' // Don't show the date
        }
    },

    legend: {
        enabled: false
    },

    tooltip: {
        shared: true,
        dateTimeLabelFormats: {
            hour: '%H:%M'
        }
    },

    // Common options for all series
    plotOptions: {
        series: {
            // There are many ways to handle time data in Highcharts.
            // This way we omit the timestamp from each data point, and
            // rely on each data point being one hour apart.
            pointInterval: 36e5 // one hour
        }
    },

    series: [{
        name: 'Users',
        color: '#1F75FF',
        data: [
            990, 652, 965, 1048, 939, 1012, 2089, 3995, 4123, 4302,
            5289, 6115, 7723, 8162, 10089, 7812, 4127, 3812, 4156, 3805,
            2958, 1984, 1432, 1299
        ]
    }, {
        name: 'Average',
        color: '#8791BA',
        dashStyle: 'dot',
        marker: {
            enabled: false
        },
        data: [
            865, 832, 775, 728, 779, 812, 989, 1095, 1623, 2102,
            2289, 2315, 2412, 2662, 3089, 2812, 2427, 2112, 2356, 2305,
            1858, 1084, 932, 899
        ]
    }]
});
