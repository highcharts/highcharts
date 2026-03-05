Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>xAxis.plotLines.zIndex</em>'
    },
    xAxis: {
        plotLines: [{
            color: '#44ee44',
            value: '2026-06-15',
            width: 5,
            zIndex: 5
        }],
        type: 'datetime'
    },
    yAxis: {
        gridLineWidth: 5
    },
    plotOptions: {
        series: {
            lineWidth: 5,
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
