Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>tooltip.header</em> options'
    },
    xAxis: {
        crosshair: true,
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
    }],
    tooltip: {
        header: {
            backgroundColor: '#444444',
            borderColor: '#141414',
            borderWidth: 1,
            distance: 5,
            style: {
                color: '#ffffff'
            }
        },
        split: true
    }
});
