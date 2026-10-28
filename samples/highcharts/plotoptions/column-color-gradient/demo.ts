Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of ' +
               '<em>plotOptions.column.color.linearGradient.gradientUnits</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    plotOptions: {
        column: {
            color: {
                linearGradient: {
                    gradientUnits: 'objectBoundingBox',
                    x1: 0,
                    x2: 0,
                    y1: '10%',
                    y2: '100%'
                },
                stops: [
                    [
                        0,
                        '#2caffe'
                    ],
                    [
                        1,
                        'var(--highcharts-background-color)'
                    ]
                ]
            }
        }
    },
    series: [{
        data: [1, 3, 2, 4]
    }]
});
