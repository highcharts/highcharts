Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>palette</em> options'
    },
    xAxis: {
        type: 'datetime'
    },
    palette: {
        colorScheme: 'light dark',
        dark: {
            colors: ['#2caffe', '#00e272', '#efdf00']
        },
        light: {
            colors: ['#2caffe', '#544fc5', '#00e272']
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
