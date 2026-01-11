Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>yAxis.minPadding</em>'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    yAxis: {
        lineWidth: 1,
        minPadding: 0.25,
        startOnTick: false
    },
    series: [{
        data: [
            129.9, 171.5, 206.4, 229.2, 244, 276, 235.6, 248.5, 316.4, 294.1,
            195.6, 154.4
        ]
    }]
} satisfies Highcharts.Options);
