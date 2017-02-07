
Highcharts.chart('container', {
    title: {
        text: 'Styled color zones'
    },

    yAxis: {
        min: -10
    },

    plotOptions: {
        series: {
            zones: [{
                value: 0,
                className: 'zone-0'
            }, {
                value: 10,
                className: 'zone-1'
            }, {
                className: 'zone-2'
            }],
            threshold: -10
        }
    },

    series: [{
        type: 'areaspline',
        data: [-10, -5, 0, 5, 10, 15, 10, 10, 5, 0, -5]
    }, {
        type: 'column',
        data: [1, 13, 2, -4, 6, 7, 5, 3, 2, -1, 2]
    }]
});