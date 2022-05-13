Highcharts.chart('container', {
    title: {
        text: 'The <em>HighchartsModuleLoaded</em> event'
    },
    xAxis: {
        type: 'datetime'
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ],
        dataLabels: {
            enabled: true
        },
        pointStart: Date.UTC(2022, 0, 1),
        pointIntervalUnit: 'day'
    }]
});
