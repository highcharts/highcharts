
Highcharts.stockChart('container', {

    rangeSelector: {
        selected: 1
    },

    series: [{
        type: 'ohlc',
        name: 'USD to EUR',
        data: ohlcdata
    }]
});
