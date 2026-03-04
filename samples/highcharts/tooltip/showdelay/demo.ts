Highcharts.chart('container', {
    title: {
        text: 'Crosshair and Tooltip <em>showDelay</em> demo'
    },
    xAxis: {
        crosshair: {
            showDelay: 1000
        },
        type: 'datetime'
    },
    yAxis: {
        crosshair: {
            showDelay: 1000
        }
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
    }],
    tooltip: {
        showDelay: 1000
    }
});
