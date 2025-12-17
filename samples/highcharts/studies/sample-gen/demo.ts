Highcharts.chart('container', {
    title: {
        text: 'Demo of various chart options'
    },
    series: [
        {
            type: 'column',
            data: [
                1,
                3,
                2,
                4
            ],
            colorByPoint: true
        }
    ],
    xAxis: {},
    yAxis: {}
});

// Highcharts Controls for demo purpose
HighchartsControls.controls('highcharts-controls', {
    controls: [{
        type: 'number',
        path: 'xAxis.lineWidth'
    },
    {
        type: 'number',
        path: 'yAxis.lineWidth'
    }]
});
