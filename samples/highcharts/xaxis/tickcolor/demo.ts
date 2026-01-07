Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>xAxis.tickColor</em>'
    },
    xAxis: {
        tickColor: '#00c000',
        tickWidth: 3,
        type: 'datetime'
    },
    plotOptions: {
        series: {
            pointIntervalUnit: 'month',
            pointStart: '2026-01-01'
        }
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144, 176, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }]
} satisfies Highcharts.Options);
