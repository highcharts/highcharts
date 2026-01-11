Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>xAxis.startOfWeek</em>'
    },
    xAxis: {
        labels: {
            format: '{value:%[aeb]}'
        },
        startOfWeek: 1,
        tickInterval: 604800000,
        type: 'datetime'
    },
    plotOptions: {
        series: {
            pointInterval: 7,
            pointIntervalUnit: 'day',
            pointStart: '2026-01-01'
        }
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
} satisfies Highcharts.Options);
