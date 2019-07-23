Highcharts.chart('container', {
    tooltip: {
        outside: true,
        useHTML: true
    },
    series: [{
        data: [1, 4, 3, 5, 6, 7, 4, 3, 5, 2, 3, 4, 6, 5, 4],
        type: 'line'
    }, {
        data: [1, 2, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2],
        type: 'spline'
    }]
});