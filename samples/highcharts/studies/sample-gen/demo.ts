Highcharts.chart('container', {
    title: {
        text: 'Demo of various chart options',
        align: 'center'
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
        backgroundColor: '#FFFFFF'
    }
});

// Highcharts Controls for demo purpose
HighchartsControls.controls('highcharts-controls', {
    target: Highcharts.charts[0],
    controls: [{
        type: 'color',
        path: 'chart.backgroundColor',
        value: '#FFFFFF'
    },
    {
        type: 'array-of-strings',
        path: 'title.align',
        value: 'center',
        options: [
            'left',
            'center',
            'right'
        ]
    },
    {
        type: 'boolean',
        path: 'title.floating'
    },
    {
        type: 'number',
        path: 'title.x',
        range: [
            -100,
            100
        ]
    }]
});
