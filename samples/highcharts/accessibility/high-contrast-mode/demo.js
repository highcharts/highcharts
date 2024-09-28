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
                '#FFFFFF',
                '#f9455a',
                '#041867'
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
