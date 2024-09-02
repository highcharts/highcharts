Highcharts.chart('container', {
    chart: {
        type: 'spline',
        zooming: {
            type: 'xy'
        }
    },
    title: {
        text: 'comparison of chart performance with and without data grouping'
    },
    series: [
        {
            name: 'Data Grouping disabled',
            data: [66, 82, 137, 199, 726, 1348]
        },
        {
            name: 'Data Grouping enabled',
            data: [59, 66, 68, 81, 96, 116]
        }
    ],
    xAxis: {
        title: {
            text: 'Sample size'
        },
        labels: {
            format: '{(divide value 1000)}k'
        },
        categories: [10, 1000, 5000, 10000, 50000, 100000]
    },
    tooltip: {
        shared: true
    },
    yAxis: {
        title: {
            text: 'Time (s)'
        },
        labels: {
            format: '{(divide value 1000)}'
        },
        min: 0
    }
});
