Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>palette</em> options'
    },
    xAxis: {
        type: 'datetime'
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
        series: {
            pointIntervalUnit: 'month',
            pointStart: '2026-01-01'
        }
    },
    series: [{
        data: [3, 6, 5, 6]
    }, {
        data: [2, 5, 4, 5]
    }, {
        data: [1, 3, 2, 4]
    }]
});
