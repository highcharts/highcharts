Highcharts.chart('container', {
    title: {
        text: null
    },

    xAxis: {
        categories: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ]
    },

    yAxis: [
        {
            title: {
                text: 'Price'
            },
            type: 'logarithmic',
            labels: {
                format: '${text}'
            }
        },
        {
            opposite: true,
            title: {
                text: 'Price'
            },
            labels: {
                format: '${text}'
            }
        }
    ],

    tooltip: {
        valuePrefix: '$'
    },

    series: [
        {
            data: [5, 10, 15, 20, 25, 30, 15],

            name: 'Logarithmic'
        },
        {
            data: [5, 10, 15, 20, 25, 30, 15],
            name: 'Linear',
            yAxis: 1
        }
    ]
});
