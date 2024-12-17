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
        data: [10, 30, 20, 40, 30, 11]
    }]
});
