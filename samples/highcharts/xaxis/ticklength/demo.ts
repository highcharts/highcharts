Highcharts.chart('container', {
    title: {
        text: 'Demo of axis <em>tickLength</em> options'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ],
        tickLength: 30,
        tickWidth: 1
    },
    yAxis: {
        lineWidth: 1,
        tickLength: 0,
        tickWidth: 1
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144, 176, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }]
});
