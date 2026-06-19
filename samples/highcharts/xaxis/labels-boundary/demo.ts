Highcharts.chart('container', {
    title: {
        text: 'Demo of axis label boundary'
    },
    xAxis: {
        dateTimeLabelFormats: {
            month: {
                main: '%b'
            },
            year: {
                boundary: '%b<br>%Y'
            }
        },
        type: 'datetime'
    },
    plotOptions: {
        series: {
            pointIntervalUnit: 'month',
            pointStart: '2026-01-01'
        }
    },
    series: [{
        data: [1, 3, 2, 6, 3, 5, 7, 5, 1, 2, 3, 2],
        pointInterval: 2
    }]
});
