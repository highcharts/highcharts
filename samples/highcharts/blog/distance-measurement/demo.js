Highcharts.chart('container', {
    title: {
        text: 'Distance measurements'
    },
    xAxis: [{
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }],

    tooltip: {
        shared: true
    },

    series: [{
        name: 'Temperature',
        type: 'scatter',
        data: [7.0, 8, 9, 5, 10, 14, 10, 7, 8, 12, 11, 9]
    }, {
        name: 'Temperature error',
        type: 'errorbar',
        data: [
            [6, 8],
            [7, 9],
            [8, 10],
            [4, 6],
            [9, 11],
            [13, 15],
            [9, 11],
            [8, 6],
            [9, 7],
            [11, 13],
            [10, 12],
            [10, 8]
        ]
    }]
});
