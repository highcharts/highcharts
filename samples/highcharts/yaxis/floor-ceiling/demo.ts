Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>yAxis.ceiling</em> and <em>floor</em>'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    yAxis: {
        ceiling: 250,
        endOnTick: false,
        floor: 0,
        startOnTick: false
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144, 176, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }]
});
