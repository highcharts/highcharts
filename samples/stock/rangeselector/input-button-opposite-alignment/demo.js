Highcharts.stockChart('container', {
    rangeSelector: {
        verticalAlign: 'top',
        buttonPosition: {
            align: 'right'
        },
        inputPosition: {
            align: 'left'
        }
    },
    series: [{
        data: [10, 30, 20, 40, 30, 11]
    }]
});
