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

    xAxis: {
        categories: [
            'Cat1',
            'Cat2',
            'Cat3',
            'Cat4',
            'Cat5',
            'Cat6',
            'Cat7',
            'Cat8',
            'Cat9',
            'Cat10'
        ],
        labels: {
            style: {
                fontWeight: 'bold'
            }
        },
        offset: 30
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
        data: [1, 2, 3, '2017-01-01', 10000, 3, 1, 2, 3, 1000]
    }, {
        data: [5, 10, 12, '2018-01-01', 0.5, 5, -20, 1000, 9, 10]
    }]
});