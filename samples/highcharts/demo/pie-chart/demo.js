Highcharts.chart('container', {
    chart: {
        type: 'pie'
    },

    title: {
        text: 'Support requests'
    },

    colors: [
        'var(--highcharts-color-0, #544fc5)',
        'var(--highcharts-neutral-color-60, #666666)',
        'var(--highcharts-neutral-color-40, #999999)',
        'var(--highcharts-neutral-color-20, #cccccc)',
        'var(--highcharts-neutral-color-10, #e6e6e6)'
    ],

    tooltip: {
        valueSuffix: '%'
    },

    series: [{
        name: 'Requests',
        colorByPoint: true,
        borderWidth: 3,
        // We can show multiple data labels per point
        dataLabels: [{
            format: '{point.name}'
        }, {
            format: '{point.percentage:.0f}%',
            distance: -30, // Placing the label inside
            style: {
                fontSize: '0.9em',
                textOutline: 'none'
            }
        }],
        data: [
            ['Webform', 55],
            ['Call', 17],
            ['Email', 7],
            ['Webchat', 5],
            ['Other', 3]
        ]
    }]
});
