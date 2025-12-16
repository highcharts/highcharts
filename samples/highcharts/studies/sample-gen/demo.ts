Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>plotOptions.column</em> options'
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
    plotOptions: {
        column: {
            borderColor: '#333333',
            borderRadius: 3
        }
    }
});

// Highcharts Controls for demo purpose
HighchartsControls.controls('highcharts-controls', {
    target: Highcharts.charts[0],
    controls: [{
        type: 'color',
        path: 'plotOptions.column.borderColor',
        value: '#333333'
    },
    {
        type: 'number',
        path: 'plotOptions.column.borderWidth',
        range: [
            0,
            5
        ]
    },
    {
        type: 'number',
        path: 'plotOptions.column.borderRadius',
        range: [
            0,
            100
        ],
        value: 3
    }]
});
