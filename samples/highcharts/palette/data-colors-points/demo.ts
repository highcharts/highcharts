Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>palette</em> options'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    palette: {
        colors: ['#2caffe', '#2e2a69', '#00e272'],
        colorScheme: 'light dark',
        dark: {
            colors: [
                null,
                '#efdf00'
            ]
        }
    },
    plotOptions: {
        column: {
            colorByPoint: true
        }
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144, 176, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }]
});
