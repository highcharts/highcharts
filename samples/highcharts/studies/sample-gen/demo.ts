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
    legend: {},
    chart: {
        backgroundColor: '#ffefc1'
    }
});

// GUI elements for demo purposes
HighchartsControls.controls('highcharts-controls', {
    controls: [{
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
        type: 'number',
        path: 'title.x'
    },
    {
        type: 'number',
        path: 'title.y'
    },
    {
        type: 'boolean',
        path: 'legend.enabled'
    },
    {
        type: 'color',
        path: 'chart.backgroundColor',
        value: '#ffefc1'
    }]
});
