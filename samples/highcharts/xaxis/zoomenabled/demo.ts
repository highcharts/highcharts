Highcharts.chart('container', {
    chart: {
        zooming: {
            type: 'xy'
        }
    },
    title: {
        text: 'Demo of axis <em>zoomEnabled</em> options'
    },
    xAxis: {
        type: 'datetime',
        zoomEnabled: false
    },
    yAxis: {
        zoomEnabled: true
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
});
