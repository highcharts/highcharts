Highcharts.chart('container', {
    chart: {
        type: 'area'
    },
    title: {
        text: 'High contrast mode with custom colors'
    },
    accessibility: {
        highContrastMode: true, // force high contrast mode,
        highContrastTheme: {
            colors: [
                '#ff0000',
                {
                    pattern: {
                        ...Highcharts.patterns[6],
                        backgroundColor: 'window',
                        color: '#ffea00'
                    }
                },
                {
                    pattern: {
                        ...Highcharts.patterns[5],
                        backgroundColor: '#041867',
                        color: 'window'
                    }
                }
            ]
        }
    },
    series: [
        {
            data: [5, 5, 5, 5, 5, 5]
        },
        {
            data: [0, 1, 2, 3, 4, 5]
        },
        {
            data: [5, 4, 3, 2, 1, 0]
        }
    ]
});
