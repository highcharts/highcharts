Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>chart</em> options'
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
    chart: {
        borderWidth: 2,
        borderColor: '#334eff',
        borderRadius: 4
    }
});

// Highcharts Controls for demo purpose
HighchartsControls.controls('highcharts-controls', {
    controls: [{
        type: 'number',
        path: 'chart.borderWidth',
        value: 2
    },
    {
        type: 'color',
        path: 'chart.borderColor',
        value: '#334eff'
    },
    {
        type: 'number',
        path: 'chart.borderRadius',
        value: 4
    }]
});
