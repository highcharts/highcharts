Highcharts.chart('container', {
    chart: {
        zooming: {
            type: 'xy',
            markings: {
                enabled: true,
                length: 20
            }
        }
    },
    series: [{
        data: [8, 3, 1, 3, 2, 5]
    }]
});