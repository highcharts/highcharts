Highcharts.chart('container', {
    chart: {
        parallelCoordinates: true,
        parallelAxes: {
            tickAmount: 2
        },
        inverted: true
    },
    title: {
        text: 'Highcharts - inverted parallel coordinates chart'
    },
    yAxis: [{
        reversed: true
    }, {
        reversed: false
    }, {
        type: 'category'
    }, {
        type: 'datetime'
    }, {
        type: 'logarithmic'
    }],
    series: [{
        data: [1, 2, 3, Date.UTC(2017, 0, 1), 10000, 3, 1, 2, 3, 1000]
    }, {
        data: [5, 10, 12, Date.UTC(2018, 0, 1), 0.5, 5, -20, 1000, 9, 10]
    }]
});