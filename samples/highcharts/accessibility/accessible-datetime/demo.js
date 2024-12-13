Highcharts.chart('container', {
    caption: {
        text: 'Random data on a date axis.'
    },
    chart: {
        zooming: {
            type: 'x'
        }
    },
    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },
    series: [{
        pointStart: '2016-01-01 13:40:23',
        pointInterval: 1000,
        data: [1, 3, 4, 6, 7, 5, 3, 4, 8, 9, 7, 6, 4, 3]
    }]
});
