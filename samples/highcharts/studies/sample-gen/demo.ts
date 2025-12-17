Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>legend</em> options'
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
    legend: {}
});

// GUI elements for demo purposes
HighchartsControls.controls('highcharts-controls', {
    controls: [{
        type: 'array-of-strings',
        path: 'legend.align',
        options: [
            'left',
            'center',
            'right'
        ]
    },
    {
        type: 'array-of-strings',
        path: 'legend.verticalAlign',
        options: [
            'top',
            'middle',
            'bottom'
        ]
    },
    {
        type: 'array-of-strings',
        path: 'legend.layout',
        options: [
            'horizontal',
            'vertical',
            'proximate'
        ]
    }]
});
