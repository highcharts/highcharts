Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>yAxis.minorTickInterval</em> on logarithmic axis'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    yAxis: {
        minorTickInterval: 'auto',
        type: 'logarithmic'
    },
    series: [{
        data: [
            0.29, 71.5, 1.06, 1292, 14.4, 1.76, 135, 1.48, 0.216, 0.194, 9.56,
            1.1
        ],
        type: 'column'
    }]
} satisfies Highcharts.Options);
