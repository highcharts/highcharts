Highcharts.stockChart('container', {

    rangeSelector: {
        verticalAlign: 'top'
    },

    series: [{
        pointStart: '2025-01-01',
        pointInterval: 24 * 36e5,
        data: [10, 30, 20, 40, 30, 11]
    }]
});
