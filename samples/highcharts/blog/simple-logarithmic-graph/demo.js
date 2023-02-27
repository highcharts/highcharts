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

    yAxis: {
        title: {
            text: 'Price'
        },
        type: 'logarithmic',
        labels: {
            format: '${text}'
        },
        plotBands: [
            {
                color: 'rgba(255, 87, 51 ,0.4)',
                label: {
                    text: '$5 up (50%)'
                },
                from: 5, // Start of the plot band
                to: 10 // End of the plot band
            },
            {
                color: 'rgba(255, 195, 0,0.4)',
                label: {
                    text: '$5 up (25%)'
                },
                from: 20, // Start of the plot band
                to: 25 // End of the plot band
            }
        ]
    },

    tooltip: {
        valuePrefix: '$'
    },

    series: [
        {
            data: [5, 10, 15, 20, 25, 30, 15],
            name: 'Price'
        }
    ]
});
