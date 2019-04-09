Highcharts.stockChart('container', {

    chart: {
        styledMode: true
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        type: 'candlestick',
        name: 'USD to EUR',
        data: ohlcdata
    }]
});
