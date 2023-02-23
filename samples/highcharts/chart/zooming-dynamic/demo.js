Highcharts.chart('container', {
    chart: {
        zooming: {
            type: 'xy',
            dynamic: true
        }
    },
    series: [{
        data: [8, 3, 1, 3, 2, 5]
    }]
});