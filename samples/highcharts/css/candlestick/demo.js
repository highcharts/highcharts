
Highcharts.stockChart('container', {

    rangeSelector: {
        selected: 1
    },

    series: [{
        type: 'candlestick',
        name: 'USD to EUR',
        data: ohlcdata
    }]
});
