Highcharts.chart('container', {
    chart: {
        type: 'pie'
    },

    title: {
        text: 'Support requests'
    },

    colors: [
        '#1b998b',
        '#d7bea8',
        '#776885',
        '#5f1a37',
        'var(--highcharts-neutral-color-100, #04030f)'
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
            ['Webform', 34],
            ['Call', 25],
            ['Email', 23],
            ['Webchat', 11],
            ['Other', 7]
        ]
    }]
});
