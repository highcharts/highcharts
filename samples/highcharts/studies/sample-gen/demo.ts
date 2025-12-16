Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>legend.enabled</em>'
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
    legend: {
        enabled: true
    }
});

// Highcharts Controls for demo purpose
HighchartsControls.controls('highcharts-controls', {
    target: Highcharts.charts[0],
    controls: [{
        type: 'boolean',
        path: 'legend.enabled',
        value: true
    }]
});
