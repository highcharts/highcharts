Highcharts.chart('container', {
    title: {
        text: 'Demo of axis <em>crosshair</em> options'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ],
        crosshair: {
            color: '#008800',
            width: 3
        }
    },
    yAxis: {
        crosshair: {
            color: '#008800',
            width: 3
        }
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144, 176, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }]
} satisfies Highcharts.Options);
