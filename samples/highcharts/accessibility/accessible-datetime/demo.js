
Highcharts.chart('container', {
    chart: {
        description: 'Random data on a date axis.'
    },
    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },
    series: [{
        pointStart: Date.UTC(2016, 0, 1, 13, 40, 23),
        pointInterval: 1000,
        data: [1, 3, 4, 6, 7, 5, 3, 4, 8, 9, 7, 6, 4, 3]
    }]
});
