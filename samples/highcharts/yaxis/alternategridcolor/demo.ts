Highcharts.chart('container', {
    title: {
        text: 'Demo of axis <em>alternateGridColor</em> options'
    },
    xAxis: {
        alternateGridColor: '#88cc881a',
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    yAxis: {
        alternateGridColor: '#8888cc1a'
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144, 176, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }]
} satisfies Highcharts.Options);
