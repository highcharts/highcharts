
Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },

    title: {
        text: 'Set dash style by CSS'
    },

    legend: {
        symbolWidth: 80
    },

    series: [{
        data: [1, 3, 2, 4, 5, 4, 6, 2, 3, 5, 6]
    }, {
        data: [2, 4, 1, 3, 4, 2, 9, 1, 2, 3, 4, 5]
    }]
});