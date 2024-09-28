Highcharts.chart('container', {
    title: {
        text: 'Fibonacci annotation: normal and reversed'
    },
    annotations: [{
        type: 'fibonacci',
        typeOptions: {
            points: [{
                x: 1,
                y: 4
            }, {
                x: 4,
                y: 4
            }],
            reversed: true
        }
    }, {
        type: 'fibonacci',
        typeOptions: {
            points: [{
                x: 5,
                y: 4
            }, {
                x: 8,
                y: 4
            }]
        }
    }],

    series: [{
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }]
});
