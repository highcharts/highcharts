Highcharts.stockChart('container', {
    rangeSelector: {
        dropdown: 'always',
        buttonPosition: {
            align: 'right'
        },
        inputPosition: {
            align: 'right'
        }
    },
    series: [{
        pointStart: '2025-01-01',
        pointInterval: 24 * 36e5,
        data: [10, 30, 20, 40, 30, 11]
    }]
});
